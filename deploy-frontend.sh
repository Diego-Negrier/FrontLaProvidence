#!/bin/bash

set -euo pipefail

# ==========================================
# 🌐 CONFIGURATION PROJET
# ==========================================

PROJECT_NAME="FrontLaProvidence"
PROJECT_URL="https://laprovidence.data-worlds.com"
GIT_REMOTE="origin"
GIT_BRANCH="main"

# ==========================================
# 🐳 CONFIGURATION DOCKER
# ==========================================

IMAGE_NAME="frontlaprovidence"
IMAGE_TAG="latest"
FULL_IMAGE="$IMAGE_NAME:$IMAGE_TAG"
CONTAINER_NAME="frontlaprovidence"
SERVICE_NAME="frontlaprovidence"

# ==========================================
# 📁 CHEMINS
# ==========================================

# Local (Mac)
LOCAL_SOURCE_PATH="."
LOCAL_ENV_PATH=".env.production"
BUILD_CONTEXT="."

# NAS
NAS_HOST="dataworlds"
NAS_PROJECT_PATH="/volume1/web/ProjetLaProvidence/FrontLaProvidence"
NAS_DOCKER_PATH="/usr/local/bin/docker"

# ==========================================
# 🎨 COLORS & LOGGING
# ==========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

log_step() {
    echo -e "\n${BLUE}🔷 $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}" >&2
}

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_git() {
    echo -e "${MAGENTA}🔀 $1${NC}"
}

# ==========================================
# 📋 BANNER
# ==========================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${CYAN}🚀 Deployment Script - $PROJECT_NAME${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  Project:  ${GREEN}$PROJECT_NAME${NC}"
echo -e "  URL:      ${BLUE}$PROJECT_URL${NC}"
echo -e "  NAS Host: ${YELLOW}$NAS_HOST${NC}"
echo -e "  Image:    ${CYAN}$FULL_IMAGE${NC}"
echo -e "  Branch:   ${MAGENTA}$GIT_BRANCH${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ==========================================
# 🔀 SYNCHRONISATION GIT
# ==========================================

log_step "Git Synchronization"

if [ ! -d ".git" ]; then
    log_error "Not a git repository"
    exit 1
fi

log_git "Current status:"
git status --short

echo ""

if git diff-index --quiet HEAD -- 2>/dev/null; then
    log_info "No changes to commit"
else
    echo ""
    read -p "📝 Commit changes? (y/n): " -n 1 -r COMMIT_REPLY
    echo ""
    
    if [[ $COMMIT_REPLY =~ ^[Yy]$ ]]; then
        log_git "Adding all files..."
        git add .
        
        echo ""
        log_git "Files to be committed:"
        git status --short
        echo ""
        
        read -p "💬 Commit message: " COMMIT_MSG
        
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="Update $(date +%Y-%m-%d\ %H:%M:%S)"
            log_info "Using default message: $COMMIT_MSG"
        fi
        
        if git commit -m "$COMMIT_MSG"; then
            log_success "Changes committed"
        else
            log_error "Commit failed"
            exit 1
        fi
    else
        log_warning "Skipping commit"
    fi
fi

UNPUSHED_COMMITS=$(git log "$GIT_REMOTE/$GIT_BRANCH..HEAD" --oneline 2>/dev/null | wc -l | tr -d ' ')

if [ "$UNPUSHED_COMMITS" -gt 0 ]; then
    echo ""
    log_git "Found $UNPUSHED_COMMITS unpushed commit(s)"
    
    echo ""
    git log "$GIT_REMOTE/$GIT_BRANCH..HEAD" --oneline --decorate -5
    echo ""
    
    read -p "📤 Push to $GIT_REMOTE/$GIT_BRANCH? (y/n): " -n 1 -r PUSH_REPLY
    echo ""
    
    if [[ $PUSH_REPLY =~ ^[Yy]$ ]]; then
        log_git "Pushing to $GIT_REMOTE/$GIT_BRANCH..."
        
        if git push "$GIT_REMOTE" "$GIT_BRANCH"; then
            log_success "Push successful"
        else
            log_error "Push failed"
            echo ""
            read -p "❓ Continue deployment anyway? (y/n): " -n 1 -r CONTINUE_REPLY
            echo ""
            
            if [[ ! $CONTINUE_REPLY =~ ^[Yy]$ ]]; then
                log_error "Deployment cancelled"
                exit 1
            fi
        fi
    else
        log_warning "Skipping push"
    fi
