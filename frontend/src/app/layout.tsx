// src/app/layout.tsx
import Navbar from '@/components/Navbar';
import ChatWidget from '@/components/ChatWidget';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-[#121212] text-white">
                <Navbar />
                <main className="max-w-6xl mx-auto p-4 pb-24">
                    {children}
                </main>
                {/* Chatbot Melayang ada di sini agar muncul di semua halaman */}
                <ChatWidget />
            </body>
        </html>
    );
}