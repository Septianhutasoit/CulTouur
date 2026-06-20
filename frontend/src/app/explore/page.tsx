"use client";
import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationCard from '@/components/DestinationCard';
import { destinationService } from '@/services/destination';
import { Destination } from '@/types';

// ── Sesuaikan jika nama field di tipe Destination berbeda (mis. d.region bukan d.kawasan) ──
const CATEGORIES = ['Semua', 'Budaya', 'Alam', 'Kuliner', 'Festival'];
const KAWASAN_LIST = ['Semua', 'Samosir', 'Parapat', 'Balige', 'Tongging'];

export default function ExplorePage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [searchResults, setSearchResults] = useState<Destination[] | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Semua');
    const [kawasan, setKawasan] = useState('Semua');
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(false);

    // ── Load seluruh destinasi sekali di awal ──
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(false);
            try {
                const data = await destinationService.getAll();
                setDestinations(data?.destinations ?? data ?? []);
            } catch (err) {
                console.error('Gagal load destinasi', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // ── Semantic search ke backend (GET /search), debounce 400ms agar tidak spam request ──
    useEffect(() => {
        const query = search.trim();
        if (!query) {
            setSearchResults(null);
            return;
        }
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                // Backend /search mengembalikan array of { destination, score } — unwrap ke Destination[]
                const res = await destinationService.search(query);
                const raw = res?.destinations ?? res ?? [];
                const unwrapped = raw.map((r: any) => r?.destination ?? r);
                setSearchResults(unwrapped);
            } catch (err) {
                console.error('Semantic search gagal, fallback ke filter teks lokal', err);
                setSearchResults(
                    destinations.filter(d =>
                        d.name.toLowerCase().includes(query.toLowerCase()) ||
                        d.location?.toLowerCase().includes(query.toLowerCase())
                    )
                );
            } finally {
                setSearching(false);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [search, destinations]);

    // ── Terapkan filter kategori & kawasan di atas hasil search (atau seluruh data jika tidak ada search) ──
    const baseList = searchResults ?? destinations;
    const filtered = useMemo(() => {
        return baseList.filter(d => {
            const matchCategory = category === 'Semua' || (d as any).category === category;
            const matchKawasan =
                kawasan === 'Semua' ||
                (d as any).kawasan === kawasan ||
                d.location?.toLowerCase().includes(kawasan.toLowerCase());
            return matchCategory && matchKawasan;
        });
    }, [baseList, category, kawasan]);

    const hasActiveFilter = search.trim() !== '' || category !== 'Semua' || kawasan !== 'Semua';

    const resetFilters = () => {
        setSearch('');
        setCategory('Semua');
        setKawasan('Semua');
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-3 text-white">
                        Jelajahi <br />
                        <span className="text-emerald-500 font-serif italic">Danau Toba</span>
                    </h1>
                    <p className="text-gray-400 max-w-md text-sm">
                        Temukan {destinations.length > 0 ? `${destinations.length}+` : ''} destinasi wisata, budaya, dan kuliner terverifikasi di seluruh kawasan Toba.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Cari Samosir, Balige, atau nama tempat..."
                        className="w-full bg-[#111111] border border-white/10 rounded-2xl py-4 pl-12 pr-10 outline-none focus:border-emerald-500 transition-colors text-sm text-white placeholder-gray-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {searching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    )}
                </div>
            </div>

            {/* Filter Kategori */}
            <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2.5">Kategori</p>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all
                                ${category === cat
                                    ? 'bg-emerald-500 border-emerald-500 text-black'
                                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-emerald-500/50 hover:text-emerald-400'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Kawasan */}
            <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2.5">Kawasan</p>
                <div className="flex flex-wrap gap-2">
                    {KAWASAN_LIST.map((k) => (
                        <button
                            key={k}
                            onClick={() => setKawasan(k)}
                            className={`flex items-center gap-1.5 px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all
                                ${kawasan === k
                                    ? 'bg-emerald-500 border-emerald-500 text-black'
                                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-emerald-500/50 hover:text-emerald-400'
                                }`}
                        >
                            {k !== 'Semua' && <MapPin size={10} />}
                            {k}
                        </button>
                    ))}
                </div>
            </div>

            {/* Counter hasil + reset filter */}
            {!loading && !error && (
                <div className="flex items-center justify-between mb-6">
                    <p className="text-xs text-gray-500">
                        <span className="text-white font-bold">{filtered.length}</span> destinasi ditemukan
                    </p>
                    {hasActiveFilter && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                            <RotateCcw size={12} /> Reset filter
                        </button>
                    )}
                </div>
            )}

            {/* Grid Destinasi */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-[4/5] bg-white/5 rounded-[40px] animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-[#111111] rounded-[48px] border border-dashed border-white/10">
                    <p className="text-gray-500 font-bold mb-4">Gagal memuat destinasi. Periksa koneksi backend.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Coba lagi →
                    </button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-[#111111] rounded-[48px] border border-dashed border-white/10">
                    <p className="text-gray-500 font-bold">Destinasi tidak ditemukan. Coba kata kunci atau filter lain.</p>
                </div>
            ) : (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DestinationCard data={item} mode="full" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}