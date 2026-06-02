"use client";
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'bot', content: 'Horas! Ada yang bisa saya bantu?' }]);
    const [input, setInput] = useState("");

    const handleChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        try {
            const res = await fetch(`http://localhost:8000/api/v1/search?q=${encodeURIComponent(userMsg)}&limit=2`);
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'bot', content: `Berikut rekomendasi saya:`, results: data.results }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', content: 'Koneksi ke AI terputus.' }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Tombol Melayang */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#2D6A4F] p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
            >
                {isOpen ? <X /> : <MessageCircle />}
            </button>

            {/* Jendela Chat */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-[#1E1E1E] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="p-4 bg-[#2D6A4F] font-bold text-sm">CulTour AI Guide</div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                        {messages.map((m, i) => (
                            <div key={i} className={`${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-3 rounded-xl ${m.role === 'user' ? 'bg-[#2D6A4F]' : 'bg-[#2A2A2A]'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleChat} className="p-3 border-t border-gray-800 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-[#2A2A2A] rounded-lg p-2 text-xs outline-none"
                            placeholder="Tanya AI..."
                        />
                        <button className="text-green-500"><Send size={18} /></button>
                    </form>
                </div>
            )}
        </div>
    );
}