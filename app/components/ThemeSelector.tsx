"use client";

import { useTheme, type ThemeName, type ThemeCategory, themes } from '@/app/contexts/ThemeContext';
import { getContrastColor } from '@/app/utils/colorUtils';

export default function ThemeSelector() {
  const { themeName, setTheme, themesByCategory, theme } = useTheme();

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      {(Object.keys(themesByCategory) as ThemeCategory[]).map((category) => (
        <div key={category}>
          {/* Category Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: `2px solid ${theme.colors.border}`
          }}>
            <span style={{ fontSize: '1.5rem' }}>{categoryIcons[category]}</span>
            <h3 style={{
              color: theme.colors.primary,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              {categoryNames[category]}
            </h3>
          </div>

          {/* Theme Color Squares Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '1rem'
          }}>
            {themesByCategory[category].map((themeOption) => {
              const isSelected = themeName === themeOption;
              const themeData = themes[themeOption];
              const themeName_display = themeOption.split('-')[1].charAt(0).toUpperCase() + themeOption.split('-')[1].slice(1);

              return (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    padding: '0.75rem',
                    backgroundColor: isSelected ? theme.colors.primary + '10' : theme.colors.background,
                    border: `2px solid ${isSelected ? theme.colors.primary : theme.colors.border}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}30`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = theme.colors.background;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {/* Color Square with Gradient */}
                  <div style={{
                    width: '100%',
                    height: '80px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${themeData.colors.primary} 0%, ${themeData.colors.secondary} 50%, ${themeData.colors.accent} 100%)`,
                    boxShadow: `0 4px 12px ${themeData.colors.primary}40`,
                    transition: 'transform 0.3s ease',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem'
                  }}>
                    {/* Theme Name on Color */}
                    <span style={{
                      color: getContrastColor(themeData.colors.primary),
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      zIndex: 2
                    }}>
                      {themeName_display}
                    </span>

                    {/* Color Indicator Dots */}
                    <div style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '0.25rem',
                      zIndex: 1
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: themeData.colors.primary,
                        border: `1px solid ${getContrastColor(themeData.colors.primary)}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }} />
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: themeData.colors.secondary,
                        border: `1px solid ${getContrastColor(themeData.colors.secondary)}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }} />
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: themeData.colors.accent,
                        border: `1px solid ${getContrastColor(themeData.colors.accent)}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }} />
                    </div>
                  </div>

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.success,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
