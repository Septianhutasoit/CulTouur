'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, RotateCcw, Map } from 'lucide-react';
import { chatService } from '@/services/destination';
import type { ChatMessage, Destination } from '@/types';
import DestinationCard from '@/components/DestinationCard';

const QUICK_PROMPTS = [
    'Rekomendasi wisata budaya 2 hari dari Balige',
    'Apa makna ritual Sigale-gale?',
    'Kuliner halal khas Danau Toba',
    'Itinerary hemat ke Samosir',
    'Tempat terbaik untuk melihat sunrise',
    'Ceritakan sejarah Batak Toba',
];

export default function AIGuidePage() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'bot',
            text: 'Horas! Saya CulTour AI - asisten wisata budaya Danau Toba.\n\nCeritakan preferensimu dan saya akan rekomendasikan destinasi, itinerary, atau info budaya yang paling cocok untukmu!',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [recs, setRecs] = useState<Destination[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async (text: string) => {
        if (!text.trim() || loading) return;
        setMessages(prev => [...prev, { role: 'user', text }]);
        setInput('');
        setLoading(true);
        setRecs([]);

        try {
            const history = messages.slice(-6);
            const res = await chatService.send({ message: text, history });
            setMessages(prev => [...prev, { role: 'bot', text: res.reply }]);
            if (res.recommendations?.length) setRecs(res.recommendations);
        } catch {
            setMessages(prev => [...prev, {
                role: 'bot',
                text: 'Maaf, terjadi kesalahan. Pastikan backend sudah berjalan di port 8000.',
            }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const reset = () => {
        setMessages([{ role: 'bot', text: 'Horas! Sesi baru dimulai. Ceritakan preferensimu!' }]);
        setRecs([]);
        setInput('');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-8">
            <div className="max-w-4xl mx-auto px-4 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D9E75] to-[#085041] flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-semibold text-lg leading-tight">CulTour AI Guide</h1>
                            <p className="text-[#5DCAA5] text-xs">Asisten wisata budaya Danau Toba</p>
                        </div>
                    </div>
                    <button
                        onClick={reset}
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/8"
                    >
                        <RotateCcw size={13} /> Reset sesi
                    </button>
                </div>

                {/* Quick prompts */}
                {messages.length <= 1 && (
                    <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                        {QUICK_PROMPTS.map(q => (
                            <button
                                key={q}
                                onClick={() => send(q)}
                                className="text-xs px-3 py-1.5 rounded-full border border-[#1D9E75]/40 text-[#5DCAA5] hover:bg-[#1D9E75]/15 transition-all"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* Chat area */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0 pb-4">
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {m.role === 'bot' && (
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1D9E75] to-[#085041] flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                                    <Sparkles size={13} className="text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                  ${m.role === 'user'
                                        ? 'bg-[#1D9E75]/80 text-white rounded-br-sm'
                                        : 'bg-white/6 text-white/85 border border-white/8 rounded-bl-sm'}`}
                            >
                                {m.text}
                            </div>
                        </motion.div>
                    ))}

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1D9E75] to-[#085041] flex items-center justify-center flex-shrink-0 mr-2">
                                <Sparkles size={13} className="text-white" />
                            </div>
                            <div className="bg-white/6 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
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

                    {/* Rekomendasi destinasi */}
                    <AnimatePresence>
                        {recs.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-2"
                            >
                                <p className="text-xs text-white/40 flex items-center gap-1.5 ml-9">
                                    <Map size={12} /> Rekomendasi destinasi
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-9">
                                    {recs.map(d => (
                                        <DestinationCard key={d.id} destination={d} compact />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="flex-shrink-0 pt-3 border-t border-white/8">
                    <div className="flex gap-3">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                            placeholder="Tanya tentang wisata, budaya, kuliner, atau itinerary Danau Toba..."
                            className="flex-1 bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#1D9E75]/50 transition-colors"
                        />
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => send(input)}
                            disabled={!input.trim() || loading}
                            className="w-12 h-12 rounded-xl bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-30 flex items-center justify-center transition-colors flex-shrink-0"
                        >
                            <Send size={17} className="text-white" />
                        </motion.button>
                    </div>
                    <p className="text-[11px] text-white/20 mt-2 text-center">
                        CulTour AI menggunakan RAG + multilingual-e5-small untuk rekomendasi personal
                    </p>
                </div>

            </div>
        </div>
    );
}