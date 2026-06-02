"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'bot', content: 'Horas! Ada yang bisa saya bantu?' }]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = input; setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        try {
            const res = await fetch(`http://localhost:8000/api/v1/search?q=${encodeURIComponent(userMsg)}&limit=2`);
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'bot', content: 'Rekomendasi AI:', results: data.results }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', content: 'Server AI Offline.' }]);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[999]">
            {/* Tombol Melayang */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#2D6A4F] p-4 rounded-full shadow-2xl hover:scale-110 transition-all text-white border border-green-400/20"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {/* Jendela Chat */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-[#1A1A1A] border border-gray-800 rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    <div className="p-5 bg-[#2D6A4F] font-bold text-sm flex justify-between items-center">
                        <span>CulTour AI Guide</span>
                        <span className="text-[10px] bg-green-900 px-2 py-1 rounded-full text-green-300">ONLINE</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-[#2D6A4F]' : 'bg-[#262626] border border-gray-800'}`}>
                                    {m.content}
                                    {m.results?.map((res: any, idx: number) => (
                                        <div key={idx} className="mt-2 bg-[#121212] p-2 rounded-xl text-[11px] border border-gray-700">
                                            <p className="text-green-500 font-bold uppercase">{res.destination.category}</p>
                                            <p className="font-bold">{res.destination.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 bg-[#262626] border-t border-gray-800 flex gap-2">
                        <input
                            value={input} onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-[#121212] border border-gray-700 rounded-xl p-3 text-xs outline-none focus:border-green-500"
                            placeholder="Tanyakan sesuatu..."
                        />
                        <button className="text-green-500 hover:scale-110 transition-transform"><Send size={20} /></button>
                    </form>
                </div>
            )}
        </div>
    );
}