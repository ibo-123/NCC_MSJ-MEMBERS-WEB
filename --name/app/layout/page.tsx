// app/layout.tsx (simplified version without animations)
import "./globals.css";
import Navbar from "@/components/UI/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NCC_MSJ Tech Platform",
  description:
    "A professional system for managing members, attendance, achievements, and courses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen`}
      >
        <Navbar />
        <main className="p-4 md:p-6 min-h-[calc(100vh-64px)]">{children}</main>

        {/* Simple static background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_50%)]" />

        <Analytics />
      </body>
    </html>
  );
}
