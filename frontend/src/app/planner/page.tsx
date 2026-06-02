// src/app/planner/page.tsx
"use client";
import { useState } from 'react';
import { Calendar, MapPin, Wallet, Sparkles } from 'lucide-react';

export default function TripPlanner() {
    return (
        <div className="space-y-8">
            <section className="bg-[#1E1E1E] p-8 rounded-3xl border border-gray-800">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="text-green-500" /> AI Trip Planner
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block text-sm text-gray-400">Lokasi Awal</label>
                        <select className="w-full bg-[#2A2A2A] p-3 rounded-xl border border-gray-700">
                            <option>Balige</option>
                            <option>Medan</option>
                            <option>Parapat</option>
                        </select>

                        <label className="block text-sm text-gray-400">Durasi Trip</label>
                        <div className="flex gap-2">
                            {['1 Hari', '2 Hari', '3 Hari'].map(day => (
                                <button key={day} className="flex-1 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 hover:border-green-500">{day}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm text-gray-400">Budget per Orang</label>
                        <input type="range" className="w-full accent-green-500" />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Rp100k</span><span>Rp1jt</span>
                        </div>

                        <button className="w-full py-4 bg-green-700 rounded-xl font-bold mt-4 hover:bg-green-600">
                            Generate Itinerary dengan AI
                        </button>
                    </div>
                </div>
            </section>

            {/* Hasil Itinerary */}
            <section className="space-y-4">
                <h3 className="font-bold">Itinerary — 2 Hari dari Balige</h3>
                <div className="border-l-2 border-green-700 ml-4 pl-8 space-y-8">
                    <div className="relative">
                        <div className="absolute -left-11 top-0 w-6 h-6 bg-green-700 rounded-full flex items-center justify-center text-[10px]">1</div>
                        <h4 className="font-bold text-green-500">Hari 1 — Budaya & Kuliner</h4>
                        <div className="mt-2 bg-[#1E1E1E] p-4 rounded-xl space-y-3">
                            <div className="flex justify-between text-sm"><span>08.00 - Museum TB Silalahi</span><span className="text-gray-500">Rp20k</span></div>
                            <div className="flex justify-between text-sm"><span>12.00 - Makan Siang Arsik</span><span className="text-gray-500">Rp35k</span></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}