else
    log_success "Already up to date with $GIT_REMOTE/$GIT_BRANCH"
fi

echo ""
log_git "Latest commit:"
git log -1 --oneline --decorate
echo ""

# ==========================================
# ✅ VERIFICATION BUILDX
# ==========================================

log_step "Checking Docker Buildx..."

if ! docker buildx version &>/dev/null; then
    log_error "Docker Buildx not found. Please update Docker Desktop"
    exit 1
fi

log_success "Buildx ready"

# ==========================================
# ✅ VERIFICATION DOCKERFILE
# ==========================================

log_step "Locating Dockerfile..."

if [ ! -f "$BUILD_CONTEXT/Dockerfile" ]; then
    log_error "Dockerfile not found at: $BUILD_CONTEXT/Dockerfile"
    log_info "Current directory: $(pwd)"
    exit 1
fi

log_success "Found Dockerfile at $BUILD_CONTEXT/Dockerfile"

# ==========================================
# ✅ SYNCHRONISATION FICHIERS DE CONFIG
# ==========================================

log_step "Syncing configuration files to NAS..."

ssh "$NAS_HOST" "mkdir -p $NAS_PROJECT_PATH" || {
    log_error "Failed to create directory on NAS"
    exit 1
}

# 1. Sync .env.production
if [ -f "$LOCAL_ENV_PATH" ]; then
    log_info "Syncing .env.production..."
    
    if cat "$LOCAL_ENV_PATH" | ssh "$NAS_HOST" "cat > $NAS_PROJECT_PATH/.env"; then
        REMOTE_SIZE=$(ssh "$NAS_HOST" "wc -c < $NAS_PROJECT_PATH/.env" 2>/dev/null || echo "0")
        LOCAL_SIZE=$(wc -c < "$LOCAL_ENV_PATH")
        
        if [ "$REMOTE_SIZE" -eq "$LOCAL_SIZE" ]; then
            log_success ".env.production synced ($REMOTE_SIZE bytes)"
        else
            log_warning "Size mismatch: local=$LOCAL_SIZE, remote=$REMOTE_SIZE"
        fi
    else
        log_error "Failed to sync .env.production"
        exit 1
    fi
else
    log_error ".env.production NOT FOUND at $LOCAL_ENV_PATH"
    exit 1
fi

# 2. Sync docker-compose.yml (PRODUCTION VERSION)
# Note: docker-compose.yml est à la racine du projet, pas dans DataWorlds/
COMPOSE_LOCAL_PATH="docker-compose.yml"
if [ -f "$COMPOSE_LOCAL_PATH" ]; then
    log_info "Syncing docker-compose.yml to NAS..."
    log_info "This will OVERWRITE the docker-compose.yml on NAS"

    if cat "$COMPOSE_LOCAL_PATH" | ssh "$NAS_HOST" "cat > $NAS_PROJECT_PATH/docker-compose.yml"; then
        log_success "docker-compose.yml synced to NAS"
        log_info "✓ Using pre-built image (no build: section)"
        log_info "✓ Using correct env file (.env)"
    else
        log_error "Failed to sync docker-compose.yml"
        exit 1
    fi

    # Vérifier que le fichier sur NAS n'a pas de section 'build:'
    if ssh "$NAS_HOST" "grep -q 'build:' $NAS_PROJECT_PATH/docker-compose.yml"; then
        log_error "ERROR: docker-compose.yml on NAS still contains 'build:' section!"
        log_error "This will cause deployment to fail. Check the sync process."
        exit 1
    else
        log_success "Verified: No 'build:' section in docker-compose.yml on NAS"
    fi
else
    log_error "docker-compose.yml NOT FOUND at $COMPOSE_LOCAL_PATH"
    exit 1
fi

# 3. Sync README (documentation sur le NAS)
README_LOCAL="NAS-DEPLOYMENT.md"
if [ -f "$README_LOCAL" ]; then
    log_info "Syncing documentation to NAS..."

    # Créer un README simplifié pour le NAS
    cat > /tmp/NAS-README.txt << 'EOFREADME'
