/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ MODE STANDALONE (OBLIGATOIRE pour Docker)
  output: 'standalone',

  // Désactiver la télémétrie

  // ✅ Optimisation CSS pour production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuration des images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dataworlds.direct.quickconnect.to',
        pathname: '/public/LaProvidence/media/**',
      },
      {
        protocol: 'http',
        hostname: 'dataworlds.direct.quickconnect.to',
        port: '8007',
        pathname: '/public/LaProvidence/media/**',
      },
    ],
  },

  // ⚠️ Ignorer les erreurs de build (à retirer en prod)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
