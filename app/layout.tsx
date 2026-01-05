import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import FontLoader from "@/components/FontLoader";
import "./globals.css";


export const metadata: Metadata = {
  title: "Daniel Shui",
  description: "Design Portfolio for Daniel Shui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased !bg-white`}
      >
        <FontLoader />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
