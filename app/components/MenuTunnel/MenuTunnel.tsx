"use client";

import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/contexts/ThemeContext';

const steps = [
  { name: 'Panier', path: '/panier', icon: '🛒' },
  { name: 'Information', path: '/checkout/information', icon: '📋' },
  { name: 'Livraison', path: '/checkout/livraison', icon: '🚚' },
  { name: 'Paiement', path: '/checkout/paiement', icon: '💳' },
];

interface MenuTunnelProps {
  currentStep: number;
}

const MenuTunnel: React.FC<MenuTunnelProps> = ({ currentStep }) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  const isCompleted = (index: number) => {
    return index + 1 < currentStep;
  };

  const isCurrentStep = (index: number) => {
    return index + 1 === currentStep;
  };

  return (
    <div className="w-full py-6 px-4 mb-8 rounded-xl" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
      {/* Desktop & Mobile View - Horizontal on all screens */}
      <div className="flex items-center justify-center overflow-x-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            {/* Étape */}
            <div className="flex flex-col items-center px-2">
              {/* Cercle */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 shadow-md"
                style={{
                  backgroundColor: isCompleted(index) ? theme.colors.success : isCurrentStep(index) ? theme.colors.primary : theme.colors.background,
                  color: isCompleted(index) || isCurrentStep(index) ? 'white' : theme.colors.textSecondary,
                  border: `3px solid ${isCompleted(index) ? theme.colors.success : isCurrentStep(index) ? theme.colors.primary : theme.colors.border}`,
                  transform: isCurrentStep(index) ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {isCompleted(index) ? '✓' : step.icon}
              </div>
              {/* Nom de l'étape */}
              <span
                className="mt-2 text-xs md:text-sm font-semibold whitespace-nowrap"
                style={{
                  color: isCompleted(index) || isCurrentStep(index) ? theme.colors.text : theme.colors.textSecondary,
                }}
              >
                {step.name}
              </span>
            </div>

            {/* Ligne de connexion */}
            {index < steps.length - 1 && (
              <div
                className="w-8 md:w-16 h-1 mx-2 md:mx-4 rounded transition-all duration-300 flex-shrink-0"
                style={{
                  backgroundColor: isCompleted(index) ? theme.colors.success : theme.colors.border,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuTunnel;