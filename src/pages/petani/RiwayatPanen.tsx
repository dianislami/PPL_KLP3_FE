import { useState, useEffect } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { panenAPI } from '../../services/api';

type Periode = 'bulan-ini' | 'bulan-lalu' | 'tahun-ini' | 'tahun-lalu';

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

const periodeOptions: { id: Periode; label: string }[] = [
  { id: 'bulan-ini',   label: 'Bulan Ini' },
  { id: 'bulan-lalu',  label: 'Bulan Lalu' },
  { id: 'tahun-ini',   label: 'Tahun Ini' },
  { id: 'tahun-lalu',  label: 'Tahun Lalu' },
];

const emojiMap: { [key: string]: string } = {
  'wortel': '🥕',
  'tomat': '🍅',
  'jagung': '🌽',
  'kentang': '🥔',
  'kangkung': '🥬',
  'bawang': '🧅',
};

const bgColorMap: { [key: string]: string } = {
  'wortel': 'bg-amber-600',
  'tomat': 'bg-red-600',
  'jagung': 'bg-yellow-400',
  'kentang': 'bg-yellow-700',
  'kangkung': 'bg-green-700',
  'bawang': 'bg-orange-800',
};

export default function RiwayatPanen() {
  const [periode, setPeriode] = useState<Periode>('bulan-ini');
  const [panenList, setPanenList] = useState<PanenData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPanen = async () => {
      try {
        const response = await panenAPI.getAll();
        // Filter for current user's data
        const userPanen = response.data.filter((item: any) => item.user_id?._id === user?.id);
        setPanenList(userPanen);
      } catch (error) {
        console.error('Failed to fetch panen data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPanen();
    }
  }, [user?.id]);

  const handleLaporanBaru = () => {
    navigate('/tambah-panen');
  };

  const getEmoji = (nama: string) => {
    const lower = nama.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lower.includes(key)) return emoji;
    }
    return '🌱';
  };

  const getBgColor = (nama: string) => {
    const lower = nama.toLowerCase();
    for (const [key, color] of Object.entries(bgColorMap)) {
      if (lower.includes(key)) return color;
    }
    return 'bg-green-600';
  };

  const filterByPeriode = (data: PanenData[]) => {
    const now = new Date();

    return data.filter(item => {
      const tanggal = new Date(item.tanggal);

      switch (periode) {
        case 'bulan-ini':
          return (
            tanggal.getMonth() === now.getMonth() &&
            tanggal.getFullYear() === now.getFullYear()
          );

        case 'bulan-lalu':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return (
            tanggal.getMonth() === lastMonth.getMonth() &&
            tanggal.getFullYear() === lastMonth.getFullYear()
          );

        case 'tahun-ini':
          return tanggal.getFullYear() === now.getFullYear();

        case 'tahun-lalu':
          return tanggal.getFullYear() === now.getFullYear() - 1;

        default:
          return true;
      }
    });
  };

  const filteredPanen = filterByPeriode(panenList);


  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold">Riwayat Panen</h1>
            <p className="text-sm opacity-80">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Filter Periode */}
        <p className="text-sm font-semibold mb-2">Filter & Periode</p>
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {periodeOptions.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriode(p.id)}
              className={`text-xs px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                periode === p.id
                  ? 'bg-white text-[#5a6e1a] font-semibold'
                  : 'bg-white/20 text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Total Panen</p>
          <p className="text-xs font-bold text-gray-800">{loading ? '--' : filteredPanen.length} Item</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400">Total Jumlah</p>
          <p className="text-xs font-bold text-gray-800">{loading ? '--' : (filteredPanen.reduce((sum, item) => sum + item.jumlah, 0) / 1000).toFixed(1)} Ton</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Status</p>
          <p className="text-xs font-bold text-[#7a8c2e]">Aktif ↗</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-5 overflow-y-auto pb-28">
        {/* Laporan Baru Button */}
        <div className="flex justify-center mb-5">
          <button
            onClick={handleLaporanBaru}
            className="flex items-center gap-2 bg-[#3a4e10] text-white rounded-full px-5 py-2.5 text-sm font-semibold shadow"
          >
            <span className="w-7 h-7 bg-[#7a8c2e] rounded-full flex items-center justify-center text-lg font-bold">+</span>
            Laporan Baru
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500">Memuat data panen...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPanen.length === 0 && (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500">Belum ada data panen</p>
          </div>
        )}

        {/* Grid Kartu Panen */}
        <div className="grid grid-cols-2 gap-3 px-4">
          {!loading && filteredPanen.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/detail-panen/${item._id}`)}
              className="relative rounded-2xl overflow-hidden h-44 bg-gray-200 flex items-center justify-center cursor-pointer active:scale-95 transition-all group"
            >
              {/* Gambar atau Background */}
              {item.foto && item.foto.length > 0 && item.foto[0].path ? (
                <img
                  src={`http://localhost:5000${item.foto[0].path}`}
                  alt={item.nama_komoditas}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    // Fallback ke background jika gambar error
                    const img = e.currentTarget;
                    img.style.display = 'none';
                  }}
                />
              ) : (
                <div className={`w-full h-full ${getBgColor(item.nama_komoditas)} flex items-center justify-center`}>
                  <span className="text-5xl">{getEmoji(item.nama_komoditas)}</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center">
                <div className="text-center">
                  <p className="font-bold text-white text-sm mb-1">{item.nama_komoditas}</p>
                  <p className="text-white text-xs opacity-90">
                    {new Date(item.tanggal).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Info Badge */}
              <div className="absolute top-2 right-2 bg-white/90 rounded-lg px-2 py-1 backdrop-blur-sm">
                <p className="text-xs text-gray-800 font-bold">{item.jumlah} Kg</p>
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-2 left-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav role="petani" />
    </div>
  );
}