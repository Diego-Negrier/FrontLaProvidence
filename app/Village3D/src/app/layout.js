import './globals.css';

export const metadata = {
  title: 'Village Collonges — Version Pro',
  description: 'Village français 3D créé avec Three.js et Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
