import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import ChatWidget from "../components/ChatWidget";

export const metadata: Metadata = {
    title: "CulTour AI — Wisata Budaya Danau Toba",
    description: "AI-Powered Cultural Tourism Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" data-scroll-behavior="smooth">
            <body className="bg-[#07090a] text-white antialiased min-h-screen overflow-x-hidden">
                <Navbar />
                {/* pt-0 — konten hero mulai dari atas, navbar overlay di atasnya */}
                <main className="relative z-10">
                    {children}
                </main>
                <ChatWidget />
            </body>
        </html>
    );
}