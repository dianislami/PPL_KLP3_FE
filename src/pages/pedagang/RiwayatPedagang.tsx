import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { permintaanAPI } from "../../services/api";
import { Icon } from "@iconify/react";

type StatusFilter = "Selesai" | "Pending" | "Dibatalkan";

export default function RiwayatPedagang() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Pending");

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        setLoading(true);
        const response = await permintaanAPI.getAll();
        // Filter agar hanya muncul pesanan milik pedagang yang sedang login
        const milikSaya = response.data.filter(
          (item: any) => item.user_id?._id === user?.id,
        );
        setRiwayat(milikSaya);
      } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchRiwayat();
  }, [user]);

  // LOGIKA PENGELOMPOKKAN STATUS AGAR TIDAK SALAH TAB
  const getDisplayStatus = (status: string): StatusFilter => {
    const s = (status || "").toLowerCase();
    if (s === "lunas" || s === "terkonfirmasi" || s === "selesai")
      return "Selesai";
    if (s === "dibatalkan" || s === "batal") return "Dibatalkan";
    return "Pending"; // Untuk status: Diajukan, Matching, Menunggu Konfirmasi
  };

  const getStyleData = (nama: string) => {
    const n = (nama || "").toLowerCase();
    if (n.includes("kentang")) return { emoji: "🥔", bg: "bg-yellow-700" };
    if (n.includes("tomat")) return { emoji: "🍅", bg: "bg-red-500" };
    if (n.includes("wortel")) return { emoji: "🥕", bg: "bg-amber-600" };
    if (n.includes("jagung")) return { emoji: "🌽", bg: "bg-yellow-400" };
    if (n.includes("cabai")) return { emoji: "🌶️", bg: "bg-red-700" };
    return { emoji: "🌿", bg: "bg-green-600" };
  };

  const filteredData = riwayat.filter(
    (item) => getDisplayStatus(item.status) === statusFilter,
  );

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col font-sans">
      {/* Header - Sinkron dengan Input Kebutuhan */}
      <div className="px-5 pt-10 pb-8 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
              Hallo, {user?.nama?.split(" ")[0] || "Seller"}
            </h1>
            <p className="text-sm opacity-80 mt-1">
              Riwayat permintaan komoditas Anda
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-2xl shadow-md">
            🏪
          </div>
        </div>

        {/* Box Lokasi - Ambil Nama Toko dan Alamat Profil */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
          <Icon icon="mdi:map-marker" className="text-xl text-[#dce6a7]" />
          <div className="text-[11px]">
            <p className="font-bold uppercase tracking-wider">{user?.nama}</p>
            <p className="opacity-80 leading-tight">
              {user?.alamat || "Lokasi belum diatur"}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Order</p>
          <p className="text-xs font-bold text-gray-800">{riwayat.length}</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Selesai
          </p>
          <p className="text-xs font-bold text-[#7a8c2e]">
            {
              riwayat.filter((i) => getDisplayStatus(i.status) === "Selesai")
                .length
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Batal</p>
          <p className="text-xs font-bold text-red-500">
            {
              riwayat.filter((i) => getDisplayStatus(i.status) === "Dibatalkan")
                .length
            }
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-t-[40px] mt-3 pt-8 overflow-y-auto pb-28 shadow-2xl">
        {/* Tab Filter */}
        <div className="flex gap-2 px-4 mb-6">
          {(["Selesai", "Pending", "Dibatalkan"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold border transition-all ${
                statusFilter === f
                  ? "bg-[#3a4e10] text-white border-[#3a4e10] shadow-md"
                  : "bg-gray-50 text-gray-400 border-gray-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List Riwayat */}
        <div className="flex flex-col gap-4 px-4">
          {loading ? (
            <p className="text-center py-10 text-gray-400 text-sm">
              Memuat data...
            </p>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-20 opacity-30 flex flex-col items-center">
              <span className="text-5xl mb-2">🧾</span>
              <p className="text-xs font-bold">
                Tidak ada riwayat {statusFilter}
              </p>
            </div>
          ) : (
            filteredData.map((item) => {
              const style = getStyleData(item.nama_komoditas);
              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/hasil-matching/${item._id}`)}
                  className="w-full text-left bg-white border border-gray-100 rounded-[30px] overflow-hidden shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                >
                  {/* Top Strip */}
                  <div className={`${statusFilter === 'Selesai' ? 'bg-[#7a8c2e]' : style.bg} px-5 py-2.5 flex items-center justify-between`}>
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-xl">{style.emoji}</span>
                      <p className="text-xs font-black uppercase">
                        {item.nama_komoditas}
                      </p>
                    </div>
                    <span className="text-[8px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full uppercase">
                      {statusFilter}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="px-5 py-4">
                    <p className="text-[9px] text-gray-300 font-bold uppercase mb-1">
                      {item.nomor_permintaan}
                    </p>
                    <p className="text-xs font-bold text-gray-600">
                      Grade {item.kualitas} · {item.jumlah} Kg
                    </p>

                    <div className="flex justify-between items-center border-t border-dashed border-gray-100 mt-4 pt-3">
                      <p className="text-[10px] font-bold text-gray-400">
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </p>

                      {/* TOMBOL AKSI BERDASARKAN STATUS */}
                      {statusFilter === "Pending" ? (
                        <span className="text-[10px] font-black text-[#7a8c2e] underline uppercase">
                          Detail Matching ›
                        </span>
                      ) : (
                        statusFilter === "Selesai" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Mencegah klik container (Matching)
                              navigate(
                                `/status-pengiriman-pedagang/${item._id}`,
                              );
                            }}
                            className="text-[10px] font-black text-blue-500 underline uppercase"
                          >
                            Lihat Status ›
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <BottomNav role="pedagang" />
    </div>
  );
}
