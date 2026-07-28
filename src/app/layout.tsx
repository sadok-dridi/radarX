import type { Metadata } from "next";
import "./globals.css";
import { PageTransitionProvider } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "Paragon",
  description: "",
  icons: { icon: "/paragon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
