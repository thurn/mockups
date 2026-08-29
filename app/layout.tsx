import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Chess Chess Revolution",
    template: "%s | Chess Chess Revolution",
  },
  description: "A neon arcade chess experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ minHeight: "100%", background: "#02050d" }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (() => {
            const root = document.documentElement;
            const designWidth = 1024;
            const designHeight = 1536;

            const updatePortraitScale = () => {
              const viewportWidth = Math.max(0, root.clientWidth || window.innerWidth);
              const viewportHeight = Math.max(
                0,
                window.visualViewport ? window.visualViewport.height : window.innerHeight,
              );
              const scale = Math.min(1, viewportWidth / designWidth, viewportHeight / designHeight);

              root.style.setProperty('--portrait-width', designWidth * scale + 'px');
              root.style.setProperty('--portrait-height', designHeight * scale + 'px');
              root.style.setProperty('--portrait-scale', String(scale));
            };

            updatePortraitScale();
            window.addEventListener('resize', updatePortraitScale);
            window.addEventListener('pageshow', updatePortraitScale);
            window.visualViewport?.addEventListener('resize', updatePortraitScale);
          })();
        `,
          }}
        />
        <style>{`
          @font-face { font-family: 'Bebas Neue'; src: url('/fonts/bebas-neue.ttf') format('truetype'); font-display: swap; }
          @font-face { font-family: 'Barlow Condensed'; src: url('/fonts/barlow-condensed-700.ttf') format('truetype'); font-style: normal; font-weight: 700; font-display: swap; }
          @font-face { font-family: 'Barlow Condensed'; src: url('/fonts/barlow-condensed-800-italic.ttf') format('truetype'); font-style: italic; font-weight: 800; font-display: swap; }
          * { -webkit-tap-highlight-color: transparent; }
          button, select { font: inherit; }
        `}</style>
      </head>
      <body
        style={{
          minHeight: "100%",
          margin: 0,
          background: "#000",
          color: "#f5fbff",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
