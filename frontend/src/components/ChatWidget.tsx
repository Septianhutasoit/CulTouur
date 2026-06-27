"use client";
import Link from "next/link";
import { Sparkles, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
    // Dipakai khusus untuk hasil identifikasi gambar (Vistara Lens)
    image?: {
        previewUrl: string;
    };
}

// ── Base URL backend — pakai env var di production, fallback localhost saat dev ──
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Horas! Saya Vistara AI. Ada yang bisa saya bantu tentang wisata Danau Toba? Anda juga bisa kirim foto kain Ulos atau bangunan adat lewat ikon kamera. 🌊",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Auto-focus input setiap kali widget dibuka ──
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    // ── Tutup widget dengan tombol Escape ──
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/v1/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.content }),
            });

            if (!res.ok) throw new Error("Backend error");
            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response || data.message || "Maaf, saya tidak mengerti.",
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Maaf, koneksi ke server terputus. Pastikan backend /api/v1/chat sudah berjalan. 🙏",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Vistara Lens: kirim foto ke /vision/identify ──
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // reset input agar bisa pilih file yang sama lagi nanti
        if (!file || isLoading) return;

        // Validasi dasar di sisi client sebelum kirim ke server
        if (!file.type.startsWith("image/")) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "File yang dikirim bukan gambar. Coba unggah foto (.jpg/.png)." },
            ]);
            return;
        }
        const MAX_SIZE_MB = 8;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: `Ukuran foto terlalu besar (maks ${MAX_SIZE_MB}MB). Coba kompres dulu.` },
            ]);
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setMessages((prev) => [
            ...prev,
            { role: "user", content: "📷 Mengirim foto untuk diidentifikasi...", image: { previewUrl } },
        ]);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${API_URL}/api/v1/vision/identify`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Vision endpoint error");
            const data = await res.json();

            if (data?.data?.error || data?.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            data?.data?.error === "AI belum mempelajari foto contoh (dataset kosong)."
                                ? "Vistara Lens belum punya data foto contoh untuk dibandingkan. Fitur ini masih dalam tahap pengumpulan dataset."
                                : "Maaf, saya belum bisa mengidentifikasi foto ini.",
                    },
                ]);
                return;
            }

            const label: string | undefined = data?.data?.label;
            const confidence: number | undefined = data?.data?.confidence;

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: label
                        ? `Saya rasa ini adalah **${label}** (keyakinan ${Math.round((confidence ?? 0) * 100)}%). Mau saya jelaskan lebih lanjut tentang ini?`
                        : "Maaf, saya belum bisa mengenali objek pada foto ini dengan yakin.",
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Maaf, gagal menghubungi Vistara Lens. Pastikan backend /api/v1/vision sudah berjalan. 🙏",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 16 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        role="dialog"
                        aria-label="Vistara AI Guide"
                        className="fixed bottom-24 right-5 z-[200] w-[340px] sm:w-[380px] rounded-2xl border border-white/10 bg-[#0e1210] shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
                        style={{ maxHeight: "520px" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-[#111814]">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 bg-[#1D9E75] rounded-xl flex items-center justify-center shadow-lg shadow-[#1D9E75]/30 shrink-0">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-black tracking-tight text-white truncate">Vistara AI Guide</p>
                                    <p className="text-[10px] text-[#5DCAA5] font-bold uppercase tracking-widest">Online</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                {/* ── Buka penuh: arahkan ke halaman /ai untuk versi full-screen ── */}
                                <Link
                                    href="/ai"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Buka mode layar penuh"
                                    className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold
                                        text-[#5DCAA5] hover:text-[#1D9E75] hover:bg-white/5 transition-colors"
                                >
                                    <Sparkles size={11} />
                                    Buka penuh ↗
                                </Link>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Tutup chat"
                                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                >
                                    <X size={15} className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                                ? "bg-[#1D9E75] text-white rounded-br-sm"
                                                : "bg-white/5 border border-white/8 text-gray-200 rounded-bl-sm"
                                            }`}
                                    >
                                        {msg.image?.previewUrl && (
                                            <img
                                                src={msg.image.previewUrl}
                                                alt="Foto yang dikirim untuk identifikasi Vistara Lens"
                                                className="rounded-xl mb-2 max-h-40 object-cover w-full"
                                            />
                                        )}
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm">
                                        <Loader2 size={14} className="text-[#5DCAA5] animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-white/8 bg-[#111814]">
                            <div className="flex items-center gap-2">
                                {/* Input file tersembunyi untuk Vistara Lens */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    aria-hidden="true"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    aria-label="Kirim foto untuk diidentifikasi Vistara Lens"
                                    title="Vistara Lens: kirim foto budaya untuk diidentifikasi"
                                    className="w-9 h-9 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shrink-0 text-[#5DCAA5]"
                                >
                                    <Camera size={16} />
                                </button>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Tanyakan sesuatu..."
                                    disabled={isLoading}
                                    aria-label="Tulis pesan"
                                    className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-[#1D9E75]/40 transition-colors disabled:opacity-50"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    aria-label="Kirim pesan"
                                    className="w-9 h-9 bg-[#1D9E75] hover:bg-[#5DCAA5] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shrink-0"
                                >
                                    <Send size={14} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen((prev) => !prev)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isOpen ? "Tutup chat AI Guide" : "Buka chat AI Guide"}
                className="fixed bottom-5 right-5 z-[200] w-14 h-14 bg-[#1D9E75] hover:bg-[#5DCAA5] rounded-2xl flex items-center justify-center shadow-xl shadow-[#1D9E75]/40 transition-colors"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <X size={22} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <MessageCircle size={22} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </>
    );
}