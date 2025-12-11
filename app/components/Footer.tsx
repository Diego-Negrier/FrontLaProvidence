"use client";

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              La Providence
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
              Votre boutique en ligne de confiance pour des produits de qualité.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/produits"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  Produits
                </Link>
              </li>
              <li>
                <Link
                  href="/commande"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  Mes Commandes
                </Link>
              </li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h4 className="font-semibold mb-4">Compte</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  href="/inscription"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  Inscription
                </Link>
              </li>
              <li>
                <Link
                  href="/parametre"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  Mon Profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Email: contact@laprovidence.fr
              </li>
              <li className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Tél: +33 1 23 45 67 89
              </li>
              <li className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Adresse: Paris, France
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-8 pt-8 text-center text-sm border-t"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-textSecondary)',
          }}
        >
          <p>&copy; {currentYear} La Providence. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
