'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Minimize2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
    role: 'user' | 'bot';
    text: string;
}

const QUICK_PROMPTS = [
    'Wisata budaya dekat Balige?',
    'Itinerary 2 hari dari Parapat',
    'Apa itu Sigale-gale?',
    'Kuliner khas Danau Toba',
];

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: 'Horas! 👋 Saya CulTour AI. Mau wisata ke mana di Danau Toba?' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        const userMsg: Message = { role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat', { message: text });
            setMessages(prev => [...prev, { role: 'bot', text: res.reply || 'Maaf, coba lagi ya.' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'bot', text: 'Koneksi bermasalah. Coba lagi.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ── Chat panel ──────────────────────────────────────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.94 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                        className="fixed bottom-24 right-5 z-[150] w-[340px] sm:w-[380px]
              bg-[#0d0d0d]/98 backdrop-blur-xl rounded-2xl border border-white/10
              shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
                        style={{ maxHeight: '520px' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-gradient-to-r from-[#1D9E75]/30 to-[#085041]/20 flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1D9E75] to-[#085041] flex items-center justify-center flex-shrink-0">
                                    <Sparkles size={15} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-white leading-tight">CulTour AI</p>
                                    <p className="text-[10px] text-[#5DCAA5]">Asisten wisata Danau Toba</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <Minimize2 size={14} />
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <X size={14} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-0">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[82%] px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed
                      ${m.role === 'user'
                                                ? 'bg-[#1D9E75]/80 text-white rounded-br-sm'
                                                : 'bg-white/8 text-white/85 border border-white/8 rounded-bl-sm'}`}
                                    >
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/8 border border-white/8 px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                                        {[0, 1, 2].map(i => (
                                            <motion.div
                                                key={i}
                                                className="w-1.5 h-1.5 bg-[#5DCAA5] rounded-full"
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Quick prompts */}
                        {messages.length <= 1 && (
                            <div className="px-3 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
                                {QUICK_PROMPTS.map(q => (
                                    <button
                                        key={q}
                                        onClick={() => sendMessage(q)}
                                        className="text-[11px] px-2.5 py-1 rounded-full border border-[#1D9E75]/40 text-[#5DCAA5] hover:bg-[#1D9E75]/15 transition-all"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-3 pb-3 flex-shrink-0">
                            <div className="flex gap-2 bg-white/6 border border-white/10 rounded-xl px-3 py-2">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                                    placeholder="Tanya sesuatu tentang Danau Toba..."
                                    className="flex-1 bg-transparent text-[13px] text-white placeholder-white/25 outline-none"
                                />
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => sendMessage(input)}
                                    disabled={!input.trim() || loading}
                                    className="text-[#5DCAA5] hover:text-[#1D9E75] disabled:opacity-30 transition-all flex-shrink-0"
                                >
                                    <Send size={16} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── FAB button ──────────────────────────────────────────────────── */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(p => !p)}
                className="fixed bottom-5 right-5 z-[150] w-14 h-14 rounded-2xl
          bg-gradient-to-br from-[#1D9E75] to-[#085041]
          flex items-center justify-center
          shadow-lg shadow-[#1D9E75]/30"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                            <X size={22} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div key="spark" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                            <Sparkles size={22} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pulse ring */}
                <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-[#1D9E75]"
                    animate={{ scale: [1, 1.3, 1.3], opacity: [0.6, 0, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
            </motion.button>
        </>
    );
}