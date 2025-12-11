"use client";

import React, { useState} from 'react';
import AdresseLivraison from './AdresseLivraison';
import AdresseFacturation from './AdresseFacturation';
import Password from './Password';
import Information from './Information';
import { useTheme } from '@/app/contexts/ThemeContext';
import { FaUser, FaLock, FaCreditCard, FaTruck, FaChevronDown, FaChevronUp, FaPalette } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';






const Parametre = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      id: 'informations',
      title: 'Informations du Compte',
      icon: FaUser,
      component: <Information />,
      description: 'Gérez vos informations personnelles'
    },
    {
      id: 'password',
      title: 'Modifier le Mot de Passe',
      icon: FaLock,
      component: <Password />,
      description: 'Changez votre mot de passe'
    },
    {
      id: 'theme',
      title: 'Thème de l\'Interface',
      icon: FaPalette,
      component: (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <p style={{
            color: theme.colors.textSecondary,
            marginBottom: '1rem'
          }}>
            Personnalisez l'apparence de l'application selon vos préférences
          </p>
          <ThemeSelector />
        </div>
      ),
      description: 'Personnalisez l\'apparence de l\'application'
    },
    {
      id: 'adresseFacturation',
      title: 'Adresse de Facturation',
      icon: FaCreditCard,
      component: <AdresseFacturation />,
      description: 'Gérez vos adresses de facturation'
    },
    {
      id: 'adresseLivraison',
      title: 'Adresse de Livraison',
      icon: FaTruck,
      component: <AdresseLivraison />,
      description: 'Gérez vos adresses de livraison'
    }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: theme.colors.background
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: theme.colors.primary,
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          fontFamily: theme.fonts.heading,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          ⚙️ Paramètres du Compte
        </h1>
        <p style={{
          color: theme.colors.textSecondary,
          fontSize: '1rem'
        }}>
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      {/* Sections */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <div
              key={section.id}
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `2px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Section Header */}
              <div
                onClick={() => toggleSection(section.id)}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: isActive ? theme.colors.primary + '10' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = theme.colors.background;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flex: 1
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? theme.colors.primary : theme.colors.background,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}>
                    <Icon style={{
                      fontSize: '1.5rem',
                      color: isActive ? 'white' : theme.colors.primary
                    }} />
                  </div>
                  <div>
                    <h3 style={{
                      color: theme.colors.text,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      margin: 0,
                      marginBottom: '0.25rem'
                    }}>
                      {section.title}
                    </h3>
                    <p style={{
                      color: theme.colors.textSecondary,
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      {section.description}
                    </p>
                  </div>
                </div>
                <div style={{
                  color: theme.colors.text,
                  fontSize: '1.5rem',
                  transition: 'transform 0.3s ease',
                  transform: isActive ? 'rotate(0deg)' : 'rotate(0deg)'
                }}>
                  {isActive ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {/* Section Content */}
              {isActive && (
                <div style={{
                  padding: '1.5rem',
                  borderTop: `2px solid ${theme.colors.border}`,
                  backgroundColor: theme.colors.background,
                  animation: 'slideDown 0.3s ease'
                }}>
                  {section.component}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Parametre;