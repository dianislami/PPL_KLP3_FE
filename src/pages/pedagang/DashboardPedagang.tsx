import { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { panenAPI } from '../../services/api';

interface Produk {
  id: string;
  nama: string;
  petani: string;
  jumlah: number;
  harga: number;
  kualitas: string;
  lokasi: string;
  status: string;
  tersedia: boolean;
  foto: { path: string }[];
  recovery?: { jenis?: "pakan" | "kompos" };
}

const kualitasColor: Record<string, string> = {
  A: "bg-green-100 text-green-700",
  "Grade A": "bg-green-100 text-green-700",
  B: "bg-yellow-100 text-yellow-700",
  "Grade B": "bg-yellow-100 text-yellow-700",
  C: "bg-red-100 text-red-700",
  "Grade C": "bg-red-100 text-red-700",
  Premium: "bg-purple-100 text-purple-700",
};

type FilterKategori = 'Semua' | 'Tersedia' | 'Habis';
type ViewMode = 'grid' | 'list';

export default function DashboardPedagang() {
  const navigate = useNavigate();
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState<FilterKategori>('Semua');
  const [viewMode, setViewMode]   = useState<ViewMode>('grid');
  const [dataPanen, setDataPanen] = useState<Produk[]>([]);

  useEffect(() => {
    fetchPanen();
  }, []);

const fetchPanen = async () => {
  try {
    const response = await panenAPI.getAll();
    const data = response.data || [];
    setDataPanen(
      data.map((item: any) => ({
        id: item._id,
        nama: item.nama_komoditas,
        petani: item.user_id?.nama || "Petani",
        jumlah: item.jumlah,
        harga: item.harga || 0,
        kualitas: item.kualitas || "A",
        // AMBIL LOKASI DARI BACKEND 
        lokasi: item.lokasi || "Banda Aceh",
        status: item.status,
        tersedia: item.status !== "Terjual" && item.jumlah > 0,
        foto: item.foto || [],
        // AMBIL DATA RECOVERY
        recovery: item.recovery,
      })),
    );
  } catch (error) {
    console.error("Error fetching panen:", error);
  }
};

    const filtered = dataPanen.filter((p) => {
      const matchSearch =
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.petani.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "Semua"
          ? true
          : filter === "Tersedia"
            ? p.tersedia
            : !p.tersedia;
      return matchSearch && matchFilter;
    });

    const totalTersedia = dataPanen.filter((p) => p.tersedia).length;
    const totalNilai = dataPanen
      .filter((p) => p.tersedia)
      .reduce((s, p) => s + p.jumlah * p.harga, 0);

    const getImageUrl = (foto?: { path: string }[]): string => {
      if (foto && foto.length > 0 && foto[0].path) {
        return `http://localhost:5000${foto[0].path}`;
      }
      return "https://images.pexels.com/photos/2468876/pexels-photo-2468876.jpeg?auto=compress&cs=tinysrgb&w=1200";
    };

    return (
      <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
        {/* Header - KEMBALI KE LAYOUT ASLI ANDA */}
        <div className="px-6 py-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold leading-tight">
                Hallo, Seller
              </h1>
              <p className="text-sm opacity-80 mt-1">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-2xl shadow-md">
              🏪
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk atau petani..."
              className="w-full pl-11 pr-4 py-3 bg-white/25 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
          <div className="text-center">
            <p className="text-[10px] text-gray-400">Produk Tersedia</p>
            <p className="text-xs font-bold text-gray-800">
              {totalTersedia} Produk
            </p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-[10px] text-gray-400">Total Nilai</p>
            <p className="text-xs font-bold text-gray-800">
              Rp {(totalNilai / 1000000).toFixed(0)}Jt
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400">Pasar</p>
            <p className="text-xs font-bold text-[#7a8c2e]">Stabil ↗</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-5 overflow-y-auto pb-28">
          {/* Shortcut Menu */}
          <div className="grid grid-cols-4 gap-3 px-4 mb-6">
            {[
              { label: "Pesanan", emoji: "📦", route: "/pesanan-pedagang" },
              { label: "Riwayat", emoji: "🧾", route: "/riwayat-pedagang" },
              { label: "Chat", emoji: "💬", route: "/chat/petani" },
              { label: "Profil", emoji: "👤", route: "/profil-pedagang" },
            ].map((m) => (
              <button
                key={m.label}
                onClick={() => navigate(m.route)}
                className="flex flex-col items-center gap-1.5 bg-[#f5f7ee] border border-[#dde8b8] rounded-2xl py-3 active:scale-95 transition-all"
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[11px] font-semibold text-[#5a6e1a]">
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between px-4 mb-3">
            <p className="text-base font-bold text-gray-800">Produk Tersedia</p>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${
                  viewMode === "grid"
                    ? "bg-[#7a8c2e] text-white shadow-sm"
                    : "text-gray-400"
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${
                  viewMode === "list"
                    ? "bg-[#7a8c2e] text-white shadow-sm"
                    : "text-gray-400"
                }`}
              >
                ☰
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 px-4 mb-4 overflow-x-auto scrollbar-hide">
            {(["Semua", "Tersedia", "Habis"] as FilterKategori[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-semibold border transition-all ${
                  filter === f
                    ? "bg-[#3a4e10] text-white border-[#3a4e10]"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-14 gap-2">
              <span className="text-5xl">🔍</span>
              <p className="text-gray-400 text-sm">Produk tidak ditemukan</p>
            </div>
          )}

          {/* ── GRID VIEW ── */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 gap-3 px-4">
              {filtered.map((p) => {
                // 1. Logika Tag Recovery
                const isRecovery =
                  p.recovery?.jenis &&
                  (p.kualitas?.toLowerCase().includes("c") ||
                    p.kualitas?.toLowerCase().includes("rusak"));

                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/detail-produk/${p.id}`)}
                    className="relative rounded-[25px] overflow-hidden h-52 cursor-pointer active:scale-95 transition-all shadow-sm border border-gray-100 group text-left"
                  >
                    {/* Background Image */}
                    <div className="w-full h-full relative">
                      <img
                        src={getImageUrl(p.foto)}
                        alt={p.nama}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Stok Habis Overlay */}
                    {!p.tersedia && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white bg-red-600 px-3 py-1 rounded-full uppercase">
                          Stok Habis
                        </span>
                      </div>
                    )}

                    {/* UI TAG RECOVERY*/}
                    {isRecovery && (
                      <div className="absolute top-2 left-2 z-10 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                        <span className="text-[8px] font-bold text-white uppercase italic flex items-center gap-1">
                          {p.recovery?.jenis === "pakan"
                            ? "🐄 Pakan"
                            : "♻️ Kompos"}
                        </span>
                      </div>
                    )}

                    {/* Harga Badge */}
                    <div className="absolute top-2 right-2 bg-[#7a8c2e] text-white px-2 py-1 rounded-lg shadow-sm">
                      <p className="text-[9px] font-bold">
                        Rp {p.harga.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Info Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs font-bold truncate mb-0.5">
                        {p.nama}
                      </p>
                      <div className="flex justify-between items-center mt-1 border-t border-white/10 pt-1">
                        <p
                          className={`text-[9px] font-bold px-1.5 rounded-sm ${kualitasColor[p.kualitas] || "bg-white/20"}`}
                        >
                          Grade {p.kualitas}
                        </p>
                        <p className="text-[10px] font-black">
                          {p.jumlah.toLocaleString()} Kg
                        </p>
                      </div>
                      <p className="text-[8px] opacity-60 mt-1 truncate">
                        👨‍🌾 {p.petani}
                      </p>
                    </div>
                  </button>
                );
              })}{" "}
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {viewMode === "list" && (
            <div className="flex flex-col gap-3 px-4">
              {filtered.map((p) => {
                // 1. TAMBAHKAN LOGIKA RECOVERY DI SINI
                const isRecovery =
                  p.recovery?.jenis &&
                  (p.kualitas?.toLowerCase().includes("c") ||
                    p.kualitas?.toLowerCase().includes("rusak"));

                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/detail-produk/${p.id}`)}
                    className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 shadow-sm cursor-pointer active:scale-95 transition-all text-left"
                  >
                    {/* Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                      <img
                        src={getImageUrl(p.foto)}
                        alt={p.nama}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {p.nama}
                        </p>

                        {/* 2. TAMBAHKAN TAG RECOVERY KECIL (Baru) */}
                        {isRecovery && (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 uppercase italic">
                            {p.recovery?.jenis}
                          </span>
                        )}

                        {!p.tersedia && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                            Habis
                          </span>
                        )}
                      </div>

                      {/* 3. LOKASI & PETANI SEKARANG DINAMIS (Bukan Aceh lagi) */}
                      <p className="text-[11px] text-gray-400 truncate">
                        👨‍🌾 {p.petani} · 📍 {p.lokasi}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${kualitasColor[p.kualitas] || "bg-gray-100 text-gray-600"}`}
                        >
                          Grade {p.kualitas}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {p.jumlah.toLocaleString()} Kg tersedia
                        </span>
                      </div>
                    </div>

                    {/* Harga */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-[#5a6e1a]">
                        Rp {p.harga.toLocaleString("id-ID")}
                      </p>
                      <p className="text-[9px] text-gray-400">/Kg</p>
                      <span className="mt-1.5 inline-flex bg-[#7a8c2e] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                        Pesan
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <BottomNav role="pedagang" />
      </div>
    );
}