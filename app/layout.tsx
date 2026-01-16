import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import FontLoader from "@/components/FontLoader";
import "./globals.css";
import { Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Daniel Shui's Portfolio",
  description:
    "Multidisciplinary designer developing digital and print projects for individuals, businesses, and organizations across various sectors. His practice encompasses UI/UX, typography, brand development, creative direction, editorials, & more. He has worked on projects for clients both big and small, including the Chicago Bulls, Crypto.com Arena, Texas Rangers, Olympics, FIFA, FC Barcelona, & many more.",
  openGraph: {
    title: "Daniel Shui's Portfolio",
    description:
      "Multidisciplinary designer developing digital and print projects for individuals, businesses, and organizations across various sectors. His practice encompasses UI/UX, typography, brand development, creative direction, editorials, & more. He has worked on projects for clients both big and small, including the Chicago Bulls, Crypto.com Arena, Texas Rangers, Olympics, FIFA, FC Barcelona, & many more.",
    images: [
      {
        url: "/images/open-graph.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased !bg-white touch-none`}>
        <FontLoader />
        <NavBar />
        <div className="all-content">{children}</div>

        <div className="mobile-landscape-only">
          For the best mobile experience, please switch device to portrait
          orientation.
        </div>
      </body>
    </html>
  );
}
