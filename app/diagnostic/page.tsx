"use client";

import { useTheme, type ThemeCategory } from '@/app/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function DiagnosticPage() {
  const { theme, themeName, setTheme, themesByCategory } = useTheme();
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const vars: Record<string, string> = {};

    ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'textSecondary', 'border', 'cardBg', 'hover'].forEach(key => {
      vars[`--color-${key}`] = computed.getPropertyValue(`--color-${key}`);
    });

    setCssVariables(vars);
  }, [themeName]);

  const categoryIcons: Record<ThemeCategory, string> = {
    france: '🇫🇷',
    royaute: '👑',
    catholique: '⛪',
    mer: '🌊',
    montagne: '⛰️',
    nature: '🌿',
    champs: '🌾',
  };

  const categoryNames: Record<ThemeCategory, string> = {
    france: 'France',
    royaute: 'Royauté',
    catholique: 'Catholicisme',
    mer: 'Mer',
    montagne: 'Montagne',
    nature: 'Nature',
    champs: 'Champs',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" style={{ color: theme.colors.primary }}>
        Page de Diagnostic CSS - 28 Thèmes
      </h1>

      {/* Test du thème actuel */}
      <div className="mb-8 p-6 rounded-lg" style={{
        backgroundColor: theme.colors.surface,
        border: `2px solid ${theme.colors.border}`
      }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>
          Thème actuel: {theme.displayName}
        </h2>
        <p className="mb-4" style={{ color: theme.colors.textSecondary }}>
          Catégorie: {categoryIcons[theme.category]} {categoryNames[theme.category]}
        </p>

        {/* Thèmes par catégorie */}
        {(Object.keys(themesByCategory) as ThemeCategory[]).map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-bold mb-3" style={{ color: theme.colors.text }}>
              {categoryIcons[category]} {categoryNames[category]}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {themesByCategory[category].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className="p-3 rounded font-medium text-sm transition-all"
                  style={{
                    backgroundColor: t === themeName ? theme.colors.primary : theme.colors.surface,
                    color: t === themeName ? 'white' : theme.colors.text,
                    border: `2px solid ${t === themeName ? theme.colors.primary : theme.colors.border}`,
                  }}
                >
                  {t.split('-')[1].charAt(0).toUpperCase() + t.split('-')[1].slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Variables CSS */}
      <div className="mb-8 p-6 rounded-lg" style={{
        backgroundColor: theme.colors.cardBg,
        border: `1px solid ${theme.colors.border}`
      }}>
        <h2 className="text-2xl font-bold mb-4">Variables CSS Détectées</h2>
        <div className="space-y-2">
          {Object.entries(cssVariables).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <code className="font-mono text-sm" style={{ color: theme.colors.textSecondary }}>
                {key}
              </code>
              <div
                className="w-12 h-12 rounded border-2"
                style={{
                  backgroundColor: value,
                  borderColor: theme.colors.border
                }}
              />
              <span style={{ color: theme.colors.text }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Palette de couleurs du thème */}
      <div className="mb-8 p-6 rounded-lg" style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`
      }}>
        <h2 className="text-2xl font-bold mb-4">Palette de couleurs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(theme.colors).map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className="w-full h-20 rounded mb-2"
                style={{ backgroundColor: value }}
              />
              <p className="text-sm font-mono" style={{ color: theme.colors.textSecondary }}>
                {key}
              </p>
              <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Test des composants */}
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Test des composants</h2>
        <div className="p-4 rounded" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
          Box avec couleur primaire
        </div>
        <div className="p-4 rounded" style={{ backgroundColor: theme.colors.secondary, color: 'white' }}>
          Box avec couleur secondaire
        </div>
        <div className="p-4 rounded" style={{
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.border}`,
          color: theme.colors.text
        }}>
          Box avec surface et bordure
        </div>
      </div>

      {/* Info système */}
      <div className="mt-8 p-4 rounded" style={{
        backgroundColor: theme.colors.cardBg,
        border: `1px solid ${theme.colors.border}`
      }}>
        <h3 className="font-bold mb-2">Informations système</h3>
        <pre className="text-xs overflow-auto" style={{ color: theme.colors.textSecondary }}>
          {JSON.stringify({
            themeName,
            category: theme.category,
            displayName: theme.displayName,
            fonts: theme.fonts,
            spacing: theme.spacing
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
