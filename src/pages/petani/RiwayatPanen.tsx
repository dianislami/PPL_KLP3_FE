import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { panenAPI, permintaanAPI } from "../../services/api";
import { Icon } from "@iconify/react";

type Tab = "panen" | "penjualan";

interface PanenData {
  _id: string;
  nama_komoditas: string;
  jumlah: number;
  tanggal: string;
  status: string;
  kualitas: string;
  foto?: Array<{ path: string }>;
  deskripsi?: string;
}

export default function RiwayatPanen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") === "penjualan" ? "penjualan" : "panen";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab as Tab);
  const [panenList, setPanenList] = useState<PanenData[]>([]);
  const [penjualanList, setPenjualanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Ambil Data Panen Petani (Stok akan terupdate otomatis jika berkurang di DB)
        const resPanen = await panenAPI.getAll();
        const myPanen = resPanen.data.filter(
          (item: any) => item.user_id?._id === user?.id,
        );
        setPanenList(myPanen);

        // 2. Ambil Data Penjualan (Dari koleksi Permintaan yang statusnya Selesai)
        const resPermintaan = await permintaanAPI.getAll();
        const mySales = resPermintaan.data.filter(
          (order: any) =>
            order.status.toLowerCase() === "selesai" &&
            order.matches.some((m: any) =>
              myPanen.some((p: any) => p._id === m.hasil_panen_id),
            ),
        );
        setPenjualanList(mySales);
      } catch (error) {
        console.error("Gagal memuat riwayat:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchData();
  }, [user?.id]);


  const getBgColor = (nama: string) => {
    const n = (nama || "").toLowerCase();
    if (n.includes("wortel")) return "bg-amber-600";
    if (n.includes("tomat")) return "bg-red-600";
    if (n.includes("jagung")) return "bg-yellow-400";
    if (n.includes("kentang")) return "bg-yellow-700";
    return "bg-green-600";
  };

  // Hitung KPI
  const totalVolume = panenList.reduce((s, i) => s + i.jumlah, 0) / 1000;
  const totalPendapatan = penjualanList.reduce((sum, order) => {
    const myMatch = order.matches.find((m: any) =>
      panenList.some((p) => p._id === m.hasil_panen_id),
    );
    return sum + (myMatch ? myMatch.jumlah_diambil * myMatch.harga_per_kg : 0);
  }, 0);

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Riwayat Panen
            </h1>
            <p className="text-sm opacity-80 mt-1">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Stok Aktif
          </p>
          <p className="text-xs font-bold text-gray-800">
            {panenList.filter((p) => p.jumlah > 0).length} Item
          </p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Volume
          </p>
          <p className="text-xs font-bold text-gray-800">
            {totalVolume.toFixed(1)} Ton
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Pendapatan
          </p>
          <p className="text-xs font-bold text-[#7a8c2e]">
            Rp {(totalPendapatan / 1000).toFixed(0)}rb
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-8 overflow-y-auto pb-28 shadow-2xl">
        {/* Tab Switcher */}
        <div className="flex items-center mx-4 mb-6 bg-[#f0f4e4] rounded-full p-1 border border-gray-100">
          <button
            onClick={() => setActiveTab("panen")}
            className={`flex-1 py-2.5 rounded-full text-xs font-black uppercase transition-all ${
              activeTab === "panen"
                ? "bg-[#3a4e10] text-white shadow-md"
                : "text-[#7a8c2e]"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Icon icon="mdi:leaf" className="text-base" />
              <span>Stok Panen</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("penjualan")}
            className={`flex-1 py-2.5 rounded-full text-xs font-black uppercase transition-all ${
              activeTab === "penjualan"
                ? "bg-[#3a4e10] text-white shadow-md"
                : "text-[#7a8c2e]"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Icon icon="mdi:marketplace" className="text-base" />
              <span>Penjualan</span>
            </div>
          </button>
        </div>

        {/* --- TAB: HASIL PANEN --- */}
        {activeTab === "panen" && (
          <div className="px-4">
            <div className="flex justify-center mb-6">
              <button
                onClick={() => navigate("/tambah-panen")}
                className="flex items-center gap-2 bg-[#3a4e10] text-white rounded-full px-6 py-3 text-xs font-black uppercase shadow-lg active:scale-95 transition-all"
              >
                + Tambah Stok Panen
              </button>
            </div>

            {loading ? (
              <p className="text-center py-10 text-gray-400 text-sm">
                Memuat data...
              </p>
            ) : panenList.length === 0 ? (
              <div className="text-center py-20 opacity-20">
                <span className="text-5xl">🌱</span>
                <p className="mt-2 font-bold">Belum ada hasil panen</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[...panenList].reverse().map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/detail-panen/${item._id}`)}
                    className="relative rounded-[30px] overflow-hidden h-48 bg-gray-100 shadow-sm border border-gray-50 active:scale-95 transition-all cursor-pointer"
                  >
                    <img
                      src={
                        item.foto && item.foto.length > 0
                          ? `http://localhost:5000${item.foto[0].path}`
                          : "/images/default-panen.jpg" // <-- fallback image
                      }
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-3 text-center">
                      <p className="font-black text-white text-xs uppercase tracking-tighter">
                        {item.nama_komoditas}
                      </p>
                      <p className="text-white text-[10px] opacity-80 mt-1 font-bold">
                        Grade {item.kualitas} ·{" "}
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-2 py-1 shadow-sm">
                      <p className="text-[10px] text-gray-800 font-black">
                        {item.jumlah} Kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB: RIWAYAT PENJUALAN --- */}
        {activeTab === "penjualan" && (
          <div className="px-4">
            {loading ? (
              <p className="text-center py-10 text-gray-400 text-sm">
                Memuat data...
              </p>
            ) : penjualanList.length === 0 ? (
              <div className="text-center py-20 opacity-20">
                <p className="mt-2 font-bold">Belum ada penjualan</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {[...penjualanList].reverse().map((order) => {
                  const myMatch = order.matches.find((m: any) =>
                    panenList.some((p) => p._id === m.hasil_panen_id),
                  );
                  return (
                    <div
                      key={order._id}
                      onClick={() => navigate(`/status-pengiriman/${order._id}`)}
                      className="bg-[#f9faf5] border border-gray-100 rounded-[30px] p-5 shadow-sm cursor-pointer active:scale-95 transition-all"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#eaf0d8] overflow-hidden shadow-inner">
                          {(() => {
                            const panenItem = panenList.find(
                              (p) => p._id === myMatch?.hasil_panen_id,
                            );
                            if (panenItem?.foto && panenItem.foto.length > 0) {
                              return (
                                <img
                                  src={`http://localhost:5000${panenItem.foto[0].path}`}
                                  className="w-full h-full object-cover"
                                />
                              );
                            }
                            return (
                              <div
                                className={`w-full h-full ${getBgColor(order.nama_komoditas)} flex items-center justify-center text-3xl`}
                              >
                                🌱
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">
                              {order.nama_komoditas}
                            </p>
                            <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase">
                              Lunas
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                            Pembeli: {order.user_id?.nama || "Pedagang"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-dashed border-gray-200 pt-4 mt-1">
                        <div className="text-center">
                          <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">
                            Terjual
                          </p>
                          <p className="text-xs font-black text-gray-700">
                            {myMatch?.jumlah_diambil} Kg
                          </p>
                        </div>
                        <div className="text-center border-x border-gray-100">
                          <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">
                            Harga
                          </p>
                          <p className="text-xs font-black text-gray-700">
                            Rp {myMatch?.harga_per_kg?.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">
                            Total
                          </p>
                          <p className="text-xs font-black text-[#5a6e1a]">
                            Rp{" "}
                            {(
                              myMatch?.jumlah_diambil * myMatch?.harga_per_kg
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 opacity-50">
                        <p className="text-[8px] font-bold text-gray-400">
                          Order ID: {order.nomor_permintaan}
                        </p>
                        <p className="text-[8px] font-bold text-gray-400">
                          {new Date(order.tanggal).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav role="petani" />
    </div>
  );
}
