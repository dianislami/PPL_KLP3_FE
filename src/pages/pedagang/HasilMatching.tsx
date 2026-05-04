import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { permintaanAPI } from "../../services/api";
import { Icon } from "@iconify/react";
import api from "../../services/api"; // Axios instance

const IconCheckCircle = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" fill="#4CAF50" />
    <path
      d="M8 12L11 15L16 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function HasilMatching() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await permintaanAPI.getById(id!);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAksi = async (tindakan: "setuju" | "batal") => {
    try {
      await api.put(`/permintaan/konfirmasi/${id}`, { tindakan });
      alert(tindakan === "setuju" ? "Pesanan Berhasil!" : "Pesanan Dibatalkan");
      navigate("/riwayat-pedagang?tab=selesai");
    } catch (err) {
      alert("Gagal memproses");
    }
  };

  if (loading || !data)
    return <div className="p-10 text-center">Memuat Analisis...</div>;

  // Cek apakah status sudah Selesai atau Dibatalkan
  const isFinished =
    data.status.toLowerCase() === "selesai" ||
    data.status.toLowerCase() === "dibatalkan";

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex flex-col font-sans pb-28 relative">
      {/* 1. Header Section - Samakan dengan halaman lain agar CV & Alamat muncul */}
      <div className="bg-[#7a8c2e] px-5 pt-10 pb-6 text-white relative flex-shrink-0">
        <div className="flex gap-3 items-center mb-3">
          <button
            onClick={() => navigate("/riwayat-pedagang?tab=selesai")}
            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
          </button>
          <h1 className="text-2xl font-bold uppercase">
            Status Pemesanan
          </h1>
        </div>
        <div className="flex items-start gap-2 bg-white/10 p-3 rounded-2xl border border-white/10">
          <Icon icon="mdi:map-marker" className="text-xl text-[#dce6a7]" />
          <div className="text-[11px]">
            <p className="font-bold uppercase tracking-wider">{user?.nama}</p>
            <p className="opacity-90 leading-tight">
              {user?.alamat || "Banda Aceh"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Sub-Header Dinamis */}
      <div className="px-5 mt-4">
        <h2 className="text-black font-bold text-lg leading-tight uppercase">
          Hasil Matching {data.nomor_permintaan}
        </h2>
        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
          Status:{" "}
          <span className={isFinished ? "text-[#7a8c2e]" : "text-orange-500"}>
            {data.status}
          </span>
        </p>
      </div>

      {/* 3. Main Card Content */}
      <div className="flex-1 px-5 mt-4 z-10">
        <div className="bg-white rounded-[30px] p-6 shadow-lg mb-10 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 text-base uppercase tracking-tighter">
            Detail Pasokan Terkonfirmasi
          </h3>

          {/* Stepper / Timeline visual */}
          <div className="relative mb-8">
            <div className="absolute left-[20px] top-[40px] bottom-[20px] border-l-2 border-dashed border-[#7a8c2e]"></div>

            {/* Item 1: Total Pasokan */}
            <div className="flex items-center gap-4 mb-8">
              <div className="z-10 bg-white rounded-full shadow-sm">
                <IconCheckCircle />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  Total Pasokan Ditemukan
                </p>
                <p className="text-[#7a8c2e] text-xs font-black uppercase">
                  {data.jumlah} Kg Tersedia
                </p>
              </div>
            </div>

            {/* Item 2: Rata-rata Kualitas */}
            <div className="flex items-start gap-4">
              <div className="z-10 bg-white rounded-full shadow-sm mt-1">
                <IconCheckCircle />
              </div>
              <div className="flex-1 bg-[#f0f4e4] rounded-2xl p-4 border border-[#7a8c2e]/10">
                <p className="font-bold text-gray-800 text-xs border-b border-gray-400/20 pb-1.5 mb-2 uppercase">
                  Kualitas Terjamin
                </p>
                <p className="text-gray-600 text-[11px] font-bold italic">
                  Produk Grade {data.kualitas} dari Mitra Petani Pilihan.
                </p>
              </div>
            </div>
          </div>

          {/* 4. List Petani Dinamis */}
          <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">
            Daftar Mitra Penyuplai:
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {data.matches?.map((m: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-[#f9faf5] p-3 rounded-2xl border border-gray-100 group relative"
              >
                <div className="w-10 h-10 rounded-full bg-[#7a8c2e] flex items-center justify-center text-white font-black text-sm shadow-sm">
                  {m.petani_nama ? m.petani_nama.charAt(0).toUpperCase() : "P"}
                </div>
                <div className="text-[10px] leading-tight min-w-0 flex-1">
                  <p className="font-bold text-gray-800 truncate">
                    {m.petani_nama}
                  </p>
                  <p className="text-gray-500 font-medium">
                    {m.jumlah_diambil} Kg ·{" "}
                    {m.lokasi ? m.lokasi.split(",")[0] : "Aceh"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (m.petani_id) {
                      navigate(`/chat-pedagang/${m.petani_id}`);
                    }
                  }}
                  disabled={!m.petani_id}
                  className="text-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Chat dengan Petani"
                >
                  💬
                </button>
              </div>
            ))}
          </div>

          {/* 5. Rekap Biaya Section */}
          <div className="flex justify-between items-end pt-6 border-t border-gray-100">
            <h4 className="font-bold text-gray-800 text-base mb-4 uppercase tracking-tighter">
              Rekap Biaya
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-inner w-3/5">
              <p className="text-[11px] font-black text-center mb-3 text-gray-400 uppercase tracking-widest">
                Estimasi Pembayaran
              </p>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between text-gray-600">
                  <span>Harga Dasar</span>
                  <span className="font-bold">
                    IDR {data.matches?.[0]?.harga_per_kg || 0}/Kg
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-1.5">
                  <span>Biaya Logistik</span>
                  <span className="font-bold">IDR 200/Kg</span>
                </div>
                <div className="flex justify-between pt-1.5 text-[#7a8c2e] font-black text-[12px]">
                  <span>TOTAL</span>
                  <span>
                    IDR{" "}
                    {((data.matches?.[0]?.harga_per_kg || 0) + 200) *
                      data.jumlah}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Action Buttons: Tampil jika status MASIH PENDING */}
          {!isFinished ? (
            <div className="flex gap-3 mt-10">
              <button
                onClick={() => handleAksi("batal")}
                className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all border border-red-100"
              >
                Batalkan
              </button>
              <button
                onClick={() => handleAksi("setuju")}
                className="flex-[2] py-4 bg-[#7a8c2e] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Konfirmasi Pesanan
              </button>
            </div>
          ) : (
            /* Tampil jika status SUDAH SELESAI / BATAL */
            <div className="mt-10 p-4 bg-[#f0f4e4] rounded-2xl border border-[#7a8c2e]/20 text-center animate-in fade-in duration-500">
              <p className="text-[#7a8c2e] font-black text-xs uppercase tracking-widest italic">
                {data.status === "Selesai"
                  ? "✓ Pesanan Telah Dikonfirmasi"
                  : "✕ Pesanan Telah Dibatalkan"}
              </p>
            </div>
          )}

          {/* Footer Info */}
          <div className="text-center mt-10">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              Smart Harvest Matching System
            </p>
          </div>
        </div>
      </div>

      <BottomNav role="pedagang" />
    </div>
  );
}
