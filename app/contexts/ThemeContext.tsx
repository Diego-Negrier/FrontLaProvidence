"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName =
  | 'france-tricolore' | 'france-royal' | 'france-republique'
  | 'royaute-pourpre' | 'royaute-or' | 'royaute-hermine' | 'royaute-fleurdelys'
  | 'catholique-vatican' | 'catholique-cardinal' | 'catholique-liturgique' | 'catholique-monastere' | 'catholique-sacre'
  | 'mer-ocean' | 'mer-mediterranee' | 'mer-tempete' | 'mer-cote'
  | 'montagne-alpes' | 'montagne-pyrenees' | 'montagne-massif' | 'montagne-sommet'
  | 'nature-foret' | 'nature-prairie' | 'nature-automne' | 'nature-printemps'
  | 'champs-ble' | 'champs-lavande' | 'champs-tournesol' | 'champs-vigne';

export type ThemeCategory = 'france' | 'royaute' | 'catholique' | 'mer' | 'montagne' | 'nature' | 'champs';

export interface Theme {
  name: ThemeName;
  category: ThemeCategory;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    cardBg: string;
    hover: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
  themesByCategory: Record<ThemeCategory, ThemeName[]>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes: Record<ThemeName, Theme> = {
  // 🇫🇷 FRANCE
  'france-tricolore': {
    name: 'france-tricolore',
    category: 'france',
    displayName: 'France Tricolore',
    colors: {
      primary: '#0055A4',      // Bleu France
      secondary: '#EF4135',    // Rouge France
      accent: '#FFFFFF',       // Blanc
      background: '#F8F9FA',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#666666',
      border: '#E0E0E0',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
      cardBg: '#FFFFFF',
      hover: '#E8F0FE',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 85, 164, 0.05)',
      md: '0 4px 6px -1px rgba(0, 85, 164, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 85, 164, 0.15)',
    },
  },
  'france-royal': {
    name: 'france-royal',
    category: 'france',
    displayName: 'France Royal',
    colors: {
      primary: '#002654',      // Bleu royal foncé
      secondary: '#C8102E',    // Rouge royal
      accent: '#F1BF00',       // Or français
      background: '#F5F5F0',
      surface: '#FAFAF8',
      text: '#1C1C1C',
      textSecondary: '#5C5C5C',
      border: '#D4D4CE',
      success: '#2D7A3E',
      warning: '#D4A017',
      error: '#B71C1C',
      cardBg: '#FEFEFE',
      hover: '#E8E8E4',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Source Sans Pro, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 38, 84, 0.08)',
      md: '0 4px 6px -1px rgba(0, 38, 84, 0.12)',
      lg: '0 10px 15px -3px rgba(0, 38, 84, 0.18)',
    },
  },
  'france-republique': {
    name: 'france-republique',
    category: 'france',
    displayName: 'France République',
    colors: {
      primary: '#003D8F',      // Bleu républicain
      secondary: '#CE1126',    // Rouge républicain
      accent: '#FFFFFF',       // Blanc républicain
      background: '#F0F2F5',
      surface: '#FFFFFF',
      text: '#212121',
      textSecondary: '#757575',
      border: '#DADCE0',
      success: '#1B5E20',
      warning: '#F57C00',
      error: '#C62828',
      cardBg: '#FAFBFC',
      hover: '#E3E7EB',
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Roboto, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 61, 143, 0.06)',
      md: '0 4px 6px -1px rgba(0, 61, 143, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 61, 143, 0.15)',
    },
  },

  // 👑 ROYAUTÉ
  'royaute-pourpre': {
    name: 'royaute-pourpre',
    category: 'royaute',
    displayName: 'Royauté Pourpre',
    colors: {
      primary: '#4B0082',      // Pourpre royal
      secondary: '#FFD700',    // Or
      accent: '#8B7355',       // Bronze
      background: '#FDF8F5',
      surface: '#FFFBF7',
      text: '#2C1810',
      textSecondary: '#6D5C4D',
      border: '#E8DCD0',
      success: '#2E7D32',
      warning: '#F57F17',
      error: '#C62828',
      cardBg: '#FFFEF9',
      hover: '#F5EDE4',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Lora, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(75, 0, 130, 0.12)',
      md: '0 4px 6px -1px rgba(75, 0, 130, 0.18)',
      lg: '0 10px 15px -3px rgba(75, 0, 130, 0.25)',
    },
  },
  'royaute-or': {
    name: 'royaute-or',
    category: 'royaute',
    displayName: 'Royauté Or',
    colors: {
      primary: '#B8860B',      // Or sombre
      secondary: '#8B4513',    // Marron royal
      accent: '#DAA520',       // Or clair
      background: '#FFFAF0',
      surface: '#FFFEF9',
      text: '#3E2723',
      textSecondary: '#6D4C41',
      border: '#D7CCC8',
      success: '#388E3C',
      warning: '#F9A825',
      error: '#D32F2F',
      cardBg: '#FFFDF7',
      hover: '#FFF8E1',
    },
    fonts: {
      heading: 'Cinzel, serif',
      body: 'Crimson Text, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(184, 134, 11, 0.15)',
      md: '0 4px 6px -1px rgba(184, 134, 11, 0.22)',
      lg: '0 10px 15px -3px rgba(184, 134, 11, 0.3)',
    },
  },
  'royaute-hermine': {
    name: 'royaute-hermine',
    category: 'royaute',
    displayName: 'Royauté Hermine',
    colors: {
      primary: '#1A237E',      // Bleu royal profond
      secondary: '#FFFAFA',    // Blanc hermine
      accent: '#C0C0C0',       // Argent
      background: '#F7F7F9',
      surface: '#FDFDFE',
      text: '#212121',
      textSecondary: '#616161',
      border: '#E0E0E0',
      success: '#43A047',
      warning: '#FFA000',
      error: '#E53935',
      cardBg: '#FEFEFE',
      hover: '#ECECF1',
    },
    fonts: {
      heading: 'Cormorant Garamond, serif',
      body: 'Spectral, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(26, 35, 126, 0.1)',
      md: '0 4px 6px -1px rgba(26, 35, 126, 0.15)',
      lg: '0 10px 15px -3px rgba(26, 35, 126, 0.2)',
    },
  },
  'royaute-fleurdelys': {
    name: 'royaute-fleurdelys',
    category: 'royaute',
    displayName: 'Royauté Fleur de Lys',
    colors: {
      primary: '#000080',      // Bleu marine royal
      secondary: '#F0E68C',    // Khaki doré
      accent: '#FFFFF0',       // Ivoire
      background: '#F9F9FA',
      surface: '#FFFFFC',
      text: '#1C1C1C',
      textSecondary: '#5C5C5C',
      border: '#D4D4CE',
      success: '#4CAF50',
      warning: '#FFB300',
      error: '#EF5350',
      cardBg: '#FFFFFE',
      hover: '#F0F0E8',
    },
    fonts: {
      heading: 'EB Garamond, serif',
      body: 'Libre Baskerville, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 128, 0.08)',
      md: '0 4px 6px -1px rgba(0, 0, 128, 0.12)',
      lg: '0 10px 15px -3px rgba(0, 0, 128, 0.18)',
    },
  },

  // ⛪ CATHOLICISME
  'catholique-vatican': {
    name: 'catholique-vatican',
    category: 'catholique',
    displayName: 'Vatican',
    colors: {
      primary: '#FFD700',      // Or papal
      secondary: '#FFFAFA',    // Blanc papal
      accent: '#C0C0C0',       // Argent
      background: '#FAF9F7',
      surface: '#FFFFFE',
      text: '#2C2C2C',
      textSecondary: '#6C6C6C',
      border: '#E8E6E3',
      success: '#558B2F',
      warning: '#F9A825',
      error: '#C62828',
      cardBg: '#FFFFFD',
      hover: '#F5F4F1',
    },
    fonts: {
      heading: 'Cinzel, serif',
      body: 'Lora, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(255, 215, 0, 0.15)',
      md: '0 4px 6px -1px rgba(255, 215, 0, 0.22)',
      lg: '0 10px 15px -3px rgba(255, 215, 0, 0.3)',
    },
  },
  'catholique-cardinal': {
    name: 'catholique-cardinal',
    category: 'catholique',
    displayName: 'Cardinal',
    colors: {
      primary: '#8B0000',      // Rouge cardinal
      secondary: '#DAA520',    // Or liturgique
      accent: '#FFFAFA',       // Blanc sacré
      background: '#FDF8F5',
      surface: '#FFFEFB',
      text: '#2C1810',
      textSecondary: '#5C4033',
      border: '#E8DCD0',
      success: '#388E3C',
      warning: '#F57F17',
      error: '#B71C1C',
      cardBg: '#FFFDF9',
      hover: '#F5EDE4',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Crimson Text, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(139, 0, 0, 0.12)',
      md: '0 4px 6px -1px rgba(139, 0, 0, 0.18)',
      lg: '0 10px 15px -3px rgba(139, 0, 0, 0.25)',
    },
  },
  'catholique-liturgique': {
    name: 'catholique-liturgique',
    category: 'catholique',
    displayName: 'Liturgique',
    colors: {
      primary: '#4B0082',      // Violet liturgique
      secondary: '#228B22',    // Vert liturgique
      accent: '#FFFAFA',       // Blanc
      background: '#F9F7FA',
      surface: '#FFFEFE',
      text: '#2C2C2C',
      textSecondary: '#6C6C6C',
      border: '#E0DCE3',
      success: '#2E7D32',
      warning: '#F57F17',
      error: '#C62828',
      cardBg: '#FFFEFD',
      hover: '#F0EDF2',
    },
    fonts: {
      heading: 'Cormorant Garamond, serif',
      body: 'Spectral, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(75, 0, 130, 0.1)',
      md: '0 4px 6px -1px rgba(75, 0, 130, 0.15)',
      lg: '0 10px 15px -3px rgba(75, 0, 130, 0.2)',
    },
  },
  'catholique-monastere': {
    name: 'catholique-monastere',
    category: 'catholique',
    displayName: 'Monastère',
    colors: {
      primary: '#654321',      // Brun monastique
      secondary: '#F5F5DC',    // Beige parchemin
      accent: '#8B7355',       // Terre
      background: '#FAF9F6',
      surface: '#FFFEFB',
      text: '#3E2723',
      textSecondary: '#6D4C41',
      border: '#D7CCC8',
      success: '#558B2F',
      warning: '#F9A825',
      error: '#D32F2F',
      cardBg: '#FFFDF9',
      hover: '#F5F1ED',
    },
    fonts: {
      heading: 'EB Garamond, serif',
      body: 'Merriweather, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(101, 67, 33, 0.1)',
      md: '0 4px 6px -1px rgba(101, 67, 33, 0.15)',
      lg: '0 10px 15px -3px rgba(101, 67, 33, 0.2)',
    },
  },
  'catholique-sacre': {
    name: 'catholique-sacre',
    category: 'catholique',
    displayName: 'Sacré Cœur',
    colors: {
      primary: '#DC143C',      // Rouge sacré
      secondary: '#FFD700',    // Or céleste
      accent: '#F0F8FF',       // Bleu ciel
      background: '#FFF9F9',
      surface: '#FFFEFE',
      text: '#2C1C1C',
      textSecondary: '#6C5C5C',
      border: '#F0E0E0',
      success: '#43A047',
      warning: '#FFA000',
      error: '#C62828',
      cardBg: '#FFFFFE',
      hover: '#FFF0F0',
    },
    fonts: {
      heading: 'Libre Baskerville, serif',
      body: 'Lora, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(220, 20, 60, 0.12)',
      md: '0 4px 6px -1px rgba(220, 20, 60, 0.18)',
      lg: '0 10px 15px -3px rgba(220, 20, 60, 0.25)',
    },
  },

  // 🌊 MER
  'mer-ocean': {
    name: 'mer-ocean',
    category: 'mer',
    displayName: 'Océan',
    colors: {
      primary: '#003F5C',      // Bleu océan profond
      secondary: '#2C7FB8',    // Bleu océan
      accent: '#A3D9F5',       // Bleu ciel
      background: '#F5FAFE',
      surface: '#FFFFFF',
      text: '#1C2833',
      textSecondary: '#5D6D7E',
      border: '#D6EAF8',
      success: '#17A589',
      warning: '#F39C12',
      error: '#CB4335',
      cardBg: '#FCFEFF',
      hover: '#EBF5FB',
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Open Sans, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 63, 92, 0.1)',
      md: '0 4px 6px -1px rgba(0, 63, 92, 0.15)',
      lg: '0 10px 15px -3px rgba(0, 63, 92, 0.2)',
    },
  },
  'mer-mediterranee': {
    name: 'mer-mediterranee',
    category: 'mer',
    displayName: 'Méditerranée',
    colors: {
      primary: '#006994',      // Bleu méditerranée
      secondary: '#40A6CE',    // Turquoise
      accent: '#F4D03F',       // Sable doré
      background: '#F7FCFE',
      surface: '#FFFFFE',
      text: '#1C3334',
      textSecondary: '#5D7D7E',
      border: '#D1ECF1',
      success: '#1ABC9C',
      warning: '#F1C40F',
      error: '#E74C3C',
      cardBg: '#FEFFFF',
      hover: '#E8F8FB',
    },
    fonts: {
      heading: 'Raleway, sans-serif',
      body: 'Lato, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 105, 148, 0.1)',
      md: '0 4px 6px -1px rgba(0, 105, 148, 0.15)',
      lg: '0 10px 15px -3px rgba(0, 105, 148, 0.2)',
    },
  },
  'mer-tempete': {
    name: 'mer-tempete',
    category: 'mer',
    displayName: 'Tempête',
    colors: {
      primary: '#1C4E5B',      // Bleu-gris tempête
      secondary: '#516C77',    // Gris orage
      accent: '#E8F1F2',       // Blanc écume
      background: '#F2F5F6',
      surface: '#FAFBFC',
      text: '#212F3C',
      textSecondary: '#566573',
      border: '#D5DBDB',
      success: '#138D75',
      warning: '#D68910',
      error: '#B03A2E',
      cardBg: '#FCFDFD',
      hover: '#E5EAEB',
    },
    fonts: {
      heading: 'Roboto Slab, serif',
      body: 'Roboto, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(28, 78, 91, 0.12)',
      md: '0 4px 6px -1px rgba(28, 78, 91, 0.18)',
      lg: '0 10px 15px -3px rgba(28, 78, 91, 0.25)',
    },
  },
  'mer-cote': {
    name: 'mer-cote',
    category: 'mer',
    displayName: 'Côte',
    colors: {
      primary: '#0E6BA8',      // Bleu côtier
      secondary: '#FAA916',    // Orange sable
      accent: '#FFFFFF',       // Blanc
      background: '#F8FCFD',
      surface: '#FFFFFF',
      text: '#1C2A33',
      textSecondary: '#5D6D76',
      border: '#D9E8ED',
      success: '#16A085',
      warning: '#E67E22',
      error: '#C0392B',
      cardBg: '#FEFEFF',
      hover: '#ECF6F9',
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(14, 107, 168, 0.1)',
      md: '0 4px 6px -1px rgba(14, 107, 168, 0.15)',
      lg: '0 10px 15px -3px rgba(14, 107, 168, 0.2)',
    },
  },

  // ⛰️ MONTAGNE
  'montagne-alpes': {
    name: 'montagne-alpes',
    category: 'montagne',
    displayName: 'Alpes',
    colors: {
      primary: '#4A5F6A',      // Gris roche
      secondary: '#FFFFFF',    // Blanc neige
      accent: '#87CEEB',       // Bleu ciel
      background: '#F7F9FA',
      surface: '#FFFFFF',
      text: '#2C3E50',
      textSecondary: '#7F8C8D',
      border: '#DADFE1',
      success: '#27AE60',
      warning: '#F39C12',
      error: '#C0392B',
      cardBg: '#FEFFFF',
      hover: '#ECF0F1',
    },
    fonts: {
      heading: 'Roboto, sans-serif',
      body: 'Open Sans, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(74, 95, 106, 0.1)',
      md: '0 4px 6px -1px rgba(74, 95, 106, 0.15)',
      lg: '0 10px 15px -3px rgba(74, 95, 106, 0.2)',
    },
  },
  'montagne-pyrenees': {
    name: 'montagne-pyrenees',
    category: 'montagne',
    displayName: 'Pyrénées',
    colors: {
      primary: '#5D6D7E',      // Gris ardoise
      secondary: '#A3B9CC',    // Bleu-gris
      accent: '#E8F5E9',       // Vert prairie
      background: '#F5F7F8',
      surface: '#FAFBFC',
      text: '#283747',
      textSecondary: '#5D6D7E',
      border: '#D5DBDB',
      success: '#229954',
      warning: '#D68910',
      error: '#B03A2E',
      cardBg: '#FDFDFE',
      hover: '#E8EAEC',
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Source Sans Pro, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(93, 109, 126, 0.1)',
      md: '0 4px 6px -1px rgba(93, 109, 126, 0.15)',
      lg: '0 10px 15px -3px rgba(93, 109, 126, 0.2)',
    },
  },
  'montagne-massif': {
    name: 'montagne-massif',
    category: 'montagne',
    displayName: 'Massif',
    colors: {
      primary: '#424949',      // Gris granite
      secondary: '#7D8A8E',    // Gris pierre
      accent: '#D5DBDB',       // Gris clair
      background: '#F4F6F7',
      surface: '#FAFAFA',
      text: '#1C2833',
      textSecondary: '#566573',
      border: '#CCD1D1',
      success: '#1E8449',
      warning: '#CA6F1E',
      error: '#943126',
      cardBg: '#FCFCFD',
      hover: '#E5E8E8',
    },
    fonts: {
      heading: 'Roboto Condensed, sans-serif',
      body: 'Roboto, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(66, 73, 73, 0.12)',
      md: '0 4px 6px -1px rgba(66, 73, 73, 0.18)',
      lg: '0 10px 15px -3px rgba(66, 73, 73, 0.25)',
    },
  },
  'montagne-sommet': {
    name: 'montagne-sommet',
    category: 'montagne',
    displayName: 'Sommet',
    colors: {
      primary: '#34495E',      // Bleu ardoise
      secondary: '#E8F4F8',    // Blanc glacé
      accent: '#5DADE2',       // Bleu glacier
      background: '#F6F9FA',
      surface: '#FEFEFF',
      text: '#212F3D',
      textSecondary: '#566573',
      border: '#D6DBDF',
      success: '#138D75',
      warning: '#D68910',
      error: '#A93226',
      cardBg: '#FEFFFE',
      hover: '#EAF2F4',
    },
    fonts: {
      heading: 'Raleway, sans-serif',
      body: 'Lato, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(52, 73, 94, 0.1)',
      md: '0 4px 6px -1px rgba(52, 73, 94, 0.15)',
      lg: '0 10px 15px -3px rgba(52, 73, 94, 0.2)',
    },
  },

  // 🌿 NATURE
  'nature-foret': {
    name: 'nature-foret',
    category: 'nature',
    displayName: 'Forêt',
    colors: {
      primary: '#1E4620',      // Vert forêt foncé
      secondary: '#3D7A40',    // Vert feuillage
      accent: '#8D6E63',       // Brun écorce
      background: '#F1F8F4',
      surface: '#FAFFFE',
      text: '#1C3A1C',
      textSecondary: '#4A7C4A',
      border: '#C8E6C9',
      success: '#2E7D32',
      warning: '#F57F17',
      error: '#C62828',
      cardBg: '#F8FFF9',
      hover: '#E8F5E9',
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Open Sans, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(30, 70, 32, 0.1)',
      md: '0 4px 6px -1px rgba(30, 70, 32, 0.15)',
      lg: '0 10px 15px -3px rgba(30, 70, 32, 0.2)',
    },
  },
  'nature-prairie': {
    name: 'nature-prairie',
    category: 'nature',
    displayName: 'Prairie',
    colors: {
      primary: '#558B2F',      // Vert herbe
      secondary: '#9CCC65',    // Vert prairie
      accent: '#FFF59D',       // Jaune soleil
      background: '#F9FDF7',
      surface: '#FFFFFE',
      text: '#2C3E2C',
      textSecondary: '#5C7E5C',
      border: '#DCEDC8',
      success: '#388E3C',
      warning: '#F9A825',
      error: '#D32F2F',
      cardBg: '#FCFFF9',
      hover: '#F1F8E9',
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Lato, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(85, 139, 47, 0.1)',
      md: '0 4px 6px -1px rgba(85, 139, 47, 0.15)',
      lg: '0 10px 15px -3px rgba(85, 139, 47, 0.2)',
    },
  },
  'nature-automne': {
    name: 'nature-automne',
    category: 'nature',
    displayName: 'Automne',
    colors: {
      primary: '#BF360C',      // Rouge-orange automne
      secondary: '#F57C00',    // Orange feuille
      accent: '#FFCC80',       // Beige automnal
      background: '#FFF8F0',
      surface: '#FFFEFB',
      text: '#3E2723',
      textSecondary: '#6D4C41',
      border: '#FFE0B2',
      success: '#689F38',
      warning: '#F57F17',
      error: '#C62828',
      cardBg: '#FFFDF7',
      hover: '#FFF3E0',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Lora, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(191, 54, 12, 0.1)',
      md: '0 4px 6px -1px rgba(191, 54, 12, 0.15)',
      lg: '0 10px 15px -3px rgba(191, 54, 12, 0.2)',
    },
  },
  'nature-printemps': {
    name: 'nature-printemps',
    category: 'nature',
    displayName: 'Printemps',
    colors: {
      primary: '#7CB342',      // Vert bourgeon
      secondary: '#FFB6C1',    // Rose fleur
      accent: '#FFF9C4',       // Jaune pollen
      background: '#F9FEF8',
      surface: '#FFFFFE',
      text: '#2C3E2C',
      textSecondary: '#5C7E5C',
      border: '#E8F5E9',
      success: '#43A047',
      warning: '#FFA000',
      error: '#E53935',
      cardBg: '#FDFFF9',
      hover: '#F1F8E9',
    },
    fonts: {
      heading: 'Raleway, sans-serif',
      body: 'Open Sans, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(124, 179, 66, 0.1)',
      md: '0 4px 6px -1px rgba(124, 179, 66, 0.15)',
      lg: '0 10px 15px -3px rgba(124, 179, 66, 0.2)',
    },
  },

  // 🌾 CHAMPS
  'champs-ble': {
    name: 'champs-ble',
    category: 'champs',
    displayName: 'Champs de Blé',
    colors: {
      primary: '#F4A460',      // Ocre blé
      secondary: '#DAA520',    // Or moisson
      accent: '#8B7355',       // Brun terre
      background: '#FFFEF8',
      surface: '#FFFFFC',
      text: '#3E2F1F',
      textSecondary: '#6D5F4F',
      border: '#E8DCC8',
      success: '#689F38',
      warning: '#F57F17',
      error: '#D32F2F',
      cardBg: '#FFFEF9',
      hover: '#FFF8E1',
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Source Sans Pro, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(244, 164, 96, 0.1)',
      md: '0 4px 6px -1px rgba(244, 164, 96, 0.15)',
      lg: '0 10px 15px -3px rgba(244, 164, 96, 0.2)',
    },
  },
  'champs-lavande': {
    name: 'champs-lavande',
    category: 'champs',
    displayName: 'Champs de Lavande',
    colors: {
      primary: '#7B68EE',      // Violet lavande
      secondary: '#9370DB',    // Mauve
      accent: '#E6E6FA',       // Lavande clair
      background: '#FCFBFF',
      surface: '#FFFFFE',
      text: '#2C2C3E',
      textSecondary: '#5C5C6E',
      border: '#E0DCF0',
      success: '#558B2F',
      warning: '#F9A825',
      error: '#C62828',
      cardBg: '#FEFEFF',
      hover: '#F3F0FF',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Lato, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(123, 104, 238, 0.12)',
      md: '0 4px 6px -1px rgba(123, 104, 238, 0.18)',
      lg: '0 10px 15px -3px rgba(123, 104, 238, 0.25)',
    },
  },
  'champs-tournesol': {
    name: 'champs-tournesol',
    category: 'champs',
    displayName: 'Champs de Tournesol',
    colors: {
      primary: '#FFD700',      // Jaune tournesol
      secondary: '#FFA500',    // Orange soleil
      accent: '#8B4513',       // Brun terre
      background: '#FFFEF5',
      surface: '#FFFFFA',
      text: '#3E3E1F',
      textSecondary: '#6D6D4F',
      border: '#F0E8C8',
      success: '#689F38',
      warning: '#F57F17',
      error: '#D32F2F',
      cardBg: '#FFFEF7',
      hover: '#FFF9E6',
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Open Sans, sans-serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(255, 215, 0, 0.15)',
      md: '0 4px 6px -1px rgba(255, 215, 0, 0.22)',
      lg: '0 10px 15px -3px rgba(255, 215, 0, 0.3)',
    },
  },
  'champs-vigne': {
    name: 'champs-vigne',
    category: 'champs',
    displayName: 'Vignoble',
    colors: {
      primary: '#722F37',      // Bordeaux
      secondary: '#556B2F',    // Vert vigne
      accent: '#F0E68C',       // Khaki raisin
      background: '#FDF9F7',
      surface: '#FFFEFB',
      text: '#2F1F1C',
      textSecondary: '#5F4F4A',
      border: '#E8D8D0',
      success: '#558B2F',
      warning: '#F57F17',
      error: '#C62828',
      cardBg: '#FFFEF9',
      hover: '#F5EDE4',
    },
    fonts: {
      heading: 'Cormorant Garamond, serif',
      body: 'Crimson Text, serif',
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgba(114, 47, 55, 0.1)',
      md: '0 4px 6px -1px rgba(114, 47, 55, 0.15)',
      lg: '0 10px 15px -3px rgba(114, 47, 55, 0.2)',
    },
  },
};

export const themesByCategory: Record<ThemeCategory, ThemeName[]> = {
  france: ['france-tricolore', 'france-royal', 'france-republique'],
  royaute: ['royaute-pourpre', 'royaute-or', 'royaute-hermine', 'royaute-fleurdelys'],
  catholique: ['catholique-vatican', 'catholique-cardinal', 'catholique-liturgique', 'catholique-monastere', 'catholique-sacre'],
  mer: ['mer-ocean', 'mer-mediterranee', 'mer-tempete', 'mer-cote'],
  montagne: ['montagne-alpes', 'montagne-pyrenees', 'montagne-massif', 'montagne-sommet'],
  nature: ['nature-foret', 'nature-prairie', 'nature-automne', 'nature-printemps'],
  champs: ['champs-ble', 'champs-lavande', 'champs-tournesol', 'champs-vigne'],
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('france-tricolore');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as ThemeName | null;
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const theme = themes[themeName];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        setTheme,
        availableThemes: Object.keys(themes) as ThemeName[],
        themesByCategory,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
