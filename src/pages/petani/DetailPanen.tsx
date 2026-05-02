import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { panenAPI } from '../../services/api';

interface PanenDetail {
  _id: string;
  nama_komoditas: string;
  jumlah: number;
  tanggal: string;
  kualitas: string;
  status: string;
  deskripsi: string;
  foto?: Array<{ path: string }>;
  user_id?: { _id: string; nama: string };
}

const statusColor: Record<string, string> = {
  'siap jual':     'text-green-700 bg-green-50',
  'proses':        'text-orange-700 bg-orange-50',
  'tersimpan':     'text-gray-700 bg-gray-100',
};

const kualitasEmoji: Record<string, string> = {
  'A': '⭐⭐⭐',
  'B': '⭐⭐',
  'C': '⭐',
};

export default function DetailPanen() {
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
      <div className="w-full min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-between px-4 pt-12 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Hasil</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Data panen tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">

      {/* Top Nav Bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
        >
          <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Hasil</h1>
        <button
          onClick={() => navigate('/tambah-panen')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
        >
          <span className="text-gray-700 font-bold text-xl leading-none">+</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-12">

        {/* Section title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Detail Panen</h2>

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
              { label: 'Tanggal', value: new Date(panen.tanggal).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) },
              { label: 'Kualitas', value: panen.kualitas },
              { label: 'Status', value: panen.status },
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
          <span className={`text-xs font-bold px-4 py-2 rounded-full ${statusColor[panen.status.toLowerCase()] || 'text-gray-600 bg-gray-100'}`}>
            {panen.status}
          </span>
        </div>

        {/* Petani Info */}
        {panen.user_id && (
          <div className="bg-blue-50 rounded-2xl px-5 py-4 mb-6 border border-blue-200">
            <p className="text-xs font-bold text-blue-600 mb-2 uppercase">Petani</p>
            <p className="text-sm font-semibold text-gray-800">{panen.user_id.nama}</p>
          </div>
        )}

      </div>
    </div>
  );
}