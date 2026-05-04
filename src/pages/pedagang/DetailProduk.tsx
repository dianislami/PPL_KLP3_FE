import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { panenAPI } from "../../services/api";
import { Icon } from "@iconify/react";
import { getBackendOrigin } from "../../services/api";

interface PanenDetail {
  _id: string;
  nama_komoditas: string;
  jumlah: number;
  harga?: number;
  tanggal: string;
  kualitas: string;
  deskripsi: string;
  lokasi: string; // Tambah field lokasi
  foto?: Array<{ path: string }>;
  user_id?: { _id: string; nama: string };
  recovery?: { jenis?: string }; // Tambah field recovery
}

const kualitasEmoji: Record<string, string> = {
  A: "⭐⭐⭐",
  B: "⭐⭐",
  C: "⭐",
};

export default function DetailProduk() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [panen, setPanen] = useState<PanenDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const response = await panenAPI.getById(id);
          setPanen(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch panen detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center font-bold text-[#7a8c2e]">
        <p>Memuat detail panen...</p>
      </div>
    );
  }

  if (!panen) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col pb-28">
        <div className="flex items-center justify-between px-4 pt-12 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-gray-700 font-bold text-lg leading-none">
              ‹
            </span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Detail Produk</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Data panen tidak ditemukan</p>
        </div>
      </div>
    );
  }

  // Cek apakah ini produk recovery
  const isRecovery =
    panen.recovery?.jenis &&
    (panen.kualitas?.toLowerCase().includes("c") ||
      panen.kualitas?.toLowerCase().includes("rusak"));

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
        >
          <span className="text-gray-700 font-bold text-lg leading-none">
            ‹
          </span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Detail Produk</h1>
        <button
          onClick={() => navigate("/daftar-panen")}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
        >
          <span className="text-gray-700 font-bold text-xl leading-none">
            ≡
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {/* Judul & Tag Recovery */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {panen.nama_komoditas}
          </h2>
          {isRecovery && (
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              {panen.recovery?.jenis}
            </span>
          )}
        </div>

        {/* Lokasi & Nama Petani (Dinamis) */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-1 text-[#7a8c2e] font-bold text-sm">
            <Icon icon="mdi:map-marker" />
            <span>{panen.lokasi || "Banda Aceh"}</span>
          </div>
          <p className="text-xs text-gray-400 font-medium italic">
            Pemilik: {panen.user_id?.nama || "Petani Lokal"}
          </p>
        </div>

        {/* Info Grid (Image + Pills) */}
        <div className="flex gap-3 mb-4">
          <div className="w-44 h-68 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
            {panen.foto && panen.foto.length > 0 ? (
              <img
                src={`${getBackendOrigin()}${panen.foto[0].path}`}
                alt={panen.nama_komoditas}
                className="w-full h-full object-cover"
              />
            ) : (
              <span style={{ fontSize: "80px" }}>🌱</span>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1 justify-center">
            {[
              { label: "Jumlah", value: `${panen.jumlah} Kg` },
              {
                label: "Harga",
                value: panen.harga
                  ? `Rp ${panen.harga.toLocaleString("id-ID")}/Kg`
                  : "-",
              },
              {
                label: "Tanggal",
                value: new Date(panen.tanggal).toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                }),
              },
              { label: "Kualitas", value: `Grade ${panen.kualitas}` },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-100 rounded-2xl px-4 py-2.5 text-center border border-black/5"
              >
                <p className="text-[10px] font-bold text-[#5a6e1a] uppercase">
                  {item.label}
                </p>
                <p className="text-sm font-black text-gray-700 mt-0.5">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Deskripsi */}
        {panen.deskripsi && (
          <div className="bg-[#f9faf5] rounded-2xl px-5 py-4 mb-6 border border-gray-100">
            <p className="text-xs font-bold text-[#5a6e1a] mb-2 uppercase">
              Catatan Petani
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {panen.deskripsi}
            </p>
          </div>
        )}

        {/* Footer info & Buttons */}
        <div className="bg-[#e6ead1] rounded-2xl px-5 py-4 mb-6 border border-[#7a8c2e]/20">
          <p className="text-xs font-bold text-[#5a6e1a] mb-1 italic text-center">
            "{kualitasEmoji[panen.kualitas] || "⭐"} Grade {panen.kualitas} siap
            dipasok"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate("/input-kebutuhan")}
            className="bg-[#3a4e10] text-white rounded-2xl py-4 font-bold shadow-lg active:scale-95 transition-all"
          >
            Pesan Sekarang
          </button>
          <button
            onClick={() => {
              if (panen.user_id?._id) {
                navigate(`/chat-pedagang/${panen.user_id._id}`, {
                  state: {
                    produk: {
                      id: panen._id,
                      nama: panen.nama_komoditas,
                      harga: panen.harga,
                      jumlah: panen.jumlah,
                      kualitas: panen.kualitas,
                      foto: panen.foto && panen.foto.length > 0 ? `${getBackendOrigin()}${panen.foto[0].path}` : null,
                      deskripsi: panen.deskripsi,
                    }
                  }
                });
              }
            }}
            disabled={!panen.user_id?._id}
            className="bg-[#7a8c2e] text-white rounded-2xl py-4 font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Chat Petani
          </button>
        </div>
      </div>
    </div>
  );
}
