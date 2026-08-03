import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SoundEffects from "@/components/SoundEffects";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OneFrame Studios | Every story, down to the last frame.",
  description: "Award-winning video editing, VFX, and color grading studio crafting cinematic visual experiences that captivate and inspire.",
  keywords: ["video editing", "vfx", "color grading", "cinematic", "commercials", "music videos", "short films", "post-production"],
  openGraph: {
    title: "OneFrame Studios | Visual Media Experts",
    description: "Award-winning video editing, VFX, and color grading studio.",
    url: "https://oneframestudios.com",
    siteName: "OneFrame Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneFrame Studios",
    description: "Award-winning video editing, VFX, and color grading studio.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-[#050505] text-[#f5f5f5] min-h-full flex flex-col cursor-none`}>
        {/* Global Cinematic Film Grain */}
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-difference" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')", backgroundSize: "200px 200px" }}></div>
        
        <SoundEffects />
        <CustomCursor />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