================================================================================
  ⚠️  ATTENTION - FICHIERS GÉRÉS AUTOMATIQUEMENT
================================================================================

Ce dossier contient des fichiers qui sont AUTOMATIQUEMENT SYNCHRONISÉS
depuis votre Mac lors du déploiement.

❌ NE PAS MODIFIER CES FICHIERS DIRECTEMENT SUR LE NAS :

  • docker-compose.yml  → Synced depuis Mac
  • .env                 → Synced depuis Mac (.env.production)

✅ POUR MODIFIER LA CONFIGURATION :

  1. Modifiez les fichiers locaux sur votre Mac dans :
     SynologyDrive/APPLICATION_PROJET/DataWorlds/

  2. Relancez le script de déploiement :
     ./deploy-backend.sh

  3. Les fichiers seront automatiquement synchronisés vers le NAS

================================================================================
  🔧 Commandes utiles
================================================================================

Voir les logs :
  /usr/local/bin/docker logs -f dataworlds

Redémarrer :
  cd /volume1/web/DataWorlds && /usr/local/bin/docker compose restart dataworlds

Status :
  /usr/local/bin/docker ps --filter name=dataworlds

Accéder au shell :
  /usr/local/bin/docker exec -it dataworlds /bin/bash

================================================================================
  📚 Documentation complète : NAS-DEPLOYMENT.md (sur votre Mac)
================================================================================
EOFREADME

    if cat /tmp/NAS-README.txt | ssh "$NAS_HOST" "cat > $NAS_PROJECT_PATH/README-AUTOMATIC-SYNC.txt"; then
        log_success "Documentation synced to NAS"
        rm -f /tmp/NAS-README.txt
    else
        log_warning "Failed to sync README (non-critical)"
        rm -f /tmp/NAS-README.txt
    fi
fi

log_success "All configuration files synchronized"

# ==========================================
# 🧹 NETTOYAGE DES ANCIENNES IMAGES LOCALES
# ==========================================

log_step "Cleaning up old local images..."

# Compter et afficher les images existantes
EXISTING_IMAGES=$(docker images "$IMAGE_NAME" --format "{{.Repository}}:{{.Tag}}" 2>/dev/null | wc -l | tr -d ' ')
if [ "$EXISTING_IMAGES" -gt 0 ]; then
    log_info "Found $EXISTING_IMAGES existing $IMAGE_NAME image(s):"
    docker images "$IMAGE_NAME" --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}"
    echo ""
fi

# Supprimer TOUTES les images dataworlds localement (on va en créer une nouvelle propre)
log_info "Removing all existing $IMAGE_NAME images..."
docker images "$IMAGE_NAME" -q | xargs -r docker rmi -f 2>/dev/null || true

# Supprimer les images dangling
log_info "Removing dangling images..."
docker images -f "dangling=true" -q | xargs -r docker rmi -f 2>/dev/null || true

log_success "Local cleanup complete"

# ==========================================
# 🏗️  BUILD DE L'IMAGE DOCKER
# ==========================================

log_step "Building Docker image..."
log_info "Image name: $FULL_IMAGE"
log_info "Platform:   linux/amd64"
log_info "Context:    $BUILD_CONTEXT"

BUILD_START=$(date +%s)

if docker buildx build \
    --platform linux/amd64 \
    --tag "$FULL_IMAGE" \
    --build-arg NEXT_PUBLIC_API_URL=https://api-laprovidence.data-worlds.com \
    --build-arg NEXT_PUBLIC_APP_NAME="La Providence" \
    --build-arg NEXT_PUBLIC_APP_VERSION=1.0.0 \
    --build-arg NEXT_PUBLIC_MEDIA_BASE_URL=https://dataworlds.direct.quickconnect.to/public/LaProvidence/media \
    --load \
    "$BUILD_CONTEXT"; then
    
    BUILD_END=$(date +%s)
    BUILD_TIME=$((BUILD_END - BUILD_START))
    
    log_success "Image built successfully in ${BUILD_TIME}s"
else
    log_error "Docker build failed"
    exit 1
fi

