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
    LayoutDashboard, CalendarCheck, FileText,
    Stethoscope, Users, ClipboardList, Sparkles, Target, HeartPulse
} from 'lucide-react';
import api from '@/services/api';

// ── Tipe Notifikasi ──────────────────────────────────────────────────────────
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
    const [user, setUser] = useState({ name: '', email: '' });
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [isQuickOpen, setIsQuickOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notifRef = useRef<HTMLDivElement>(null);
    const seenNotifIds = useRef<Set<string>>(new Set());

    // 1. PROTEKSI ROLE PASIEN
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        if (!token || role?.toLowerCase() !== 'patient') {
            router.push('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser({ name: res.data.full_name, email: res.data.email });
                setIsAuthorized(true);
                localStorage.setItem('user_name', res.data.full_name);
                localStorage.setItem('user_email', res.data.email);
            } catch (err) {
                console.error("Gagal mengambil data user:", err);
                router.push('/login');
            }
        };

        fetchUserData();
    }, [router, pathname]);

    const getInitials = (name: string) =>
        name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

    // 2. SCROLL EFFECT
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. LIVE NOTIF — cek setiap 10 detik
    const checkLiveStatus = async () => {
        try {
            const res = await api.get('/clinic/appointments/me');
            const appointments: any[] = res.data;
            if (!appointments?.length) return;

            const newNotifs: Notification[] = [];

            appointments.forEach((appt: any) => {
                const key = `${appt.id}-${appt.status}`;
                if (seenNotifIds.current.has(key)) return;

                const config: Record<string, { title: string; desc: string; color: string }> = {
                    confirmed: {
                        title: '✅ Reservasi Dikonfirmasi',
                        desc: `Janji dengan ${appt.doctor_name} telah dikonfirmasi.`,
                        color: 'bg-emerald-500',
                    },
                    scheduled: {
                        title: '🔔 GILIRAN ANDA!',
                        desc: `Silakan masuk ke ruangan ${appt.doctor_name} sekarang.`,
                        color: 'bg-blue-500 animate-pulse',
                    },
                    completed: {
                        title: '🩺 Pemeriksaan Selesai',
                        desc: `Rekam medis dari ${appt.doctor_name} telah tersedia.`,
                        color: 'bg-teal-500',
                    },
                    cancelled: {
                        title: '❌ Reservasi Dibatalkan',
                        desc: `Janji dengan ${appt.doctor_name} telah dibatalkan.`,
                        color: 'bg-red-500',
                    },
                };

                const cfg = config[appt.status];
                if (!cfg) return;

                newNotifs.push({
                    id: appt.id,
                    title: cfg.title,
                    desc: cfg.desc,
                    color: cfg.color,
                    time: new Date(appt.appointment_date).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    }),
                });
            });

            if (newNotifs.length > 0) {
                setNotifications(prev => [...newNotifs, ...prev].slice(0, 10));
                setUnreadCount(prev => prev + newNotifs.length);
                newNotifs.forEach(n => {
                    seenNotifIds.current.add(`${n.id}-${appointments.find(a => a.id === n.id)?.status}`);
                });
            }
        } catch { /* silent */ }
    };

    useEffect(() => {
        checkLiveStatus();
        const timer = setInterval(checkLiveStatus, 10000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => setShowLogoutModal(true);
    const executeLogout = () => {
        setShowLogoutModal(false);
        localStorage.clear();
        Cookies.remove('token', { path: '/' });
        Cookies.remove('role', { path: '/' });
        Cookies.remove('user_role', { path: '/' });
        document.cookie.split(';').forEach(c => {
            document.cookie = c
                .replace(/^ +/, '')
                .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        router.push('/login');
    };

    const navItems = [
        { name: 'Beranda', href: '/patient/dashboard', icon: Home },
        { name: 'Layanan', href: '/patient/services', icon: Stethoscope },
        { name: 'Nauli Dental', href: '/patient/about', icon: Building2 },
        { name: 'Tim Kami', href: '/patient/doctors', icon: UsersRound },
        { name: 'Visi & Misi', href: '/patient/visiMisi', icon: Target },
        { name: 'Nauli Co', href: '/patient/nauli-co/about', icon: Sparkles },
    ];

    if (!isAuthorized) return null;

    const isNauliCoArea = pathname.includes('/nauli-co');
    if (isNauliCoArea) return <>{children}</>;

    const isHeroPage = [
        '/patient/dashboard', '/patient/about', '/patient/appointments',
        '/patient/records', '/patient/services', '/patient/visiMisi',
        '/patient/doctors',
    ].some(p => pathname.startsWith(p));

    const closeAll = () => {
        setIsProfileOpen(false);
        setIsQuickOpen(false);
        setIsNotifOpen(false);
    };

    return (
        <div className="min-h-screen font-sans overflow-x-clip bg-slate-50">

            {/* ══════════════════════════════════════════════════════════════
                NAVBAR — tampilan putih seperti referensi
            ══════════════════════════════════════════════════════════════ */}
            <motion.nav
                initial={{ y: -72, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, type: 'spring', stiffness: 140, damping: 22 }}
                className={`fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-100
                    transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
            >
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">

                    {/* ── Brand ───────────────────────────────────────────── */}
                    <Link href="/patient/dashboard" className="flex items-center gap-2.5 shrink-0 group">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-slate-100 shadow-sm flex-shrink-0">
                            {!logoError ? (
                                <Image
                                    src="/images/Logo.png"
                                    alt="Nauli Dental Logo"
                                    width={40} height={40}
                                    className="object-cover w-full h-full"
                                    onError={() => setLogoError(true)}
                                />
                            ) : (
                                <div className="w-full h-full bg-emerald-600 flex items-center justify-center">
                                    <span className="text-white font-black text-xl">N</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-[15px] font-black tracking-tight text-slate-800">
                                Nauli<span className="text-emerald-600">Dental</span>
                            </span>
                            <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400">
                                Patient Portal
                            </span>
                        </div>
                    </Link>

                    {/* ── Nav Items Desktop ────────────────────────────────── */}
                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <div className="flex items-center gap-0.5">
                            {navItems.map(item => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href);
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <motion.div
                                            whileTap={{ scale: 0.97 }}
                                            className={`relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold
                                                rounded-md transition-colors duration-150 cursor-pointer select-none
                                                ${isActive
                                                    ? 'text-emerald-700'
                                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                                }`}
                                        >
                                            <item.icon size={14} className="flex-shrink-0" />
                                            <span>{item.name}</span>
                                            {/* Active underline — persis seperti referensi */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNavPatient"
                                                    className="absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full bg-emerald-600"
                                                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                                />
                                            )}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Action Kanan ─────────────────────────────────────── */}
                    <div className="flex items-center gap-1 shrink-0">

                        {/* ── Quick Access: Janji & Rekam Medis ──────────── */}
                        <div className="relative">
                            <motion.button
                                whileTap={{ scale: 0.93 }}
                                onClick={() => { setIsQuickOpen(p => !p); setIsProfileOpen(false); setIsNotifOpen(false); }}
                                aria-label="Aktivitas Saya"
                                className={`relative p-2 rounded-lg transition-colors duration-150
                                    ${isQuickOpen
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <ClipboardList size={18} />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            </motion.button>

                            <AnimatePresence>
                                {isQuickOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                        transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl
                                            shadow-xl border border-slate-200 overflow-hidden z-[110]"
                                    >
                                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                Aktivitas Saya
                                            </p>
                                        </div>
                                        <div className="p-1.5 space-y-0.5">
                                            {[
                                                { href: '/patient/appointments', icon: CalendarCheck, label: 'Janji Temu', sub: 'Kelola reservasi Anda' },
                                                { href: '/patient/records', icon: FileText, label: 'Rekam Medis', sub: 'Riwayat perawatan Anda' },
                                            ].map(item => (
                                                <Link key={item.href} href={item.href} onClick={() => setIsQuickOpen(false)}>
                                                    <button className="w-full px-3 py-2.5 text-left hover:bg-slate-50 rounded-lg
                                                        flex items-center gap-3 transition-colors group cursor-pointer">
                                                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center
                                                            flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                                                            <item.icon size={15} className="text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-bold text-slate-700 leading-tight">{item.label}</p>
                                                            <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                                                        </div>
                                                    </button>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Bell ────────────────────────────────────────── */}
                        <div className="relative" ref={notifRef}>
                            <motion.button
                                whileTap={{ scale: 0.93 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsNotifOpen(prev => !prev);
                                    setIsProfileOpen(false);
                                    setIsQuickOpen(false);
                                }}
                                aria-label="Pemberitahuan"
                                className={`relative p-2 rounded-lg transition-colors duration-150
                                    ${isNotifOpen
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                        transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl
                                            shadow-xl border border-slate-200 overflow-hidden z-[110]"
                                    >
                                        {/* Header */}
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                            <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
                                                Pemberitahuan
                                            </h4>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                                                    {unreadCount} Baru
                                                </span>
                                            )}
                                        </div>

                                        {/* List */}
                                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                                            {notifications.length === 0 ? (
                                                <div className="py-10 text-center space-y-2">
                                                    <Bell size={22} className="mx-auto text-slate-200" />
                                                    <p className="text-[11px] text-slate-400 uppercase font-bold tracking-tight">
                                                        Belum ada aktivitas baru
                                                    </p>
                                                </div>
                                            ) : notifications.map(n => (
                                                <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-default group">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.color || 'bg-emerald-500'}`} />
                                                        <p className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                                                            {n.title}
                                                        </p>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 leading-relaxed pl-3.5">{n.desc}</p>
                                                    {n.time && (
                                                        <p className="text-[10px] text-emerald-500 mt-1.5 font-semibold pl-3.5">{n.time}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
                                            <button
                                                onClick={() => {
                                                    setNotifications([]);
                                                    setUnreadCount(0);
                                                    seenNotifIds.current.clear();
                                                }}
                                                className="w-full text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors py-0.5"
                                            >
                                                Tandai semua sudah dibaca
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Profile Button ───────────────────────────────── */}
                        <div className="relative">
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { setIsProfileOpen(p => !p); setIsNotifOpen(false); setIsQuickOpen(false); }}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors duration-150
                                    border ${isProfileOpen
                                        ? 'border-emerald-200 bg-emerald-50'
                                        : 'border-slate-200 bg-white hover:bg-slate-50'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center
                                        text-white font-bold text-[10px] ring-2 ring-emerald-100">
                                        {getInitials(user.name)}
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-[11px] font-bold text-slate-700 leading-tight">{user.name || 'Pasien'}</p>
                                    <p className="text-[9px] font-medium text-emerald-600">Patient Member</p>
                                </div>
                                <ChevronDown
                                    size={13}
                                    className={`text-slate-400 transition-transform duration-250 ${isProfileOpen ? 'rotate-180' : ''}`}
                                />
                            </motion.button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                        transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                                        className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl
                                            border border-slate-200 overflow-hidden z-[110]"
                                    >
                                        {/* Profile header */}
                                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-4 py-3 flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white">
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[13px] text-white leading-tight">{user.name}</p>
                                                <p className="text-[10px] text-emerald-100 mt-0.5">{user.email}</p>
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        <div className="px-2 py-2 space-y-0.5">
                                            <Link href="/patient/profile" onClick={() => setIsProfileOpen(false)}>
                                                <button className="w-full px-3 py-2 text-left text-[13px] font-medium text-slate-600
                                                    hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors">
                                                    <User size={14} className="text-emerald-500 flex-shrink-0" /> Profil Saya
                                                </button>
                                            </Link>
                                            <Link href="/register" onClick={() => setIsProfileOpen(false)}>
                                                <button className="w-full px-3 py-2 text-left text-[13px] font-medium text-emerald-600
                                                    hover:bg-emerald-50 rounded-lg flex items-center gap-2.5 transition-colors">
                                                    <UserPlus size={14} className="flex-shrink-0" /> Daftar Akun Baru
                                                </button>
                                            </Link>
                                            <div className="h-px bg-slate-100 mx-1 my-1" />
                                            <button
                                                onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                                className="w-full px-3 py-2 text-left text-[13px] font-semibold text-red-500
                                                    hover:bg-red-50 rounded-lg flex items-center gap-2.5 transition-colors"
                                            >
                                                <LogOut size={14} className="flex-shrink-0" /> Keluar Portal
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile hamburger */}
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setIsMobileMenuOpen(p => !p)}
                            aria-label="Menu"
                            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>
                    </div>
                </div>

                {/* ── Mobile Menu ──────────────────────────────────────────── */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-0.5">
                                {navItems.map((item, idx) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href);
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl
                                                    text-[13px] font-semibold transition-colors
                                                    ${isActive
                                                        ? 'bg-emerald-50 text-emerald-700 border-l-[3px] border-emerald-500'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <item.icon size={15} className={isActive ? 'text-emerald-500' : 'text-slate-400'} />
                                                    {item.name}
                                                </span>
                                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                <div className="pt-2 mt-1 border-t border-slate-100 space-y-0.5">
                                    {[
                                        { href: '/patient/profile', icon: User, label: 'Profil Saya', style: 'text-slate-600' },
                                        { href: '/patient/settings', icon: Settings, label: 'Pengaturan', style: 'text-slate-600' },
                                        { href: '/register', icon: UserPlus, label: 'Daftar Akun Baru', style: 'text-emerald-600' },
                                    ].map(item => (
                                        <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium
                                                hover:bg-slate-50 transition-colors ${item.style}`}>
                                                <item.icon size={15} className="text-slate-400 flex-shrink-0" /> {item.label}
                                            </div>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
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
            </motion.nav>

            {/* Backdrop — mencakup semua 3 dropdown */}
            {(isProfileOpen || isQuickOpen || isNotifOpen) && (
                <div className="fixed inset-0 z-[90]" onClick={closeAll} />
            )}

            {/* ── KONTEN ──────────────────────────────────────────────────── */}
            <main className={`${isHeroPage ? 'pt-0' : 'pt-[64px]'} transition-all duration-500`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── LOGOUT MODAL ────────────────────────────────────────────── */}
            <AnimatePresence>
                {showLogoutModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[200]"
                            onClick={() => setShowLogoutModal(false)}
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
                                        <p className="text-[13px] font-black text-white uppercase tracking-wide">Keluar Portal</p>
                                        <p className="text-[10px] text-emerald-100">Nauli Dental Patient Portal</p>
                                    </div>
                                </div>

                                {/* User info dinamis */}
                                <div className="px-5 py-5 space-y-4">
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center
                                            text-white font-black text-base shrink-0">
                                            {getInitials(user.name)}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-800">{user.name}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{user.email}</p>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-slate-500 leading-relaxed">
                                        Anda akan keluar dari{' '}
                                        <span className="text-emerald-600 font-bold">Portal Pasien</span>.
                                        Sesi Anda akan diakhiri dan diarahkan ke halaman login.
                                    </p>
                                </div>

                                <div className="px-5 pb-5 flex gap-3">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px]
                                            font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={executeLogout}
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
        </div>
    );
}