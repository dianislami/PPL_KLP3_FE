import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { panenAPI } from '../../services/api';
import BottomNav from '../../components/layout/BottomNav';

interface PanenDetail {
  _id: string;
  nama_komoditas: string;
  jumlah: number;
  harga?: number;
  tanggal: string;
  kualitas: string;
  deskripsi: string;
  foto?: Array<{ path: string }>;
  user_id?: { _id: string; nama: string };
}

const kualitasEmoji: Record<string, string> = {
  'A': '⭐⭐⭐',
  'B': '⭐⭐',
  'C': '⭐',
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
        console.error('Failed to fetch panen detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Memuat detail panen...</p>
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
            <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Detail Produk</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Data panen tidak ditemukan</p>
        </div>

        <BottomNav role="pedagang" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col pb-28">

      {/* Top Nav Bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
        >
          <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Detail Produk</h1>
        <button
          onClick={() => navigate('/hasil-panen')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
        >
          <span className="text-gray-700 font-bold text-xl leading-none">≡</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">

        {/* Section title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Detail Produk untuk Pedagang</h2>
        <p className="text-sm text-gray-500 mb-4">Informasi ini ditampilkan untuk membantu pedagang menilai stok, kualitas, dan potensi pembelian.</p>

        <div className="bg-[#f5f7ee] border border-[#dfe8c1] rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#5a6e1a] uppercase">Status Ketersediaan</p>
            <p className="text-sm font-semibold text-gray-800">Cocok untuk penawaran pedagang</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#7a8c2e] text-white">
            Tersedia
          </span>
        </div>

        {/* Main Card: Image + Info grid */}
        <div className="flex gap-3 mb-4">
          {/* Image */}
          <div className="w-44 h-68 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {panen.foto && panen.foto.length > 0 && panen.foto[0].path ? (
              <img 
                src={`http://localhost:5000${panen.foto[0].path}`} 
                alt={panen.nama_komoditas} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback ke emoji jika gambar tidak ditemukan
                  const img = e.currentTarget;
                  img.style.display = 'none';
                  img.parentElement!.innerHTML = '<span style="font-size: 80px">🌱</span>';
                }}
              />
            ) : (
              <span style={{ fontSize: '80px' }}>🌱</span>
            )}
          </div>

          {/* Info pills */}
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {[
              { label: 'Jumlah', value: `${panen.jumlah} Kg` },
              { label: 'Harga', value: panen.harga ? `Rp ${panen.harga.toLocaleString('id-ID')}/Kg` : '-' },
              { label: 'Tanggal', value: new Date(panen.tanggal).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) },
              { label: 'Kualitas', value: panen.kualitas },
            ].map(item => (
              <div
                key={item.label}
                className="bg-gray-100 rounded-2xl px-4 py-2.5 text-center"
              >
                <p className="text-xs font-bold text-[#5a6e1a]">{item.label}</p>
                <p className="text-sm text-gray-700 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nama Tanaman pill */}
        <div className="bg-gray-100 rounded-2xl px-5 py-3 mb-4">
          <p className="text-base font-bold text-gray-800">{panen.nama_komoditas}</p>
        </div>

        {/* Deskripsi card */}
        {panen.deskripsi && (
          <div className="bg-gray-100 rounded-2xl px-5 py-4 mb-6">
            <p className="text-xs font-bold text-[#5a6e1a] mb-2 uppercase">Deskripsi</p>
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
              {panen.deskripsi}
            </p>
          </div>
        )}

        {/* Badge row */}
        <div className="flex gap-2 mb-6">
          <span className="text-xs font-bold px-4 py-2 rounded-full text-green-700 bg-green-50">
            {kualitasEmoji[panen.kualitas] || '⭐'} Grade {panen.kualitas}
          </span>
        </div>

        <div className="bg-[#e6ead1] rounded-2xl px-5 py-4 mb-6 border border-[#7a8c2e]">
          <p className="text-xs font-bold text-[#5a6e1a] uppercase mb-1">Rekomendasi Pedagang</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Gunakan data jumlah, kualitas, dan status panen ini untuk menentukan kebutuhan pembelian atau tindak lanjut ke permintaan barang.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate('/input-kebutuhan')}
            className="bg-[#7a8c2e] text-white rounded-2xl py-3 font-bold active:scale-95 transition-all"
          >
            Input Kebutuhan
          </button>
          <button
            onClick={() => navigate('/hasil-panen')}
            className="bg-gray-100 text-gray-800 rounded-2xl py-3 font-bold active:scale-95 transition-all"
          >
            Lihat Daftar Panen
          </button>
        </div>

      </div>

      <BottomNav role="pedagang" />
    </div>
  );
}