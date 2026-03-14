import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Opportunity Radar",
  description: "Private opportunity intelligence workspace powered by n8n and a future-ready dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
