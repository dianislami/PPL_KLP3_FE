import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { panenAPI } from "../../services/api";
import BottomNav from "../../components/layout/BottomNav";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext"; 

interface PanenItem {
  _id: string;
  nama_komoditas: string;
  jumlah: number;
  harga?: number;
  kualitas: string;
  tanggal: string;
  foto: { path: string }[];
  user_id?: { nama: string };
  recovery?: { jenis?: "pakan" | "kompos" };
}

export default function DaftarPanen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dataPanen, setDataPanen] = useState<PanenItem[]>([]);

  // STATE UNTUK DROPDOWN
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterSelected, setFilterSelected] = useState("Semua Tanaman");

  const filterOptions = [
    "Semua Tanaman",
    "Kualitas Grade A",
    "Kualitas Grade B",
    "Pemulihan (Grade C)",
  ];

  useEffect(() => {
    fetchPanen();
  }, []);

  const fetchPanen = async () => {
    try {
      const response = await panenAPI.getAll();
      // FILTER: Hanya tampilkan barang yang stoknya masih ada (> 0)
      const stokTersedia = (response.data || []).filter(
        (item: PanenItem) => item.jumlah > 0,
      );
      setDataPanen(stokTersedia);
    } catch (error) {
      console.error("Error fetching panen:", error);
    } finally {
    }
  };

  // LOGIKA FILTERING DATA
  const filteredData = dataPanen.filter((item) => {
    if (filterSelected === "Semua Tanaman") return true;
    if (filterSelected === "Kualitas Grade A")
      return item.kualitas?.toUpperCase() === "A";
    if (filterSelected === "Kualitas Grade B")
      return item.kualitas?.toUpperCase() === "B";
    if (filterSelected === "Pemulihan (Grade C)") {
      return (
        item.kualitas?.toLowerCase().includes("c") ||
        item.kualitas?.toLowerCase().includes("rusak")
      );
    }
    return true;
  });

  const getImageUrl = (foto?: { path: string }[]): string => {
    if (foto && foto.length > 0) return `http://localhost:5000${foto[0].path}`;
    return "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=1200";
  };

    const getMonthName = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", { month: "short" });
    };

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col font-sans">
      {/* Header Section */}
      <div className="px-5 pt-10 pb-8 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">Produk Panen</h1>
            <p className="text-sm opacity-80 mt-1">
              Temukan produk terbaik dari petani lokal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
          <Icon icon="mdi:map-marker" className="text-xl text-[#dce6a7]" />
          <div className="text-[11px]">
            {/* 3. Ganti nama CV dan Alamat di sini */}
            <p className="font-bold uppercase">{user?.nama || 'CV. Hasil Bumi Sejahtera'}</p>
            <p className="opacity-80 leading-tight">
              {user?.alamat || 'Lokasi belum diatur'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-t-[40px] px-5 pt-8 pb-28 relative">
        {/* Dropdown Filter Section */}
        <div className="mb-6 flex justify-between items-center relative z-30">
          <h2 className="text-lg font-bold text-gray-800">Daftar Panen</h2>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-[#f0f4e4] px-4 py-2 rounded-full border border-[#7a8c2e]/10 active:scale-95 transition-all"
            >
              <span className="text-xs font-bold text-[#7a8c2e]">
                {filterSelected}
              </span>
              <Icon
                icon="mdi:chevron-down"
                className={`text-[#7a8c2e] transition-transform ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {/* Menu Dropdown yang Muncul saat Diklik */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFilterSelected(opt);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${
                      filterSelected === opt
                        ? "bg-[#7a8c2e] text-white"
                        : "text-gray-600 hover:bg-[#f0f4e4]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid Daftar Panen */}
        <div className="grid grid-cols-2 gap-4">
          {filteredData.map((item) => {
            const isRecovery =
              item.recovery?.jenis &&
              (item.kualitas?.toLowerCase().includes("c") ||
                item.kualitas?.toLowerCase().includes("rusak"));

            return (
              <div
                key={item._id}
                onClick={() => navigate(`/detail-produk/${item._id}`)}
                className="relative h-64 rounded-[30px] overflow-hidden shadow-md active:scale-95 transition-all cursor-pointer bg-gray-100"
              >
                <img
                  src={getImageUrl(item.foto)}
                  alt={item.nama_komoditas}
                  className="w-full h-full object-cover"
                />

                {/* Tag Recovery tetap kecil & clean */}
                {isRecovery && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full shadow-sm">
                    <span className="text-[10px]">
                      {item.recovery?.jenis === "pakan" ? "🐄" : "♻️"}
                    </span>
                    <span className="text-[9px] font-bold text-white uppercase">
                      {item.recovery?.jenis}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 bg-black/40 backdrop-blur-md rounded-[20px] p-3 text-white border border-white/10">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-sm font-bold truncate pr-1">
                      {item.nama_komoditas}
                    </span>
                    {/* SEKARANG BULAN DINAMIS */}
                    <span className="text-[10px] font-medium opacity-80">
                      {getMonthName(item.tanggal)}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black">{item.jumlah}</span>
                    <span className="text-[10px] font-bold opacity-80">Kg</span>
                  </div>

                  <div className="mt-1.5 pt-1.5 border-t border-white/20 flex flex-col gap-0.5">
                    {/* INFO HARGA */}
                    <div className="flex justify-between text-[9px] opacity-90">
                      <span>Harga</span>
                      <span className="font-bold">
                        Rp {item.harga?.toLocaleString("id-ID") || "-"}
                      </span>
                    </div>

                    {/* INFO PEMILIK (PETANI) - TAMBAHAN BIAR JELAS PEMILIKNYA */}
                    <div className="flex justify-between text-[9px] opacity-90">
                      <span>Petani</span>
                      <span className="font-bold truncate max-w-[60px]">
                        {item.user_id?.nama || "Anonim"}
                      </span>
                    </div>

                    {/* INFO KUALITAS */}
                    <div className="flex justify-between text-[9px] opacity-90">
                      <span>Kualitas</span>
                      <span
                        className={`font-bold ${item.kualitas?.toLowerCase().includes("c") ? "text-yellow-400" : ""}`}
                      >
                        Grade {item.kualitas}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav role="pedagang" />
    </div>
  );
}
