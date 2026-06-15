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

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 50);
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
                initial={{ y: -72, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, type: 'spring', stiffness: 110, damping: 18 }}
                className="fixed top-0 inset-x-0 z-[100]"
            >
                {/* 
                  BEFORE scroll → transparent / gradient, full width, large padding
                  AFTER  scroll → frosted pill / card that shrinks inward
                */}
                <div className={`transition-all duration-500 ease-out
                    ${scrolled ? 'px-4 sm:px-6 pt-3 pb-3' : 'px-0 pt-0 pb-0'}`}>

                    <div className={`flex items-center justify-between gap-4 transition-all duration-500 ease-out
                        ${scrolled
                            ? 'bg-[#060e09]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 px-6 py-3'
                            : 'bg-gradient-to-b from-black/55 to-transparent px-6 sm:px-10 py-5'
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
                            <div className="leading-tight">
                                <p className="text-[16px] font-black tracking-tight text-white">
                                    Cul<span className="text-emerald-400">Tour</span>
                                </p>
                                <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-white/50">
                                    Danau Toba AI
                                </p>
                            </div>
                        </Link>

                        {/* ── Desktop nav ─────────────────────────────────────────── */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV_ITEMS.map(item => {
                                const active = isActive(item.href);
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <motion.div
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors duration-200
                                                ${active
                                                    ? 'text-white'
                                                    : 'text-white/65 hover:text-white hover:bg-white/8'}`}
                                        >
                                            <item.icon size={15} className="shrink-0" />
                                            {item.name}
                                            {active && (
                                                <motion.span
                                                    layoutId="nav-indicator"
                                                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/15 -z-10"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* ── Right actions ───────────────────────────────────────── */}
                        <div className="flex items-center gap-1.5 shrink-0">

                            {/* Bell */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
                                    className={`relative p-2 rounded-xl transition-colors
                                        ${notifOpen ? 'text-emerald-400 bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/8'}`}
                                >
                                    <Bell size={18} />
                                    {notifs.length > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black animate-pulse" />
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {notifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-3 w-80 bg-[#111]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[110]"
                                        >
                                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 bg-white/4">
                                                <p className="text-[11px] font-black text-white uppercase tracking-widest">Pemberitahuan</p>
                                                {notifs.length > 0 && (
                                                    <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">{notifs.length} Baru</span>
                                                )}
                                            </div>
                                            <div className="divide-y divide-white/5">
                                                {notifs.length === 0 ? (
                                                    <p className="text-center text-[11px] text-white/30 py-8 uppercase tracking-widest font-bold">Tidak ada notifikasi</p>
                                                ) : notifs.map(n => (
                                                    <div key={n.id} className="px-4 py-3 hover:bg-white/4 transition-colors">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${n.dot}`} />
                                                            <p className="text-[11px] font-black text-white">{n.title}</p>
                                                        </div>
                                                        <p className="text-[10px] text-white/50 leading-relaxed">{n.desc}</p>
                                                        <p className="text-[9px] text-emerald-500/60 mt-1 font-semibold italic">{n.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            {notifs.length > 0 && (
                                                <button
                                                    onClick={() => setNotifs([])}
                                                    className="w-full py-2.5 text-[10px] font-bold text-white/30 hover:text-white/60 border-t border-white/6 transition-colors"
                                                >
                                                    Tandai semua dibaca
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Profile */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
                                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white/8 border border-white/15 hover:bg-white/14 transition-all"
                                >
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-[10px] font-black ring-2 ring-emerald-500/30">
                                            WT
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-black" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-[11px] font-semibold text-white leading-tight">Wisatawan</p>
                                        <p className="text-[9px] text-emerald-400">Danau Toba AI</p>
                                    </div>
                                    <ChevronDown size={12} className={`text-white/50 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                </motion.button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-60 bg-[#111]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[110]"
                                        >
                                            <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-3 flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                                    <User size={16} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">Wisatawan</p>
                                                    <p className="text-[10px] text-emerald-200">Danau Toba Explorer</p>
                                                </div>
                                            </div>
                                            <div className="p-2 space-y-0.5">
                                                {[
                                                    { href: '/profile', icon: User, label: 'Profil Saya' },
                                                    { href: '/settings', icon: Settings, label: 'Pengaturan' },
                                                    { href: '/ai', icon: MessageCircle, label: 'Tanya AI Guide' },
                                                ].map(it => (
                                                    <Link key={it.href} href={it.href} onClick={closeDropdowns}>
                                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/70 hover:text-white hover:bg-white/8 transition-all">
                                                            <it.icon size={14} className="text-emerald-400" />
                                                            {it.label}
                                                        </button>
                                                    </Link>
                                                ))}
                                                <div className="h-px bg-white/8 mx-2 my-1" />
                                                <button
                                                    onClick={() => { setProfileOpen(false); setLogoutModal(true); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-400 hover:bg-red-500/10 transition-all"
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
                                className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-all"
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
                            transition={{ duration: 0.28, ease: 'easeInOut' }}
                            className="lg:hidden mx-4 mb-3 overflow-hidden bg-[#0d1a10]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
                        >
                            <div className="p-3 space-y-0.5">
                                {NAV_ITEMS.map((item, idx) => {
                                    const active = isActive(item.href);
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-medium transition-all
                                                    ${active ? 'bg-emerald-600/20 text-emerald-400' : 'text-white/70 hover:text-white hover:bg-white/6'}`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <item.icon size={15} /> {item.name}
                                                </span>
                                                {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <div className="pt-2 mt-1 border-t border-white/8">
                                    <button
                                        onClick={() => { setMobileOpen(false); setLogoutModal(true); }}
                                        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <LogOut size={15} /> Keluar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Backdrop */}
            {(profileOpen || notifOpen) && (
                <div className="fixed inset-0 z-[90]" onClick={closeDropdowns} />
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