# ==========================================
# 📊 INFORMATIONS SUR L'IMAGE
# ==========================================

log_step "Inspecting image..."

# Vérifier qu'il n'y a qu'UNE SEULE image avec ce tag
IMAGE_COUNT=$(docker images "$FULL_IMAGE" --format "{{.ID}}" | wc -l | tr -d ' ')

if [ "$IMAGE_COUNT" -eq 0 ]; then
    log_error "No image found after build!"
    exit 1
elif [ "$IMAGE_COUNT" -gt 1 ]; then
    log_warning "Multiple images found with tag $FULL_IMAGE!"
    docker images "$FULL_IMAGE" --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}"
    log_error "This should not happen. Aborting."
    exit 1
fi

IMAGE_ID=$(docker images "$FULL_IMAGE" --format "{{.ID}}")
IMAGE_SIZE=$(docker images "$FULL_IMAGE" --format "{{.Size}}")

log_info "Image ID:   $IMAGE_ID"
log_info "Image Size: $IMAGE_SIZE"
log_success "Exactly 1 image found (no duplicates)"

# ==========================================
# 💾 SAUVEGARDE DE L'IMAGE (COMPRESSÉE)
# ==========================================

log_step "Saving and compressing Docker image..."

TAR_FILE="/tmp/${IMAGE_NAME}_${IMAGE_TAG}.tar.gz"
rm -f "$TAR_FILE"

# Utiliser pigz (gzip parallèle) si disponible, sinon fallback sur gzip
if command -v pigz &> /dev/null; then
    log_info "Saving image with parallel compression (pigz)..."
    COMPRESS_CMD="pigz -1"
else
    log_info "Saving image with standard compression (gzip)..."
    COMPRESS_CMD="gzip -1"
fi

if docker save "$FULL_IMAGE" | $COMPRESS_CMD > "$TAR_FILE"; then
    TAR_SIZE=$(du -h "$TAR_FILE" | cut -f1)
    log_success "Image saved and compressed: $TAR_FILE ($TAR_SIZE)"
else
    log_error "Failed to save image"
    exit 1
fi

# ==========================================
# 📤 TRANSFERT VERS LE NAS (AVEC PROGRESSION)
# ==========================================

log_step "Transferring image to NAS..."
log_info "Destination: $NAS_HOST:$NAS_PROJECT_PATH"
log_info "This may take several minutes depending on image size..."

TRANSFER_START=$(date +%s)

ssh "$NAS_HOST" "mkdir -p $NAS_PROJECT_PATH"

# Utiliser pv si disponible pour afficher la progression, sinon fallback sur cat
if command -v pv &> /dev/null; then
    log_info "Transferring with progress indicator..."
    if pv "$TAR_FILE" | ssh "$NAS_HOST" "cat > $NAS_PROJECT_PATH/${IMAGE_NAME}_${IMAGE_TAG}.tar.gz"; then
        TRANSFER_END=$(date +%s)
        TRANSFER_TIME=$((TRANSFER_END - TRANSFER_START))
        log_success "Transfer completed in ${TRANSFER_TIME}s"
    else
        log_error "Transfer failed"
        rm -f "$TAR_FILE"
        exit 1
    fi
else
    log_info "Transferring (install 'pv' for progress indicator)..."
    if cat "$TAR_FILE" | ssh "$NAS_HOST" "cat > $NAS_PROJECT_PATH/${IMAGE_NAME}_${IMAGE_TAG}.tar.gz"; then
        TRANSFER_END=$(date +%s)
        TRANSFER_TIME=$((TRANSFER_END - TRANSFER_START))
        log_success "Transfer completed in ${TRANSFER_TIME}s"
    else
        log_error "Transfer failed"
        rm -f "$TAR_FILE"
        exit 1
    fi
fi

# ==========================================
# 🔄 CHARGEMENT DE L'IMAGE SUR LE NAS
# ==========================================

log_step "Loading image on NAS..."

# D'abord, vérifier les images existantes sur le NAS
log_info "Checking existing images on NAS..."
ssh "$NAS_HOST" "$NAS_DOCKER_PATH images '$IMAGE_NAME' --format 'table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}'" || true
echo ""

