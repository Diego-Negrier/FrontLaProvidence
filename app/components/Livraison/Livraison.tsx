"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LivraisonsService, type Livreur } from '@/app/services';
import { useTheme } from '@/app/contexts/ThemeContext';
import { FaTruck, FaMapMarkerAlt, FaCreditCard, FaBoxOpen } from 'react-icons/fa';

const Livraison = () => {
  const { theme } = useTheme();
  const [livreurOptions, setLivreurOptions] = useState<Livreur[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLivraisonType] = useState<'domicile' | 'relais'>('domicile');
  const [selectedLivreurId, setSelectedLivreurId] = useState<number | null>(null);
  const [prixLivraisonTotal, setPrixLivraisonTotal] = useState<number | null>(null);
  const router = useRouter();
  const [totalCommande, setTotalCommande] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState<boolean>(false);

  // Fonction pour obtenir l'adresse à partir des coordonnées
  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.display_name) {
        return data.display_name;
      }
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'adresse :", error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  // Fonction pour demander la géolocalisation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsGeolocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        console.log("Position du client :", location);

        // Obtenir l'adresse lisible
        const address = await getAddressFromCoords(location.latitude, location.longitude);
        setUserAddress(address);

        // Enregistrer la position dans la commande
        const storedCommande = localStorage.getItem("commande");
        if (storedCommande) {
          try {
            const parsedCommande = JSON.parse(storedCommande);
            parsedCommande.clientLocation = location;
            parsedCommande.clientAddress = address;
            localStorage.setItem("commande", JSON.stringify(parsedCommande));
            console.log("Position ajoutée à la commande :", parsedCommande);
          } catch (error) {
            console.error("Erreur lors de la mise à jour de la commande avec la position :", error);
          }
        }

        setIsGeolocating(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation :", error);
        setError("Impossible d'obtenir votre position. Veuillez autoriser la géolocalisation.");
        setIsGeolocating(false);
      }
    );
  };

  // Fetch des livreurs à domicile
  useEffect(() => {
    const fetchLivreursData = async () => {
      try {
        const livreurs = await LivraisonsService.getLivreurs();
        setLivreurOptions(livreurs); // Mise à jour des livreurs
      } catch (error) {
        console.error("Erreur dans fetchLivreursData:", error);
        // Ne pas afficher d'erreur si l'endpoint n'existe pas encore
        // setError("Erreur lors de la récupération des livreurs.");
      }
    };

    const fetchLocalStorageData = () => {
      // Récupérer la commande depuis le localStorage
      const storedCommande = localStorage.getItem("commande");

      if (storedCommande) {
        try {
          const parsedCommande = JSON.parse(storedCommande); // Analyse JSON
          console.log("Commande récupérée :", parsedCommande);

          // Le total est maintenant disponible dans parsedCommande
          if (parsedCommande.total !== undefined) {
            setTotalCommande(parsedCommande.total);
          } else {
            // Calculer le total si absent (ne devrait pas arriver)
            console.warn("Champ 'total' manquant, utilisation du total par défaut");
            setTotalCommande(0);
          }
        } catch (error) {
          console.error(
            "Erreur lors de l'analyse de la commande depuis le localStorage :",
            error
          );
        }
      } else {
        console.warn("Aucune commande trouvée dans le localStorage.");
      }
    };

    // Appeler les deux fonctions
    fetchLivreursData();
    fetchLocalStorageData();
  }, []); // Dépendances vides pour ne s'exécuter qu'une seule fois

  // Mise à jour du prix de livraison en fonction du livreur sélectionné
  useEffect(() => {
    const selectedLivreur = livreurOptions.find((livreur) => livreur.pk === selectedLivreurId);

    if (selectedLivreur) {
      setPrixLivraisonTotal(selectedLivreur.prix_livraison);
      localStorage.setItem("selectedLivreur", JSON.stringify(selectedLivreur));

      // Récupérer la commande existante dans le localStorage
      const storedCommande = localStorage.getItem("commande");
      if (storedCommande) {
        try {
          const parsedCommande = JSON.parse(storedCommande);

          // Ajouter le livreur sélectionné à la commande
          parsedCommande.livreur = selectedLivreur;

          // Mettre à jour la commande avec le livreur dans le localStorage
          localStorage.setItem("commande", JSON.stringify(parsedCommande));
          console.log("Commande mise à jour avec le livreur :", parsedCommande);
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la commande :", error);
        }
      } else {
        console.warn("Aucune commande trouvée dans le localStorage pour y ajouter le livreur.");
      }
    } else {
      setPrixLivraisonTotal(null);
      localStorage.removeItem("selectedLivreur");
    }
  }, [selectedLivreurId, livreurOptions]);
  // Redirection vers la page de paiement
  const handlePayment = () => {
    if (!selectedLivreurId && selectedLivraisonType === 'domicile') {
      setError("Veuillez sélectionner un livreur.");
      return;
    }

    router.push('/checkout/paiement');
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: theme.colors.background
    }}>
      {/* Page Title */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: theme.colors.primary,
          fontSize: '2.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <FaTruck /> Options de Livraison
        </h1>
        <p style={{
          color: theme.colors.textSecondary,
          fontSize: '1rem',
          marginTop: '0.5rem'
        }}>
          Choisissez votre mode de livraison et validez votre commande
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: theme.colors.error + '20',
          border: `2px solid ${theme.colors.error}`,
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: theme.colors.error,
          fontWeight: '600'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Geolocation Section */}
      <div style={{
        backgroundColor: theme.colors.cardBg,
        border: `2px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 style={{
            color: theme.colors.primary,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaMapMarkerAlt /> Ma Position
          </h2>
          <button
            onClick={handleGeolocation}
            disabled={isGeolocating}
            style={{
              backgroundColor: isGeolocating ? theme.colors.textSecondary : theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: isGeolocating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              opacity: isGeolocating ? 0.6 : 1
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📍</span>
            {isGeolocating ? 'Localisation en cours...' : 'Utiliser ma position'}
          </button>
        </div>

        <p style={{
          color: theme.colors.textSecondary,
          fontSize: '0.9rem',
          marginBottom: '1rem',
          backgroundColor: theme.colors.background,
          padding: '0.75rem',
          borderRadius: '6px',
          borderLeft: `4px solid ${theme.colors.primary}`
        }}>
          💡 Utilisez votre position pour calculer les frais de livraison les plus précis
        </p>

        {userAddress && (
          <div style={{
            backgroundColor: theme.colors.background,
            border: `2px solid ${theme.colors.success}`,
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <p style={{
              color: theme.colors.success,
              fontWeight: '600',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ✓ Adresse détectée :
            </p>
            <p style={{
              color: theme.colors.text,
              fontSize: '0.95rem',
              margin: 0
            }}>
              {userAddress}
            </p>
          </div>
        )}
      </div>

      {/* Delivery Type Options (Hidden for now as only 'domicile' is active) */}
      {/* You can uncomment this when 'relais' option is implemented */}
      {/*
      <div style={{
        backgroundColor: theme.colors.cardBg,
        border: `2px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          color: theme.colors.primary,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          Type de Livraison
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['domicile', 'relais'].map((type) => (
            <label
              key={type}
              htmlFor={`livraison-${type}`}
              style={{
                backgroundColor: selectedLivraisonType === type ? theme.colors.primary + '10' : theme.colors.background,
                border: `2px solid ${selectedLivraisonType === type ? theme.colors.primary : theme.colors.border}`,
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <input
                type="radio"
                name="livraisonType"
                value={type}
                id={`livraison-${type}`}
                checked={selectedLivraisonType === type}
                onChange={() => {
                  setSelectedLivreurId(null);
                  setPrixLivraisonTotal(null);
                  localStorage.removeItem('selectedLivreur');
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: theme.colors.primary
                }}
              />
              <div>
                <p style={{
                  color: theme.colors.text,
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  margin: 0
                }}>
                  {type === 'domicile' ? '🏠 Livraison à domicile' : '📦 Point relais'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
      */}

      {/* Delivery Company Selection */}
      {selectedLivraisonType === 'domicile' && (
        <div style={{
          backgroundColor: theme.colors.cardBg,
          border: `2px solid ${theme.colors.border}`,
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: theme.colors.primary,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaBoxOpen /> Choisissez votre Transporteur
          </h2>

          <p style={{
            color: theme.colors.textSecondary,
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            backgroundColor: theme.colors.background,
            padding: '0.75rem',
            borderRadius: '6px',
            borderLeft: `4px solid ${theme.colors.primary}`
          }}>
            💡 Sélectionnez le transporteur qui vous convient le mieux en fonction du prix et du service
          </p>

          {livreurOptions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {livreurOptions.map((livreur) => (
                <label
                  key={livreur.pk}
                  htmlFor={`livreur-${livreur.pk}`}
                  style={{
                    backgroundColor: selectedLivreurId === livreur.pk ? theme.colors.primary + '10' : theme.colors.background,
                    border: `2px solid ${selectedLivreurId === livreur.pk ? theme.colors.primary : theme.colors.border}`,
                    borderRadius: '8px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedLivreurId !== livreur.pk) {
                      e.currentTarget.style.borderColor = theme.colors.primary;
                      e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}30`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedLivreurId !== livreur.pk) {
                      e.currentTarget.style.borderColor = theme.colors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <input
                      type="radio"
                      id={`livreur-${livreur.pk}`}
                      name="livreur"
                      value={livreur.pk}
                      checked={selectedLivreurId === livreur.pk}
                      onChange={() => setSelectedLivreurId(livreur.pk)}
                      style={{
                        width: '20px',
                        height: '20px',
                        marginTop: '0.25rem',
                        accentColor: theme.colors.primary
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        <p style={{
                          color: theme.colors.text,
                          fontWeight: '700',
                          fontSize: '1.2rem',
                          margin: 0
                        }}>
                          🚚 {livreur.nom_entreprise}
                        </p>
                        <span style={{
                          backgroundColor: theme.colors.success,
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '1rem',
                          fontWeight: '700'
                        }}>
                          {livreur.prix_livraison.toFixed(2)} €
                        </span>
                      </div>
                      <p style={{
                        color: theme.colors.textSecondary,
                        margin: 0,
                        fontSize: '0.95rem'
                      }}>
                        📋 Service : <span style={{ color: theme.colors.text, fontWeight: '600' }}>{livreur.type_service}</span>
                      </p>
                    </div>
                  </div>

                  {selectedLivreurId === livreur.pk && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: theme.colors.success,
                      color: 'white',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      ✓
                    </div>
                  )}
                </label>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              backgroundColor: theme.colors.background,
              borderRadius: '8px',
              border: `2px dashed ${theme.colors.border}`
            }}>
              <p style={{
                fontSize: '3rem',
                margin: '0 0 1rem 0'
              }}>
                📭
              </p>
              <p style={{
                color: theme.colors.textSecondary,
                fontSize: '1.1rem',
                margin: 0
              }}>
                Aucun transporteur disponible pour le moment
              </p>
            </div>
          )}
        </div>
      )}

      {/* Order Summary */}
      <div style={{
        backgroundColor: theme.colors.cardBg,
        border: `2px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          color: theme.colors.primary,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💰 Récapitulatif
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {totalCommande !== null ? (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: theme.colors.background,
                borderRadius: '6px'
              }}>
                <span style={{ color: theme.colors.text, fontSize: '1.1rem' }}>
                  🛒 Total Commande
                </span>
                <span style={{
                  color: theme.colors.text,
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  {totalCommande.toFixed(2)} €
                </span>
              </div>

              {prixLivraisonTotal !== null && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: theme.colors.background,
                  borderRadius: '6px'
                }}>
                  <span style={{ color: theme.colors.text, fontSize: '1.1rem' }}>
                    🚚 Frais de Livraison
                  </span>
                  <span style={{
                    color: theme.colors.text,
                    fontSize: '1.2rem',
                    fontWeight: '700'
                  }}>
                    {prixLivraisonTotal.toFixed(2)} €
                  </span>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: theme.colors.primary + '20',
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: '8px',
                marginTop: '0.5rem'
              }}>
                <span style={{
                  color: theme.colors.text,
                  fontSize: '1.3rem',
                  fontWeight: 'bold'
                }}>
                  💳 Total Global
                </span>
                <span style={{
                  color: theme.colors.primary,
                  fontSize: '1.8rem',
                  fontWeight: 'bold'
                }}>
                  {(Number(totalCommande) + (prixLivraisonTotal !== null ? prixLivraisonTotal : 0)).toFixed(2)} €
                </span>
              </div>
            </>
          ) : (
            <p style={{
              color: theme.colors.textSecondary,
              textAlign: 'center',
              padding: '2rem'
            }}>
              Aucune commande disponible
            </p>
          )}
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={!selectedLivreurId && selectedLivraisonType === "domicile"}
          style={{
            backgroundColor: (!selectedLivreurId && selectedLivraisonType === "domicile")
              ? theme.colors.textSecondary
              : theme.colors.success,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: (!selectedLivreurId && selectedLivraisonType === "domicile")
              ? 'not-allowed'
              : 'pointer',
            width: '100%',
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s ease',
            boxShadow: (!selectedLivreurId && selectedLivraisonType === "domicile")
              ? 'none'
              : '0 4px 12px rgba(0,0,0,0.15)',
            opacity: (!selectedLivreurId && selectedLivraisonType === "domicile") ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (selectedLivreurId || selectedLivraisonType !== "domicile") {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = (!selectedLivreurId && selectedLivraisonType === "domicile")
              ? 'none'
              : '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <FaCreditCard style={{ fontSize: '1.3rem' }} />
          Procéder au Paiement
        </button>

        {(!selectedLivreurId && selectedLivraisonType === "domicile") && (
          <p style={{
            color: theme.colors.error,
            fontSize: '0.9rem',
            textAlign: 'center',
            marginTop: '0.75rem',
            fontWeight: '600'
          }}>
            ⚠️ Veuillez sélectionner un transporteur pour continuer
          </p>
        )}
      </div>
    </div>
  );
};

export default Livraison;