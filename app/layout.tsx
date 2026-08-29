import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chess Chess Revolution',
  description: 'A neon arcade main menu concept.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ minHeight: '100%', background: '#02050d' }}>
      <body
        style={{
          minHeight: '100%',
          margin: 0,
          background: '#02050d',
          color: '#f5fbff',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
