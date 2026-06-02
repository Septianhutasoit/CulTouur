'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Compass, Sparkles, Map, BookOpen,
    Menu, X, ChevronDown, LogOut, User, Settings,
    MessageCircle, CalendarDays, Bell,
} from 'lucide-react';

// ── Nav items (user-facing) ─────────────────────────────────────────────────
const navItems = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Jelajahi', href: '/explore', icon: Compass },
    { name: 'Trip Planner', href: '/planner', icon: CalendarDays },
    { name: 'AI Guide', href: '/ai', icon: Sparkles },
    { name: 'Culturepedia', href: '/culturepedia', icon: BookOpen },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Scroll effect
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 72);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close dropdowns on route change
    useEffect(() => {
        setIsMobileOpen(false);
        setIsProfileOpen(false);
        setIsNotifOpen(false);
    }, [pathname]);

    const closeAll = () => {
        setIsProfileOpen(false);
        setIsNotifOpen(false);
    };

    return (
        <>
            {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 20 }}
                className="fixed top-0 left-0 right-0 z-[100]"
            >
                <div className={`w-full transition-all duration-500 ${isScrolled ? 'px-4 sm:px-8 pt-3 pb-2' : 'px-0 pt-0 pb-0'}`}>
                    <div
                        className={`flex items-center justify-between gap-4 transition-all duration-500
              ${isScrolled
                                ? 'bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/30 px-5 py-2.5'
                                : 'bg-gradient-to-b from-black/40 to-transparent px-6 sm:px-10 py-4'}`}
                    >

                        {/* ── Brand ─────────────────────────────────────────────────── */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                            {/* Logo mark */}
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D9E75] to-[#0F6E56] flex items-center justify-center shadow-lg shadow-[#1D9E75]/20 flex-shrink-0">
                                <Map size={18} className="text-white" />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[17px] font-black tracking-tight text-white">
                                    Cul<span className={`transition-colors duration-500 ${isScrolled ? 'text-[#5DCAA5]' : 'text-[#9FE1CB]'}`}>Tour</span>
                                </span>
                                <span className={`text-[9px] font-semibold tracking-widest uppercase transition-colors duration-500 ${isScrolled ? 'text-white/40' : 'text-white/50'}`}>
                                    Danau Toba AI
                                </span>
                            </div>
                        </Link>

                        {/* ── Nav items (desktop) ────────────────────────────────────── */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center gap-0.5">
                                {navItems.map(item => {
                                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.96 }}
                                                className={`relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-xl cursor-pointer transition-all duration-200
                          ${isActive
                                                        ? isScrolled ? 'text-[#5DCAA5]' : 'text-white font-semibold'
                                                        : isScrolled
                                                            ? 'text-white/60 hover:text-white hover:bg-white/10'
                                                            : 'text-white/75 hover:text-white hover:bg-white/10'}`}
                                            >
                                                <item.icon size={14} className="flex-shrink-0" />
                                                <span>{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="cultour-active-nav"
                                                        className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full ${isScrolled ? 'bg-[#5DCAA5]' : 'bg-white'}`}
                                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Actions kanan ─────────────────────────────────────────── */}
                        <div className="flex items-center gap-1.5 shrink-0">

                            {/* Bell notifikasi */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => { setIsNotifOpen(p => !p); setIsProfileOpen(false); }}
                                    className={`relative p-2 rounded-xl transition-all
                    ${isNotifOpen
                                            ? 'text-[#5DCAA5] bg-white/10'
                                            : isScrolled ? 'text-white/50 hover:text-white hover:bg-white/10' : 'text-white/65 hover:text-white hover:bg-white/10'}`}
                                >
                                    <Bell size={17} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0a0a0a]" />
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-72 bg-[#0d0d0d]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-[110]"
                                        >
                                            <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                                                <p className="text-[11px] font-black text-white/50 uppercase tracking-widest">Notifikasi</p>
                                                {unreadCount > 0 && (
                                                    <span className="text-[9px] bg-[#1D9E75] text-white px-2 py-0.5 rounded-full font-bold">{unreadCount} baru</span>
                                                )}
                                            </div>
                                            <div className="p-8 flex flex-col items-center gap-2">
                                                <Bell size={22} className="text-white/15" />
                                                <p className="text-[11px] text-white/30 font-semibold">Belum ada notifikasi</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Profile dropdown */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => { setIsProfileOpen(p => !p); setIsNotifOpen(false); }}
                                    className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-all duration-300"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#085041] flex items-center justify-center flex-shrink-0 ring-2 ring-[#1D9E75]/40">
                                        <User size={13} className="text-white" />
                                    </div>
                                    <span className="hidden sm:block text-[11px] font-semibold text-white pr-0.5">Wisatawan</span>
                                    <ChevronDown size={12} className={`text-white/50 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-56 bg-[#0d0d0d]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-[110]"
                                        >
                                            {/* Header profil */}
                                            <div className="bg-gradient-to-br from-[#1D9E75]/80 to-[#085041]/80 px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                                        <User size={16} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white leading-tight">Wisatawan</p>
                                                        <p className="text-[10px] text-[#9FE1CB] mt-0.5">Danau Toba Explorer</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2 space-y-0.5">
                                                {[
                                                    { href: '/profile', icon: User, label: 'Profil saya' },
                                                    { href: '/settings', icon: Settings, label: 'Pengaturan' },
                                                    { href: '/ai', icon: MessageCircle, label: 'Tanya AI Guide' },
                                                ].map(item => (
                                                    <Link key={item.href} href={item.href} onClick={closeAll}>
                                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/70 hover:text-white hover:bg-white/10 transition-all">
                                                            <item.icon size={14} className="text-[#5DCAA5]" />
                                                            {item.label}
                                                        </button>
                                                    </Link>
                                                ))}
                                                <div className="h-px bg-white/8 mx-2 my-1" />
                                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-400 hover:bg-red-500/10 transition-all">
                                                    <LogOut size={14} />
                                                    Keluar
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile hamburger */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileOpen(p => !p)}
                                className="lg:hidden p-2 rounded-xl text-white/70 hover:bg-white/10 transition-all"
                            >
                                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* ── Mobile menu ─────────────────────────────────────────────────── */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="lg:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/8 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-0.5">
                                {navItems.map((item, idx) => {
                                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-medium transition-all
                          ${isActive
                                                        ? 'bg-[#1D9E75]/20 text-[#5DCAA5] border border-[#1D9E75]/30'
                                                        : 'text-white/60 hover:text-white hover:bg-white/8'}`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <item.icon size={15} />
                                                    {item.name}
                                                </span>
                                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5]" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                <div className="pt-2 mt-1 border-t border-white/8 space-y-0.5">
                                    <Link href="/ai" onClick={() => setIsMobileOpen(false)}>
                                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] text-[#5DCAA5] hover:bg-[#1D9E75]/15 transition-all font-medium">
                                            <Sparkles size={15} /> Tanya AI Guide
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* ── Backdrop (tutup semua dropdown) ─────────────────────────────── */}
            {(isProfileOpen || isNotifOpen) && (
                <div className="fixed inset-0 z-[90]" onClick={closeAll} />
            )}
        </>
    );
}