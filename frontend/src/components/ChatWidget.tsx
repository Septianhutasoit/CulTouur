"use client";
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Horas! Saya CulTour AI. Ada yang bisa saya bantu tentang wisata Danau Toba? 🌊" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/v1/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.content }),
            });

            if (!res.ok) throw new Error("Backend error");
            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.response || data.message || "Maaf, saya tidak mengerti." }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Maaf, koneksi ke server terputus. Silakan coba lagi nanti. 🙏" },
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
                        className="fixed bottom-24 right-5 z-[200] w-[340px] sm:w-[380px] rounded-2xl border border-white/10 bg-[#0e1210] shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
                        style={{ maxHeight: "520px" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-[#111814]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-black tracking-tight text-white">CulTour AI Guide</p>
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <X size={15} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                                ? "bg-emerald-600 text-white rounded-br-sm"
                                                : "bg-white/5 border border-white/8 text-gray-200 rounded-bl-sm"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm">
                                        <Loader2 size={14} className="text-emerald-400 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-white/8 bg-[#111814]">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Tanyakan sesuatu..."
                                    className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-emerald-500/40 transition-colors"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shrink-0"
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
                className="fixed bottom-5 right-5 z-[200] w-14 h-14 bg-emerald-600 hover:bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-900/50 transition-colors"
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