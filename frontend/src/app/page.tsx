"use client";
import Link from 'next/link';
import { Sparkles, Star, MapPin, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#1E3A2F] to-[#121212] p-12 rounded-[48px] border border-green-900/20 mb-12 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-5xl font-black mb-6 leading-tight">Jelajahi Danau Toba <br /><span className="text-green-500 italic">dengan Personal</span></h1>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl">Asisten wisata budaya cerdas berbasis AI yang disesuaikan dengan preferensimu.</p>
                    <div className="flex gap-4">
                        <Link href="/planner" className="bg-[#2D6A4F] px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#1f4b36] transition-all shadow-xl shadow-green-900/20">
                            Rencanakan Trip <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-[100px]"></div>
            </section>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                {[
                    { label: 'Destinasi', val: '48+' },
                    { label: 'Kategori Budaya', val: '12' },
                    { label: 'Area Kawasan', val: '7' }
                ].map((s, i) => (
                    <div key={i} className="bg-[#1A1A1A] p-8 rounded-[32px] border border-gray-800 text-center hover:border-green-500/30 transition-all cursor-default">
                        <div className="text-4xl font-black text-white mb-1">{s.val}</div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</div>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mb-8">Destinasi Unggulan</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#1A1A1A] p-3 rounded-[32px] border border-gray-800 group hover:border-green-500/50 transition-all">
                    <div className="bg-[#2D6A4F]/20 aspect-video rounded-[24px] mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">🏛️</div>
                    <div className="px-3 pb-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase text-green-500">Budaya</span>
                            <span className="flex items-center text-xs text-amber-500 gap-1 font-bold"><Star size={12} fill="currentColor" /> 4.8</span>
                        </div>
                        <h4 className="font-bold">Huta Siallagan</h4>
                        <p className="text-gray-500 text-[10px] mt-1 flex items-center gap-1"><MapPin size={10} /> Samosir • Gratis</p>
                    </div>
                </div>
            </div>
        </main>
    );
}