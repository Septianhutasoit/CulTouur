"use client";
import { useState, useEffect, useRef } from 'react';

// Tipe data untuk pesan chat
type Message = {
  role: 'user' | 'bot';
  content: string;
  results?: any[];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Halo! Saya asisten CulTour AI. Ada yang bisa saya bantu untuk rencana perjalanan Anda di Danau Toba?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/search?q=${encodeURIComponent(userQuery)}&limit=3`);
      const data = await res.json();

      setMessages(prev => [...prev, {
        role: 'bot',
        content: `Berdasarkan pencarian AI saya, berikut rekomendasi terbaik untuk "${userQuery}":`,
        results: data.results
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Maaf, saya sedang kesulitan menghubungi server. Pastikan Backend sudah berjalan.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-800">
      {/* HEADER */}
      <header className="bg-green-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">CulTour <span className="font-light text-green-200">AI</span></h1>
        <div className="text-xs bg-green-700 px-3 py-1 rounded-full border border-green-600">
          ● AI Backend Online
        </div>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl w-full mx-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200'
              }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>

              {/* HASIL REKOMENDASI (CARDS) */}
              {msg.results && msg.results.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {msg.results.map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col hover:border-green-300 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-green-700">{item.destination.category}</span>
                        <span className="text-[10px] font-mono text-gray-400">{(item.similarity_score * 100).toFixed(0)}% Match</span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900">{item.destination.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 my-1">{item.destination.description}</p>
                      <div className="flex justify-between items-center mt-2 text-[10px] text-gray-400 font-medium">
                        <span>📍 {item.destination.location}</span>
                        <span className="text-amber-500">⭐ {item.destination.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border p-4 rounded-2xl shadow-sm italic text-gray-400 text-xs animate-pulse">
              AI sedang berpikir...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            className="w-full p-4 pr-16 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm transition-all"
            placeholder="Tanyakan sesuatu... (Contoh: Apa makanan khas Samosir?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-green-700 text-white px-4 rounded-lg font-bold text-xs hover:bg-green-800 active:scale-95 transition-all"
          >
            KIRIM
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          CulTour AI menggunakan Semantic Search untuk memberikan rekomendasi wisata budaya terbaik.
        </p>
      </footer>
    </div>
  );
}