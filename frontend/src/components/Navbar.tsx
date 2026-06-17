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
    { id: 1, title: '✨ Destinasi Baru', desc: 'Air Terjun Efrata telah ditambahkan!', time: '2 jam lalu', dot: 'bg-emerald-500' },
    { id: 2, title: '🎯 Trip Planner', desc: 'Jangan lupa selesaikan rencana akhir pekan Anda.', time: '5 jam lalu', dot: 'bg-blue-500' },
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
        const fn = () => setScrolled(window.scrollY > 10);
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
                transition={{ duration: 0.45, type: 'spring', stiffness: 140, damping: 22 }}
                className={`fixed top-0 inset-x-0 z-[100] bg-white transition-shadow duration-300
                    ${scrolled ? 'shadow-md border-b border-slate-100' : 'shadow-sm border-b border-slate-100'}`}
            >
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

                    {/* ── Brand ───────────────────────────────────────────────── */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                        <motion.div
                            whileHover={{ scale: 1.07, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm"
                        >
                            <Map size={17} className="text-white" />
                        </motion.div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-[15px] font-black tracking-tight text-slate-800">
                                Cul<span className="text-emerald-600">Tour</span>
                            </span>
                            <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400">
                                Danau Toba AI
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop nav ─────────────────────────────────────────── */}
                    <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                        {NAV_ITEMS.map(item => {
                            const active = isActive(item.href);
                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        whileTap={{ scale: 0.97 }}
                                        className={`relative flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold
                                            rounded-md transition-colors duration-150 cursor-pointer select-none
                                            ${active
                                                ? 'text-emerald-700'
                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                            }`}
                                    >
                                        <item.icon size={14} className="flex-shrink-0" />
                                        <span>{item.name}</span>
                                        {/* Active underline — same pattern as Nauli Dental */}
                                        {active && (
                                            <motion.div
                                                layoutId="cultour-active-nav"
                                                className="absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full bg-emerald-600"
                                                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
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
                                whileTap={{ scale: 0.93 }}
                                onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
                                aria-label="Pemberitahuan"
                                className={`relative p-2 rounded-lg transition-colors duration-150
                                    ${notifOpen
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <Bell size={18} />
                                {notifs.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {notifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                        transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl
                                            border border-slate-200 overflow-hidden z-[110]"
                                    >
                                        {/* Header */}
                                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                            <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
                                                Pemberitahuan
                                            </h4>
                                            {notifs.length > 0 && (
                                                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                                                    {notifs.length} Baru
                                                </span>
                                            )}
                                        </div>

                                        {/* List */}
                                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                                            {notifs.length === 0 ? (
                                                <div className="py-10 text-center space-y-2">
                                                    <Bell size={22} className="mx-auto text-slate-200" />
                                                    <p className="text-[11px] text-slate-400 uppercase font-bold tracking-tight">
                                                        Tidak ada notifikasi
                                                    </p>
                                                </div>
                                            ) : notifs.map(n => (
                                                <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-default group">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.dot}`} />
                                                        <p className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                                                            {n.title}
                                                        </p>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 leading-relaxed pl-3.5">{n.desc}</p>
                                                    <p className="text-[10px] text-emerald-500 mt-1.5 font-semibold pl-3.5">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
                                            <button
                                                onClick={() => setNotifs([])}
                                                className="w-full text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors py-0.5"
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
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors duration-150
                                    border ${profileOpen
                                        ? 'border-emerald-200 bg-emerald-50'
                                        : 'border-slate-200 bg-white hover:bg-slate-50'
                                    }`}
                            >
                                {/* Avatar with status dot */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center
                                        text-white font-bold text-[10px] ring-2 ring-emerald-100">
                                        WT
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400
                                        rounded-full border-2 border-white" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-[11px] font-bold text-slate-700 leading-tight">Wisatawan</p>
                                    <p className="text-[9px] font-medium text-emerald-600">Danau Toba AI</p>
                                </div>
                                <ChevronDown
                                    size={13}
                                    className={`text-slate-400 transition-transform duration-250 ${profileOpen ? 'rotate-180' : ''}`}
                                />
                            </motion.button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                        transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl
                                            border border-slate-200 overflow-hidden z-[110]"
                                    >
                                        {/* Profile header */}
                                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-4 py-3 flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white">
                                                WT
                                            </div>
                                            <div>
                                                <p className="font-bold text-[13px] text-white leading-tight">Wisatawan</p>
                                                <p className="text-[10px] text-emerald-100 mt-0.5">Danau Toba Explorer</p>
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        <div className="px-2 py-2 space-y-0.5">
                                            {[
                                                { href: '/profile', icon: User, label: 'Profil Saya' },
                                                { href: '/settings', icon: Settings, label: 'Pengaturan' },
                                                { href: '/ai', icon: MessageCircle, label: 'Tanya AI Guide' },
                                            ].map(it => (
                                                <Link key={it.href} href={it.href} onClick={closeDropdowns}>
                                                    <button className="w-full px-3 py-2 text-left text-[13px] font-medium text-slate-600
                                                        hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors">
                                                        <it.icon size={14} className="text-emerald-500 flex-shrink-0" />
                                                        {it.label}
                                                    </button>
                                                </Link>
                                            ))}
                                            <div className="h-px bg-slate-100 mx-1 my-1" />
                                            <button
                                                onClick={() => { setProfileOpen(false); setLogoutModal(true); }}
                                                className="w-full px-3 py-2 text-left text-[13px] font-semibold text-red-500
                                                    hover:bg-red-50 rounded-lg flex items-center gap-2.5 transition-colors"
                                            >
                                                <LogOut size={14} className="flex-shrink-0" /> Keluar
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile hamburger */}
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setMobileOpen(p => !p)}
                            aria-label="Menu"
                            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>
                    </div>
                </div>

                {/* ── Mobile menu ──────────────────────────────────────────────── */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-0.5">
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
                                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors
                                                    ${active
                                                        ? 'bg-emerald-50 text-emerald-700 border-l-[3px] border-emerald-500'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <item.icon size={15} className={active ? 'text-emerald-500' : 'text-slate-400'} />
                                                    {item.name}
                                                </span>
                                                {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                <div className="pt-2 mt-1 border-t border-slate-100 space-y-0.5">
                                    {[
                                        { href: '/profile', icon: User, label: 'Profil Saya', color: 'text-slate-600' },
                                        { href: '/settings', icon: Settings, label: 'Pengaturan', color: 'text-slate-600' },
                                        { href: '/ai', icon: MessageCircle, label: 'Tanya AI Guide', color: 'text-emerald-600' },
                                    ].map(item => (
                                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                                            <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium
                                                hover:bg-slate-50 transition-colors ${item.color}`}>
                                                <item.icon size={15} className="text-slate-400 flex-shrink-0" />
                                                {item.label}
                                            </div>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => { setMobileOpen(false); setLogoutModal(true); }}
                                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold
                                            text-red-500 hover:bg-red-50 transition-colors"
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
                <div
                    className="fixed inset-0 z-[90]"
                    onClick={closeDropdowns}
                />
            )}

            {/* ── LOGOUT MODAL ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {logoutModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[200]"
                            onClick={() => setLogoutModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 16 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
                        >
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                                {/* Modal header */}
                                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                        <LogOut size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-black text-white uppercase tracking-wide">Keluar Aplikasi</p>
                                        <p className="text-[10px] text-emerald-100">CulTour Danau Toba</p>
                                    </div>
                                </div>

                                <div className="px-5 py-5">
                                    <p className="text-[13px] text-slate-500 leading-relaxed">
                                        Anda akan keluar dari{' '}
                                        <span className="text-emerald-600 font-bold">CulTour</span>.
                                        Sesi Anda akan diakhiri.
                                    </p>
                                </div>

                                <div className="px-5 pb-5 flex gap-3">
                                    <button
                                        onClick={() => setLogoutModal(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px]
                                            font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={() => { setLogoutModal(false); console.log('logout'); }}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px]
                                            font-black uppercase tracking-wide transition-colors active:scale-95"
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