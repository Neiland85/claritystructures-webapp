import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import FunnelTracker from "@/components/FunnelTracker";
import PosthogProvider from "@/components/PosthogProvider";

export const metadata: Metadata = {
  title: "Clarity Structures | Peritaje Informático Forense",
  description:
    "Servicios avanzados de peritaje informático, custodia de pruebas y análisis forense digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased min-h-screen relative overflow-x-hidden">
        <PosthogProvider />
        <FunnelTracker />

        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/2 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/1.5 rounded-full blur-[120px]"></div>
        </div>

        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