# Supprimer TOUTES les anciennes images dataworlds sur le NAS (y compris dataworlds-dataworlds)
log_info "Removing ALL existing dataworlds images on NAS..."
ssh "$NAS_HOST" "$NAS_DOCKER_PATH images | grep '$IMAGE_NAME' | awk '{print \$3}' | xargs -r $NAS_DOCKER_PATH rmi -f" 2>/dev/null || true

# Charger la nouvelle image (décompression + chargement)
log_info "Decompressing and loading new image..."
log_warning "This step can take 2-5 minutes - please wait..."
echo ""

LOAD_START=$(date +%s)

# Utiliser pigz sur le NAS si disponible pour décompression parallèle
DECOMPRESS_CMD="gunzip -c"
if ssh "$NAS_HOST" "command -v pigz" &>/dev/null; then
    log_info "Using pigz for parallel decompression on NAS"
    DECOMPRESS_CMD="pigz -dc"
fi

# Exécuter en mode verbose pour voir la progression
if ssh "$NAS_HOST" "$DECOMPRESS_CMD $NAS_PROJECT_PATH/${IMAGE_NAME}_${IMAGE_TAG}.tar.gz | $NAS_DOCKER_PATH load"; then
    LOAD_END=$(date +%s)
    LOAD_TIME=$((LOAD_END - LOAD_START))
    
    log_success "Image loaded on NAS in ${LOAD_TIME}s"
    
    # Vérifier qu'il n'y a qu'une seule image
    NAS_IMAGE_COUNT=$(ssh "$NAS_HOST" "$NAS_DOCKER_PATH images '$FULL_IMAGE' --format '{{.ID}}'" | wc -l | tr -d ' ')
    
    if [ "$NAS_IMAGE_COUNT" -eq 1 ]; then
        NAS_IMAGE_ID=$(ssh "$NAS_HOST" "$NAS_DOCKER_PATH images '$FULL_IMAGE' --format '{{.ID}}'")
        log_success "Exactly 1 image on NAS (no duplicates)"
        log_info "NAS Image ID: $NAS_IMAGE_ID"
    else
        log_warning "Found $NAS_IMAGE_COUNT images on NAS (expected 1)"
        ssh "$NAS_HOST" "$NAS_DOCKER_PATH images '$IMAGE_NAME' --format 'table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}'"
    fi
else
    log_error "Failed to load image on NAS"
    rm -f "$TAR_FILE"
    exit 1
fi

# ==========================================
# 🧹 NETTOYAGE DES IMAGES DANGLING SUR NAS
# ==========================================

log_step "Cleaning up dangling images on NAS..."

ssh "$NAS_HOST" "$NAS_DOCKER_PATH images -f 'dangling=true' -q | xargs -r $NAS_DOCKER_PATH rmi -f" 2>/dev/null || true

# Supprimer le tar.gz
log_info "Removing compressed archive from NAS..."
ssh "$NAS_HOST" "rm -f $NAS_PROJECT_PATH/${IMAGE_NAME}_${IMAGE_TAG}.tar.gz" || true

log_success "NAS cleanup complete"

# ==========================================
# 🚀 DEPLOIEMENT SUR NAS
# ==========================================

log_step "Deploying $PROJECT_NAME on NAS..."
log_info "Service:  $SERVICE_NAME"
log_info "Location: $NAS_PROJECT_PATH"

log_info "Stopping existing container..."
ssh "$NAS_HOST" "cd $NAS_PROJECT_PATH && $NAS_DOCKER_PATH compose down $SERVICE_NAME" 2>/dev/null || true

# CRITIQUE: Utiliser --no-build pour forcer l'utilisation de l'image pré-buildée
log_info "Starting new container (using pre-built image)..."
log_warning "Using --no-build flag to prevent rebuilding..."

if ssh "$NAS_HOST" "cd $NAS_PROJECT_PATH && $NAS_DOCKER_PATH compose up -d --no-build $SERVICE_NAME"; then
    log_success "Container started successfully"
else
    log_error "Failed to start container"
    
    log_info "Checking for build-related issues in docker-compose.yml..."
    ssh "$NAS_HOST" "grep -A5 'build:' $NAS_PROJECT_PATH/docker-compose.yml" || log_info "No build section found"
    
    exit 1
fi

