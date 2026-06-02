// src/app/admin/page.tsx
export default function AdminDashboard() {
    const stats = [
        { label: 'Destinasi', val: '48' },
        { label: 'User Aktif', val: '312' },
        { label: 'Chat AI', val: '1.2k' },
        { label: 'Trip Dibuat', val: '87' },
    ];

    return (
        <div className="flex gap-6 h-[80vh]">
            {/* Sidebar Admin */}
            <aside className="w-64 bg-[#1E1E1E] rounded-3xl p-6 space-y-4">
                <div className="text-green-500 font-bold mb-8">Admin Panel</div>
                {['Dashboard', 'Destinasi', 'Budaya', 'Event', 'Analitik'].map(item => (
                    <div key={item} className="p-3 hover:bg-[#2D6A4F] rounded-xl cursor-pointer transition-all">{item}</div>
                ))}
            </aside>

            {/* Content */}
            <main className="flex-1 space-y-6">
                <div className="grid grid-cols-4 gap-4">
                    {stats.map(s => (
                        <div key={s.label} className="bg-[#1E1E1E] p-6 rounded-2xl text-center border border-gray-800">
                            <div className="text-2xl font-bold">{s.val}</div>
                            <div className="text-xs text-gray-500">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-gray-800">
                    <h3 className="mb-4 font-bold">Destinasi Terbaru</h3>
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 border-b border-gray-800">
                            <tr><th className="pb-3">Nama</th><th>Kategori</th><th>Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            <tr><td className="py-4 font-medium">Huta Siallagan</td><td><span className="bg-green-900 px-2 py-1 rounded text-[10px]">Budaya</span></td><td className="text-green-500">Aktif</td></tr>
                            <tr><td className="py-4 font-medium">Sipiso-piso</td><td><span className="bg-blue-900 px-2 py-1 rounded text-[10px]">Alam</span></td><td className="text-green-500">Aktif</td></tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}