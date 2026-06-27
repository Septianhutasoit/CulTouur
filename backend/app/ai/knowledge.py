"""
Kamus penjelasan budaya untuk setiap label yang dihasilkan oleh Vistara Lens
(app/ai/vision.py). Key di sini HARUS sama persis dengan nama folder
di database/dataset/vision_samples/, karena label diambil dari nama folder.

Cara menambah kategori baru:
1. Buat folder baru di database/dataset/vision_samples/<nama_kategori>/
2. Isi 5-15 foto contoh di folder itu
3. Tambahkan entry baru di KNOWLEDGE_BASE dengan key yang SAMA PERSIS
   dengan nama folder tersebut.

Kalau sebuah label terdeteksi tapi tidak ada di KNOWLEDGE_BASE, sistem akan
tetap menampilkan label dan confidence-nya, hanya tanpa penjelasan filosofi
(lihat fallback di get_knowledge() di bawah).
"""

KNOWLEDGE_BASE = {
    "ulos_ragihotang": (
        "Ulos Ragi Hotang melambangkan kasih sayang dan persatuan. "
        "Biasanya diberikan oleh orang tua kepada sepasang pengantin agar "
        "ikatan pernikahan mereka kuat bagaikan rotan (hotang)."
    ),
    "ulos_ragihidup": (
        "Ulos Ragi Hidup dianggap sebagai ulos dengan motif paling rumit dan "
        "bernilai tinggi dalam adat Batak, sering dipakai dalam upacara adat besar "
        "sebagai simbol kehidupan dan kemakmuran."
    ),
    "ulos_sibolang": (
        "Ulos Sibolang umumnya dipakai dalam konteks dukacita atau perkabungan, "
        "namun juga dapat dipakai dalam upacara adat lain sesuai konteksnya."
    ),
    "ulos_mangiring": (
        "Ulos Mangiring memiliki motif garis yang saling beriringan, melambangkan "
        "kebersamaan dan harapan agar keturunan datang beriringan (mangiring)."
    ),
    "rumah_bolon": (
        "Rumah Bolon adalah rumah adat suku Batak yang berbentuk panggung. "
        "Atapnya yang melengkung melambangkan tanduk kerbau, simbol kekuatan dan "
        "kemakmuran bagi penghuninya."
    ),
    "patung_sigalegale": (
        "Sigale-gale adalah patung kayu yang digerakkan dengan tali dalam upacara "
        "adat Batak Toba, awalnya dikaitkan dengan ritual penghormatan kepada "
        "leluhur dan kini menjadi atraksi budaya di Pulau Samosir."
    ),
}


def get_knowledge(label_key: str) -> str | None:
    """
    Ambil penjelasan filosofi untuk sebuah label.
    Mengembalikan None kalau label belum terdaftar di KNOWLEDGE_BASE,
    supaya pemanggil bisa menampilkan fallback yang sesuai.
    """
    return KNOWLEDGE_BASE.get(label_key)