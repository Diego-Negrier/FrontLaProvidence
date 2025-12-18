'use client';

import { useEffect } from 'react';
import type { Fournisseur } from '../../services/types';

interface FournisseursModalProps {
  isOpen: boolean;
  suppliers: Fournisseur[];
  onClose: () => void;
}

export default function FournisseursModal({ isOpen, suppliers, onClose }: FournisseursModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '2px solid #e5e7eb',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#fff' }}>
              🏪 Nos Fournisseurs
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>
            {suppliers.length} fournisseur{suppliers.length > 1 ? 's' : ''} disponible{suppliers.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {suppliers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <p style={{ fontSize: '18px', margin: 0 }}>Aucun fournisseur disponible pour le moment.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {suppliers.map((supplier, index) => {
                const nom = (supplier as any).nom_fournisseur || (supplier as any).nom || 'Fournisseur';
                const email = (supplier as any).email_fournisseur || (supplier as any).email || '';
                const telephone = (supplier as any).telephone_fournisseur || (supplier as any).telephone || '';
                const adresse = (supplier as any).adresse_fournisseur || (supplier as any).adresse || '';
                const ville = (supplier as any).ville_fournisseur || (supplier as any).ville || '';
                const codePostal = (supplier as any).code_postal_fournisseur || (supplier as any).code_postal || '';

                return (
                  <div
                    key={index}
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      background: 'linear-gradient(135deg, #f3f4f6 0%, #fff 100%)',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      {/* Icon */}
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '28px',
                          flexShrink: 0,
                        }}
                      >
                        🏪
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                          {nom}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {/* Localisation */}
                          {(adresse || ville || codePostal) && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <span style={{ fontSize: '16px', flexShrink: 0 }}>📍</span>
                              <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                                {adresse && <div>{adresse}</div>}
                                {(ville || codePostal) && (
                                  <div>
                                    {codePostal} {ville}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Email */}
                          {email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '16px' }}>📧</span>
                              <a
                                href={`mailto:${email}`}
                                style={{
                                  fontSize: '14px',
                                  color: '#667eea',
                                  textDecoration: 'none',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.textDecoration = 'none';
                                }}
                              >
                                {email}
                              </a>
                            </div>
                          )}

                          {/* Téléphone */}
                          {telephone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '16px' }}>📞</span>
                              <a
                                href={`tel:${telephone}`}
                                style={{
                                  fontSize: '14px',
                                  color: '#667eea',
                                  textDecoration: 'none',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.textDecoration = 'none';
                                }}
                              >
                                {telephone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
