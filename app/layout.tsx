import Navbar from "./components/Navbar";
import "./globals.css";
import 'animate.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@4.1.0/dist/tailwind.min.css"
          rel="stylesheet"
        /> */}
        {/* <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        /> */}
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />

      </head>
      <body>
        <Navbar />
        <div className="container mx-auto px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