log_info "Waiting for container to be ready..."
sleep 5

# ==========================================
# ✅ VERIFICATION DU DEPLOIEMENT
# ==========================================

log_step "Verifying deployment..."

CONTAINER_STATUS=$(ssh "$NAS_HOST" "$NAS_DOCKER_PATH ps --filter name=$CONTAINER_NAME --format '{{.Status}}'" || echo "not found")

if [[ "$CONTAINER_STATUS" == *"Up"* ]]; then
    log_success "Container is running"
    log_info "Status: $CONTAINER_STATUS"
else
    log_error "Container is not running properly"
    log_info "Status: $CONTAINER_STATUS"
    
    log_info "Container logs:"
    ssh "$NAS_HOST" "$NAS_DOCKER_PATH logs --tail 50 $CONTAINER_NAME" || true
    exit 1
fi

log_info "Recent logs:"
ssh "$NAS_HOST" "$NAS_DOCKER_PATH logs --tail 20 $CONTAINER_NAME" || true

# ==========================================
# 🧹 NETTOYAGE LOCAL
# ==========================================

log_step "Cleaning up local files..."
rm -f "$TAR_FILE"
log_success "Local cleanup complete"

# ==========================================
# 📊 VERIFICATION FINALE DES IMAGES
# ==========================================

log_step "Final image verification..."

echo ""
log_info "Local images:"
docker images "$IMAGE_NAME" --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}"

echo ""
log_info "NAS images (should be ONLY dataworlds:latest):"
ssh "$NAS_HOST" "$NAS_DOCKER_PATH images | grep -E '(REPOSITORY|$IMAGE_NAME)'"

# Compter le nombre total d'images dataworlds sur le NAS
TOTAL_NAS_IMAGES=$(ssh "$NAS_HOST" "$NAS_DOCKER_PATH images | grep '$IMAGE_NAME' | wc -l" | tr -d ' ')
if [ "$TOTAL_NAS_IMAGES" -eq 1 ]; then
    log_success "✓ Exactly 1 dataworlds image on NAS (perfect!)"
else
    log_warning "Found $TOTAL_NAS_IMAGES dataworlds images on NAS (expected 1)"
fi

# ==========================================
# 🎉 RÉSUMÉ DU DÉPLOIEMENT
# ==========================================

TOTAL_TIME=$(($(date +%s) - BUILD_START))
LAST_COMMIT=$(git log -1 --oneline --decorate)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ Deployment Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  Project:       ${CYAN}$PROJECT_NAME${NC}"
echo -e "  URL:           ${BLUE}$PROJECT_URL${NC}"
echo -e "  Git Commit:    ${MAGENTA}$LAST_COMMIT${NC}"
echo -e "  Image:         ${CYAN}$FULL_IMAGE${NC}"
echo -e "  Image ID:      ${CYAN}$IMAGE_ID${NC}"
echo -e "  Image Size:    ${CYAN}$IMAGE_SIZE${NC}"
echo -e "  Container:     ${GREEN}$CONTAINER_STATUS${NC}"
echo -e "  Build Time:    ${YELLOW}${BUILD_TIME}s${NC}"
echo -e "  Transfer Time: ${YELLOW}${TRANSFER_TIME}s${NC}"
echo -e "  Load Time:     ${YELLOW}${LOAD_TIME}s${NC}"
echo -e "  Total Time:    ${YELLOW}${TOTAL_TIME}s${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 Visit: $PROJECT_URL${NC}"
echo ""

# ==========================================
# 📱 COMMANDES UTILES
# ==========================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Useful commands:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "View logs:"
echo "  ssh $NAS_HOST '$NAS_DOCKER_PATH logs -f $CONTAINER_NAME'"
echo ""
echo "Restart container:"
echo "  ssh $NAS_HOST 'cd $NAS_PROJECT_PATH && $NAS_DOCKER_PATH compose restart $SERVICE_NAME'"
echo ""
echo "Check images:"
echo "  ssh $NAS_HOST '$NAS_DOCKER_PATH images | grep dataworlds'"
echo ""
echo "Remove duplicate images:"
echo "  ssh $NAS_HOST '$NAS_DOCKER_PATH rmi dataworlds-dataworlds:latest'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0