import { Metadata } from 'next';
import Navbar from "./components/Navbar";
import "./globals.css";
import 'animate.css';
import { AuthProvider } from "../lib/useAuth";

export const metadata: Metadata = {
  title: 'Arcapp - Sistema de Facturación AFIP',
  description: 'Sistema de facturación electrónica integrado con AFIP',
  icons: {
    icon: '/assets/images/favicon.ico',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <head>
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <div className="container mx-auto px-4">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
