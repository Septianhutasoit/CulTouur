'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, ChevronDown, LogOut, Settings, User, Home,
    Menu, X, UserPlus, Building2, UsersRound,
    CalendarCheck, FileText, Stethoscope, Sparkles,
    Target, ClipboardList, ShieldCheck
} from 'lucide-react';
import api from '@/services/api';

interface Notification {
    id: number;
    title: string;
    desc: string;
    color?: string;
    time?: string;
}

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isQuickOpen, setIsQuickOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(1); // Contoh 1 notif aktif

    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');
        if (!token || role?.toLowerCase() !== 'patient') {
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router, pathname]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', href: '/patient/dashboard', icon: Home },
        { name: 'Layanan', href: '/patient/services', icon: Stethoscope },
        { name: 'Doctors', href: '/patient/doctors', icon: UsersRound },
        { name: 'Trip Planner', href: '/patient/planner', icon: Sparkles }, // Mengikuti tema referensi
        { name: 'Admin', href: '/patient/admin', icon: ShieldCheck },
    ];

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-green-500/30">

            {/* NAVBAR (MODERN GLASSMORPHISM) */}
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className={`flex items-center justify-between p-2 pl-6 pr-3 rounded-2xl border border-gray-800 transition-all duration-500 ${isScrolled ? 'bg-[#1A1A1A]/90 backdrop-blur-xl' : 'bg-[#1E1E1E]'
                        }`}>

                        {/* BRAND */}
                        <Link href="/patient/dashboard" className="flex items-center gap-2 group">
                            <div className="text-xl font-bold tracking-tighter">
                                Nauli<span className="text-green-500 group-hover:text-green-400 transition-colors">Dental</span>
                            </div>
                        </Link>

                        {/* DESKTOP NAV */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <div className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isActive
                                            ? 'bg-[#2D6A4F] text-white shadow-lg shadow-green-900/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}>
                                            <item.icon size={16} />
                                            {item.name}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* ACTION AREA (USER & NOTIF) */}
                        <div className="flex items-center gap-3">

                            {/* QUICK ACCESS (PLANNER STYLE) */}
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => { setIsQuickOpen(!isQuickOpen); setIsNotifOpen(false); setIsProfileOpen(false); }}
                                    className="p-2.5 rounded-xl bg-[#2A2A2A] border border-gray-700 text-gray-300 hover:border-green-500 transition-all"
                                >
                                    <ClipboardList size={20} />
                                </button>
                                <AnimatePresence>
                                    {isQuickOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-3 w-56 bg-[#1E1E1E] border border-gray-800 rounded-2xl shadow-2xl p-2 z-[110]"
                                        >
                                            <Link href="/patient/appointments" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all">
                                                <CalendarCheck size={18} className="text-green-500" />
                                                <span className="text-sm font-medium">Janji Temu</span>
                                            </Link>
                                            <Link href="/patient/records" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all">
                                                <FileText size={18} className="text-blue-500" />
                                                <span className="text-sm font-medium">Rekam Medis</span>
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* USER PROFILE (CULTOUR STYLE) */}
                            <div className="relative">
                                <button
                                    onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); setIsQuickOpen(false); }}
                                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-[#2A2A2A] border border-gray-700 hover:border-green-500/50 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center font-bold text-xs">
                                        SA
                                    </div>
                                    <div className="hidden sm:block text-left leading-tight">
                                        <p className="text-[11px] font-bold text-white">Septian Adi</p>
                                        <p className="text-[9px] text-green-500 font-medium">Pasien Aktif</p>
                                    </div>
                                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-3 w-64 bg-[#1E1E1E] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[110]"
                                        >
                                            <div className="p-4 bg-[#2D6A4F]/10 border-b border-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center font-bold">SA</div>
                                                    <div>
                                                        <p className="text-sm font-bold">Septian Adi</p>
                                                        <p className="text-xs text-gray-500">ID: ND-2024</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <Link href="/patient/profile" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all">
                                                    <User size={16} className="text-gray-400" />
                                                    <span className="text-sm font-medium">Profil Saya</span>
                                                </Link>
                                                <Link href="/patient/settings" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all">
                                                    <Settings size={16} className="text-gray-400" />
                                                    <span className="text-sm font-medium">Pengaturan</span>
                                                </Link>
                                                <div className="h-px bg-gray-800 my-2 mx-2" />
                                                <button
                                                    onClick={() => setShowLogoutModal(true)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-all text-left"
                                                >
                                                    <LogOut size={16} />
                                                    <span className="text-sm font-bold">Keluar Portal</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* MOBILE MENU */}
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-400">
                                {isMobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* BACKDROP CLICK AWAY */}
            {(isProfileOpen || isQuickOpen || isNotifOpen) && (
                <div
                    className="fixed inset-0 z-[80]"
                    onClick={() => { setIsProfileOpen(false); setIsQuickOpen(false); setIsNotifOpen(false); }}
                />
            )}

            {/* MAIN CONTENT */}
            <main className="pt-24 min-h-screen">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* LOGOUT MODAL (DARK THEME) */}
            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowLogoutModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-[#1E1E1E] border border-gray-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <LogOut size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Keluar Portal?</h3>
                            <p className="text-gray-400 text-sm mb-8">Sesi Anda akan berakhir dan harus login kembali untuk akses data medis.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 rounded-xl bg-[#2A2A2A] font-bold hover:bg-[#333] transition-all">Batal</button>
                                <button className="flex-1 py-3 rounded-xl bg-red-600 font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">Ya, Keluar</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}