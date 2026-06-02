import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/ChatWidget';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'CulTour — Wisata Budaya Danau Toba',
    description: 'Platform wisata budaya cerdas berbasis AI untuk kawasan Danau Toba',
    keywords: ['Danau Toba', 'wisata budaya', 'Batak', 'AI tourism'],
};

// Halaman yang pakai full-bleed hero (navbar transparan di atas konten)
const HERO_PAGES = ['/', '/explore', '/ai', '/culturepedia', '/planner'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id">
            <body className={`${geist.className} bg-[#0a0a0a] min-h-screen overflow-x-clip`}>
                <Navbar />
                <main>
                    {children}
                </main>
                {/* Floating AI chat bubble — muncul di semua halaman */}
                <ChatWidget />
            </body>
        </html>
    );
}