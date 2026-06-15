"use client";
import Link from 'next/link';
import { Sparkles, ArrowRight, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
            {/* HERO SECTION */}
            <section className="bg-gradient-to-br from-[#1E3A2F] to-[#0a0a0a] p-10 md:p-20 rounded-[48px] border border-green-900/30 mb-12 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-green-900/40 text-green-400 px-5 py-2 rounded-full text-xs font-bold mb-8 border border-green-800/30 backdrop-blur-md">
                        <Sparkles size={16} className="animate-pulse" /> AI-Powered Cultural Assistant
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                        Jelajahi Danau Toba <br />
                        <span className="text-green-500 italic">dengan Personal</span>
                    </h1>

                    <p className="text-gray-400 text-xl mb-12 max-w-xl leading-relaxed">
                        Temukan kekayaan budaya, kuliner autentik, dan rencana perjalanan yang disesuaikan khusus untuk Anda oleh kecerdasan buatan.
                    </p>

                    <div className="flex flex-wrap gap-5">
                        <Link href="/planner" className="bg-green-700 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-black transition-all flex items-center gap-3 shadow-xl shadow-green-900/20 active:scale-95 text-lg">
                            Rencanakan Trip <ArrowRight size={22} />
                        </Link>
                        <Link href="/explore" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold transition-all flex items-center gap-3 backdrop-blur-sm text-lg">
                            Jelajahi Destinasi
                        </Link>
                    </div>
                </div>

                {/* Dekorasi Glow */}
                <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px]"></div>
            </section>

            {/* STATS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                    { label: 'Destinasi', val: '48+' },
                    { label: 'Kategori Budaya', val: '12' },
                    { label: 'Area Kawasan', val: '7' }
                ].map((s, i) => (
                    <div key={i} className="bg-[#141414] p-10 rounded-[32px] border border-white/5 hover:border-green-500/30 transition-all group">
                        <div className="text-5xl font-black text-white mb-3 group-hover:text-green-500 transition-colors">{s.val}</div>
                        <div className="text-gray-500 text-sm uppercase tracking-[0.3em] font-bold">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* FEATURED DESTINATION */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-bold mb-3 tracking-tight">Destinasi Unggulan</h2>
                    <p className="text-gray-500 text-lg">Rekomendasi terbaik berdasarkan analisis AI CulTour</p>
                </div>
                <Link href="/explore" className="bg-green-900/20 text-green-500 px-6 py-3 rounded-xl font-bold hover:bg-green-900/40 transition-all border border-green-800/20">
                    Lihat Semua
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-[#141414] p-4 rounded-[40px] border border-white/5 group transition-all hover:translate-y-[-10px] hover:shadow-2xl hover:shadow-green-900/10">
                    <div className="bg-gradient-to-br from-green-800/20 to-emerald-900/20 aspect-[4/3] rounded-[32px] mb-6 flex items-center justify-center text-5xl group-hover:scale-[1.03] transition-transform duration-500">🏛️</div>
                    <div className="px-4 pb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="bg-green-900/30 text-green-500 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-green-800/20">Budaya</span>
                            <div className="flex items-center gap-1 text-amber-500 text-sm font-black"><Star size={14} fill="currentColor" /> 4.8</div>
                        </div>
                        <h4 className="font-bold text-2xl mb-2 text-white group-hover:text-green-400 transition-colors tracking-tight">Huta Siallagan</h4>
                        <p className="text-gray-500 text-sm flex items-center gap-2 font-medium leading-relaxed">
                            <MapPin size={16} className="text-green-700" /> Ambarita, Samosir
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
