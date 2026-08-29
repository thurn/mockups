import type { Metadata } from "next";
import { squareScaleScript } from "./components/squareScale";

export const metadata: Metadata = {
  title: "Chess Chess Revolution",
  description: "A neon arcade main menu concept.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ minHeight: "100%", background: "#02050d" }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: squareScaleScript }} />
      </head>
      <body
        style={{
          minHeight: "100%",
          margin: 0,
          background: "#02050d",
          color: "#f5fbff",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
