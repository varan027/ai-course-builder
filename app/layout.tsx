import type { Metadata } from "next";
import { Inter, Roboto_Flex, Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressstart = Press_Start_2P({
  variable: "--font-pressstart",
  subsets: ["latin"],
  weight: ["400"],
});
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const roboto = Roboto_Flex({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AI Course Builder",
  description: "Generates AI Courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.className} ${pressstart.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
