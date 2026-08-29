import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Settings",
  description: "A neon arcade gameplay settings screen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ minHeight: "100%", background: "#02050d" }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (() => {
            const update = () => {
              const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
              const width = Math.min(1024, Math.max(0, document.documentElement.clientWidth - 16), Math.max(0, viewportHeight - 16) * 2 / 3);
              const scale = width / 1024;
              document.documentElement.style.setProperty('--settings-width', width + 'px');
              document.documentElement.style.setProperty('--settings-height', width * 1.5 + 'px');
              document.documentElement.style.setProperty('--settings-scale', String(scale));
            };
            update();
            window.addEventListener('resize', update);
            window.addEventListener('pageshow', update);
            window.visualViewport?.addEventListener('resize', update);
          })();
        ` }} />
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
