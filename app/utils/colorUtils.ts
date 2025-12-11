/**
 * Convertit une couleur hexadécimale en RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Supprimer le # si présent
  hex = hex.replace('#', '');

  // Gérer les formats courts (#RGB)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calcule la luminosité relative d'une couleur (0-1)
 * Basé sur la formule WCAG pour le contraste
 */
export function getRelativeLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0.5; // Valeur par défaut si la conversion échoue

  // Normaliser les valeurs RGB (0-1)
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Appliquer la fonction gamma
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculer la luminosité relative
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Détermine si une couleur est "claire" ou "foncée"
 * Retourne true si la couleur est claire
 */
export function isLightColor(color: string): boolean {
  const luminance = getRelativeLuminance(color);
  return luminance > 0.5;
}

/**
 * Retourne la meilleure couleur de texte (noir ou blanc) pour un fond donné
 * afin d'assurer un bon contraste
 */
export function getContrastColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#1A1A1A' : '#FFFFFF';
}

/**
 * Calcule le ratio de contraste entre deux couleurs
 * Retourne un nombre entre 1 et 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Vérifie si le contraste entre deux couleurs est suffisant selon les normes WCAG
 * @param foreground - Couleur du texte
 * @param background - Couleur du fond
 * @param level - 'AA' (4.5:1) ou 'AAA' (7:1)
 */
export function hasGoodContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AAA' ? ratio >= 7 : ratio >= 4.5;
}
