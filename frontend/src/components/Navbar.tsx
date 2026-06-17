'use client';
import { useEffect, useState, useRef } from 'react';
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
    { id: 1, title: '✨ Destinasi Baru', desc: 'Air Terjun Efrata telah ditambahkan!', time: '2 jam lalu', dot: 'bg-emerald-500' },
    { id: 2, title: '🎯 Trip Planner', desc: 'Jangan lupa selesaikan rencana akhir pekan Anda.', time: '5 jam lalu', dot: 'bg-blue-500' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifs, setNotifs] = useState(DEMO_NOTIFS);
    const [logoutModal, setLogoutModal] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
        setIsProfileOpen(false);
        setIsNotifOpen(false);
    }, [pathname]);

    const closeAll = () => { setIsProfileOpen(false); setIsNotifOpen(false); };

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    paddingLeft: isScrolled ? '2rem' : '0px',
                    paddingRight: isScrolled ? '2rem' : '0px',
                    paddingTop: isScrolled ? '12px' : '0px',
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="fixed top-0 left-0 right-0 z-[100]"
            >
                {/*
                  ─────────────────────────────────────────────────────────────
                  WRAPPER: inset kiri-kanan muncul saat scrolled
                  Sebelum scroll : px-0  pt-0  → full width, rata tepi
                  Setelah scroll : px-6  pt-4  → ada jarak kiri-kanan seperti gbr
                  ─────────────────────────────────────────────────────────────
                */}
                <div>
                    {/*
                      Inner bar:
                      Sebelum scroll : transparan, lebar penuh, padding dalam besar
                      Setelah scroll : frosted pill mengambang, rounded-2xl, shadow
                    */}
                    <div className={`flex items-center justify-between gap-4
                        transition-all duration-500 ease-in-out
                        ${isScrolled
                        ? 'bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/10 px-5 py-2.5'
                        : 'bg-gradient-to-b from-black/30 to-transparent px-6 sm:px-10 py-4'
                        }`}
                    >

                        {/* ── BRAND ─────────────────────────────────────────── */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                            <motion.div
                                whileHover={{ scale: 1.07, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D9E75] to-[#0F6E56]
                                    flex items-center justify-center shadow-lg shadow-[#1D9E75]/20 shrink-0"
                            >
                                <Map size={20} className="text-white" />
                            </motion.div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[17px] font-black tracking-tight text-white">
                                    Cul
                                    <span className={`transition-colors duration-500
                                        ${isScrolled ? 'text-[#5DCAA5]' : 'text-[#9FE1CB]'}`}>
                                        Tour
                                    </span>
                                </span>
                                <span className={`text-[9px] font-semibold tracking-widest uppercase
                                    transition-colors duration-500
                                    ${isScrolled ? 'text-white/40' : 'text-white/60'}`}>
                                    Danau Toba AI
                                </span>
                            </div>
                        </Link>

                        {/* ── DESKTOP NAV ───────────────────────────────────── */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center gap-7">
                                {NAV_ITEMS.map(item => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.97 }}
                                                className={`relative flex items-center gap-2 px-4 py-2
                                                    text-sm font-medium rounded-xl cursor-pointer
                                                    transition-all duration-200
                                                    ${active
                                                        ? isScrolled ? 'text-[#5DCAA5]' : 'text-white font-semibold'
                                                        : isScrolled
                                                            ? 'text-slate-300 hover:text-white hover:bg-white/10'
                                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                <item.icon size={15} className="flex-shrink-0" />
                                                <span>{item.name}</span>
                                                {active && (
                                                    <motion.div
                                                        layoutId="cultour-active-nav"
                                                        className={`absolute bottom-0.5 left-2 right-2 h-[2px] rounded-full
                                                            ${isScrolled ? 'bg-[#5DCAA5]' : 'bg-white'}`}
                                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── RIGHT ACTIONS ─────────────────────────────────── */}
                        <div className="flex items-center gap-2 shrink-0">

                            {/* Bell */}
                            <div className="relative" ref={notifRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setIsNotifOpen(p => !p); setIsProfileOpen(false); }}
                                    className={`relative p-2 rounded-xl transition-all z-50
                                        ${isNotifOpen
                                            ? 'text-[#5DCAA5] bg-white/10'
                                            : isScrolled
                                                ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Bell size={18} />
                                    {notifs.length > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500
                                            rounded-full border border-[#0a0a0a] animate-pulse" />
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-3 w-80 bg-[#121212]/95 backdrop-blur-xl
                                                border border-white/10 rounded-2xl shadow-2xl shadow-black/50
                                                overflow-hidden z-[110]"
                                        >
                                            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                                <h4 className="text-xs font-black text-white uppercase tracking-widest">
                                                    Pemberitahuan
                                                </h4>
                                                {notifs.length > 0 && (
                                                    <span className="text-[9px] bg-[#1D9E75] text-white px-2 py-0.5 rounded-full font-bold">
                                                        {notifs.length} Baru
                                                    </span>
                                                )}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                                                {notifs.length === 0 ? (
                                                    <div className="p-10 text-center">
                                                        <Bell size={24} className="mx-auto text-white/10 mb-2" />
                                                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">
                                                            Belum ada notifikasi
                                                        </p>
                                                    </div>
                                                ) : notifs.map(n => (
                                                    <div key={n.id}
                                                        className="p-4 hover:bg-white/5 transition-colors cursor-default group"
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.dot}`} />
                                                            <p className="text-[11px] font-black text-white uppercase group-hover:text-[#5DCAA5] transition-colors">
                                                                {n.title}
                                                            </p>
                                                        </div>
                                                        <p className="text-[10px] text-white/50 leading-relaxed">{n.desc}</p>
                                                        <p className="text-[8px] text-[#5DCAA5]/50 mt-2 font-bold italic">{n.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-3 border-t border-white/5">
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

                            {/* Profile pill */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { setIsProfileOpen(p => !p); setIsNotifOpen(false); }}
                                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full
                                        transition-all duration-300
                                        bg-white/10 border border-white/20 hover:bg-white/20"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-7 h-7 rounded-full ring-2 ring-[#1D9E75]/50
                                            flex items-center justify-center
                                            bg-gradient-to-br from-[#1D9E75] to-[#0F6E56]
                                            text-white font-bold text-[10px]">
                                            WT
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2
                                            bg-emerald-400 rounded-full border border-white" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-[11px] font-semibold leading-tight text-white">Wisatawan</p>
                                        <p className="text-[9px] font-medium text-[#5DCAA5]">Danau Toba AI</p>
                                    </div>
                                    <ChevronDown
                                        size={12}
                                        className={`text-white/60 transition-transform duration-300
                                            ${isProfileOpen ? 'rotate-180' : ''}`}
                                    />
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-64 bg-[#1a1a1a]/95
                                                backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50
                                                border border-white/8 overflow-hidden z-[110]"
                                        >
                                            <div className="bg-gradient-to-br from-[#1D9E75]/90 to-[#0F6E56]/90 px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white">
                                                        WT
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-white leading-tight">Wisatawan</p>
                                                        <p className="text-[10px] text-[#9FE1CB] mt-0.5">Danau Toba Explorer</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-3 space-y-1">
                                                {[
                                                    { href: '/profile', icon: User, label: 'Profil Saya' },
                                                    { href: '/settings', icon: Settings, label: 'Pengaturan' },
                                                    { href: '/ai', icon: MessageCircle, label: 'Tanya AI Guide' },
                                                ].map(it => (
                                                    <Link key={it.href} href={it.href} onClick={closeAll}>
                                                        <button className="w-full px-3 py-2.5 text-left text-sm font-medium
                                                            text-slate-300 hover:bg-white/5 rounded-xl
                                                            flex items-center gap-3 transition-all">
                                                            <it.icon size={14} className="text-[#5DCAA5]" />
                                                            {it.label}
                                                        </button>
                                                    </Link>
                                                ))}
                                                <div className="h-px bg-white/5 mx-2 my-1" />
                                                <button
                                                    onClick={() => { setIsProfileOpen(false); setLogoutModal(true); }}
                                                    className="w-full px-3 py-2.5 text-left text-sm font-semibold
                                                        text-red-400 hover:bg-red-500/10 rounded-xl
                                                        flex items-center gap-3 transition-all"
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
                                onClick={() => setIsMobileOpen(p => !p)}
                                className="lg:hidden p-2 rounded-xl text-white/70 hover:bg-white/10 transition-all"
                            >
                                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* ── MOBILE MENU ───────────────────────────────────────────── */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className={`lg:hidden overflow-hidden shadow-lg
                                ${isScrolled
                                    ? 'mx-6 sm:mx-10 mt-2 bg-[#0d1a10]/95 backdrop-blur-xl rounded-2xl border border-white/10'
                                    : 'bg-white/95 backdrop-blur-xl'
                                }`}
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
                                                onClick={() => setIsMobileOpen(false)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                                                    ${isScrolled
                                                        ? active
                                                            ? 'bg-emerald-600/20 text-[#5DCAA5]'
                                                            : 'text-white/70 hover:text-white hover:bg-white/6'
                                                        : active
                                                            ? 'bg-[#1D9E75]/15 text-[#1D9E75]'
                                                            : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <item.icon size={15} /> {item.name}
                                                </span>
                                                {active && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <div className={`pt-2 mt-1 border-t ${isScrolled ? 'border-white/8' : 'border-slate-100'}`}>
                                    <button
                                        onClick={() => { setIsMobileOpen(false); setLogoutModal(true); }}
                                        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl
                                            text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <LogOut size={15} /> Keluar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Backdrop */}
            {(isProfileOpen || isNotifOpen) && (
                <div className="fixed inset-0 z-[90]" onClick={closeAll} />
            )}

            {/* ══ LOGOUT MODAL ══════════════════════════════════════════════ */}
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
                            <div className="bg-[#0D1F16] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-[#1D9E75] to-[#0F6E56] px-6 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                        <LogOut size={17} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-wide">Keluar Aplikasi</p>
                                        <p className="text-[10px] text-emerald-200 font-bold">CulTour Danau Toba</p>
                                    </div>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl p-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#0F6E56]
                                            flex items-center justify-center text-white font-black text-base shrink-0">
                                            WT
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">Wisatawan</p>
                                            <p className="text-[10px] text-white/40 mt-0.5">Danau Toba Explorer</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        Anda akan keluar dari{' '}
                                        <span className="text-[#5DCAA5] font-bold">CulTour</span>.
                                        Sesi Anda akan diakhiri.
                                    </p>
                                </div>
                                <div className="px-6 pb-5 flex gap-3">
                                    <button
                                        onClick={() => setLogoutModal(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm font-bold hover:bg-white/8 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={() => { setLogoutModal(false); console.log('logout'); }}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-600
                                            text-white text-sm font-black uppercase tracking-wide
                                            transition-all active:scale-95"
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