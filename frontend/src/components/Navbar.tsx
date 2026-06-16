'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Compass, CalendarDays, Sparkles, BookOpen,
    Bell, ChevronDown, LogOut, User, Settings,
    MessageCircle, Menu, X, Map,
} from 'lucide-react';

const NAV_ITEMS = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Jelajahi', href: '/explore', icon: Compass },
    { name: 'Trip Planner', href: '/planner', icon: CalendarDays },
    { name: 'AI Guide', href: '/ai', icon: Sparkles },
    { name: 'Culturepedia', href: '/culturepedia', icon: BookOpen },
];

const DEMO_NOTIFS = [
    { id: 1, title: '✨ Destinasi Baru', desc: 'Air Terjun Efrata telah ditambahkan!', time: '2 jam lalu', dot: 'bg-emerald-400' },
    { id: 2, title: '🎯 Trip Planner', desc: 'Jangan lupa selesaikan rencana akhir pekan Anda.', time: '5 jam lalu', dot: 'bg-blue-400' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifs, setNotifs] = useState(DEMO_NOTIFS);
    const [logoutModal, setLogoutModal] = useState(false);

    // ── Scroll effect: sama persis dengan PatientLayout (threshold 80px) ──
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
        setNotifOpen(false);
    }, [pathname]);

    const closeDropdowns = () => { setProfileOpen(false); setNotifOpen(false); };

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <>
            {/* ── MAIN NAV ──────────────────────────────────────────────────── */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 20 }}
                className="fixed top-0 inset-x-0 z-[100]"
            >
                {/*
                  BEFORE scroll → transparent gradient, full-width, no padding (sama seperti PatientLayout)
                  AFTER  scroll → frosted pill mengecil dengan padding kiri-kanan (sama seperti PatientLayout)
                */}
                <div className={`w-full transition-all duration-500 ease-in-out
                    ${scrolled ? 'px-4 sm:px-8 pt-3 pb-2' : 'px-0 pt-0 pb-0'}`}>

                    <div className={`flex items-center justify-between gap-4
                        transition-all duration-500 ease-in-out
                        ${scrolled
                            ? 'bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/10 px-5 py-2.5'
                            : 'bg-gradient-to-b from-black/30 to-transparent px-6 sm:px-10 py-4'
                        }`}>

                        {/* ── Brand ───────────────────────────────────────────────── */}
                        <Link href="/" className="flex items-center gap-3 shrink-0 group">
                            <motion.div
                                whileHover={{ scale: 1.08, rotate: 6 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/40"
                            >
                                <Map size={18} className="text-white" />
                            </motion.div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-lg font-black tracking-tight text-white">
                                    Cul<span className={scrolled ? 'text-emerald-400' : 'text-emerald-300'}>Tour</span>
                                </span>
                                <span className={`text-[9px] font-semibold tracking-wider uppercase transition-colors duration-500
                                    ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>
                                    Danau Toba AI
                                </span>
                            </div>
                        </Link>

                        {/* ── Desktop nav ─────────────────────────────────────────── */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center gap-1">
                                {NAV_ITEMS.map(item => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.97 }}
                                                className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl
                                                    transition-all duration-200 cursor-pointer
                                                    ${active
                                                        ? scrolled ? 'text-emerald-400' : 'text-white font-semibold'
                                                        : scrolled
                                                            ? 'text-slate-300 hover:text-white hover:bg-white/10'
                                                            : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                                            >
                                                <item.icon size={15} className="flex-shrink-0" />
                                                <span>{item.name}</span>
                                                {active && (
                                                    <motion.div
                                                        layoutId="activeNav"
                                                        className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full
                                                            ${scrolled ? 'bg-emerald-400' : 'bg-white'}`}
                                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Right actions ───────────────────────────────────────── */}
                        <div className="flex items-center gap-2 shrink-0">

                            {/* Bell */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
                                    className={`relative p-2 rounded-xl transition-all
                                        ${notifOpen
                                            ? 'text-emerald-400 bg-white/10'
                                            : scrolled
                                                ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <Bell size={18} />
                                    {notifs.length > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black animate-pulse" />
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {notifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-3 w-80 bg-[#121212]/95 backdrop-blur-xl
                                                border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[110]"
                                        >
                                            {/* Header */}
                                            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                                <h4 className="text-xs font-black text-white uppercase tracking-widest">
                                                    Pemberitahuan
                                                </h4>
                                                {notifs.length > 0 && (
                                                    <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                                                        {notifs.length} Baru
                                                    </span>
                                                )}
                                            </div>

                                            {/* List */}
                                            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                                                {notifs.length === 0 ? (
                                                    <div className="p-10 text-center space-y-2">
                                                        <Bell size={24} className="mx-auto text-white/10" />
                                                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">
                                                            Tidak ada notifikasi
                                                        </p>
                                                    </div>
                                                ) : notifs.map(n => (
                                                    <div key={n.id} className="px-4 py-3 hover:bg-white/5 transition-colors cursor-default group">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.dot}`} />
                                                            <p className="text-[11px] font-black text-white uppercase group-hover:text-emerald-400 transition-colors">
                                                                {n.title}
                                                            </p>
                                                        </div>
                                                        <p className="text-[10px] text-white/50 leading-relaxed">{n.desc}</p>
                                                        <p className="text-[9px] text-emerald-500/60 mt-2 font-bold italic">{n.time}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Footer */}
                                            <div className="p-3 border-t border-white/5 bg-white/3">
                                                <button
                                                    onClick={() => setNotifs([])}
                                                    className="w-full text-[10px] font-bold text-white/30 hover:text-white/60 transition-colors py-1"
                                                >
                                                    Tandai semua sudah dibaca
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Profile */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
                                    className="flex items-center gap-2 pl-2 pr-2 py-1 rounded-full transition-all duration-300 bg-white/10 border border-white/20 hover:bg-white/20"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-7 h-7 rounded-full ring-2 ring-emerald-400/50 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-[10px]">
                                            WT
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-black" />
                                    </div>
                                    <div className="hidden sm:block text-left pr-1">
                                        <p className="text-[11px] font-semibold leading-tight text-white">Wisatawan</p>
                                        <p className="text-[9px] font-medium text-emerald-400">Danau Toba AI</p>
                                    </div>
                                    <ChevronDown
                                        size={12}
                                        className={`text-white/60 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`}
                                    />
                                </motion.button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-60 bg-[#1a1a1a]/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 border border-white/8 overflow-hidden z-[110]"
                                        >
                                            <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-3 flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white">
                                                    WT
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm leading-tight text-white">Wisatawan</p>
                                                    <p className="text-[10px] text-emerald-200 mt-0.5">Danau Toba Explorer</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-3 space-y-1">
                                                {[
                                                    { href: '/profile', icon: User, label: 'Profil Saya' },
                                                    { href: '/settings', icon: Settings, label: 'Pengaturan' },
                                                    { href: '/ai', icon: MessageCircle, label: 'Tanya AI Guide' },
                                                ].map(it => (
                                                    <Link key={it.href} href={it.href} onClick={closeDropdowns}>
                                                        <button className="w-full px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl flex items-center gap-3 transition-all">
                                                            <it.icon size={14} className="text-emerald-400" />
                                                            {it.label}
                                                        </button>
                                                    </Link>
                                                ))}
                                                <div className="h-px bg-white/5 mx-2 my-1" />
                                                <button
                                                    onClick={() => { setProfileOpen(false); setLogoutModal(true); }}
                                                    className="w-full px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all"
                                                >
                                                    <LogOut size={14} /> Keluar
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile hamburger */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileOpen(p => !p)}
                                className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                            >
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* ── Mobile menu ──────────────────────────────────────────────── */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="lg:hidden bg-white/95 backdrop-blur-xl shadow-lg overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-0.5">
                                {NAV_ITEMS.map((item, idx) => {
                                    const active = isActive(item.href);
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                                                    ${active ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <item.icon size={15} className="text-slate-400" />
                                                    {item.name}
                                                </span>
                                                {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <div className="pt-3 mt-1 border-t border-slate-100 space-y-0.5">
                                    {[
                                        { href: '/profile', icon: User, label: 'Profil Saya', style: 'text-slate-600' },
                                        { href: '/settings', icon: Settings, label: 'Pengaturan', style: 'text-slate-600' },
                                        { href: '/ai', icon: MessageCircle, label: 'Tanya AI Guide', style: 'text-emerald-600' },
                                    ].map(item => (
                                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all ${item.style}`}>
                                                <item.icon size={16} className="text-slate-400" /> {item.label}
                                            </div>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => { setMobileOpen(false); setLogoutModal(true); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut size={16} /> Keluar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Backdrop — mencakup semua dropdown */}
            {(profileOpen || notifOpen) && (
                <div
                    className="fixed inset-0 z-[90] bg-transparent"
                    onClick={closeDropdowns}
                />
            )}

            {/* ── LOGOUT MODAL ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {logoutModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                            onClick={() => setLogoutModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
                        >
                            <div className="bg-[#0d1a10] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 px-5 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                        <LogOut size={17} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-wide">Keluar Aplikasi</p>
                                        <p className="text-[10px] text-emerald-200">CulTour Danau Toba</p>
                                    </div>
                                </div>
                                <div className="px-5 py-5">
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        Anda akan keluar dari <span className="text-emerald-400 font-bold">CulTour</span>. Sesi Anda akan diakhiri.
                                    </p>
                                </div>
                                <div className="px-5 pb-5 flex gap-3">
                                    <button
                                        onClick={() => setLogoutModal(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm font-bold hover:bg-white/6 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={() => { setLogoutModal(false); console.log('logout'); }}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-black uppercase tracking-wide transition-all active:scale-95"
                                    >
                                        Ya, Keluar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}