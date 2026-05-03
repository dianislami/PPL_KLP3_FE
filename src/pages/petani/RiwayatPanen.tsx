import { useState, useEffect } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { panenAPI } from '../../services/api';

type Periode = 'bulan-ini' | 'bulan-lalu' | 'tahun-ini' | 'tahun-lalu';
type Tab = 'panen' | 'penjualan';

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

interface PenjualanData {
  id: string;
  komoditas: string;
  jumlah: number;
  harga: number;
  total: number;
  pembeli: string;
  tanggal: string;
  status: 'lunas' | 'pending' | 'dibatalkan';
  emoji: string;
}

const periodeOptions: { id: Periode; label: string }[] = [
  { id: 'bulan-ini',  label: 'Bulan Ini' },
  { id: 'bulan-lalu', label: 'Bulan Lalu' },
  { id: 'tahun-ini',  label: 'Tahun Ini' },
  { id: 'tahun-lalu', label: 'Tahun Lalu' },
];

const emojiMap: Record<string, string> = {
  wortel: '🥕', tomat: '🍅', jagung: '🌽',
  kentang: '🥔', kangkung: '🥬', bawang: '🧅',
};
const bgColorMap: Record<string, string> = {
  wortel: 'bg-amber-600', tomat: 'bg-red-600', jagung: 'bg-yellow-400',
  kentang: 'bg-yellow-700', kangkung: 'bg-green-700', bawang: 'bg-orange-800',
};

// Data penjualan statis
const penjualanStatis: PenjualanData[] = [
  { id: 'TRX-001', komoditas: 'Kentang', jumlah: 500, harga: 8000,  total: 4000000,  pembeli: 'CV. Hasil Bumi Sejahtera', tanggal: '2026-04-28', status: 'lunas',      emoji: '🥔' },
  { id: 'TRX-002', komoditas: 'Tomat Merah', jumlah: 300, harga: 12000, total: 3600000, pembeli: 'UD. Sumber Makmur',       tanggal: '2026-04-25', status: 'lunas',      emoji: '🍅' },
  { id: 'TRX-003', komoditas: 'Wortel', jumlah: 800, harga: 6500,  total: 5200000,  pembeli: 'Toko Sayur Pak Hasan',      tanggal: '2026-04-20', status: 'pending',     emoji: '🥕' },
  { id: 'TRX-004', komoditas: 'Jagung', jumlah: 1200, harga: 4000, total: 4800000,  pembeli: 'CV. Hasil Bumi Sejahtera', tanggal: '2026-04-15', status: 'lunas',      emoji: '🌽' },
  { id: 'TRX-005', komoditas: 'Kangkung', jumlah: 200, harga: 3000, total: 600000,  pembeli: 'Pasar Peunayong',          tanggal: '2026-04-10', status: 'dibatalkan',  emoji: '🥬' },
  { id: 'TRX-006', komoditas: 'Bawang Merah', jumlah: 400, harga: 22000, total: 8800000, pembeli: 'UD. Sumber Makmur', tanggal: '2026-03-28', status: 'lunas',      emoji: '🧅' },
];

const statusPenjualanStyle: Record<string, string> = {
  lunas:      'bg-green-100 text-green-700',
  pending:    'bg-yellow-100 text-yellow-700',
  dibatalkan: 'bg-red-100 text-red-600',
};
const statusPenjualanLabel: Record<string, string> = {
  lunas: 'Lunas', pending: 'Menunggu', dibatalkan: 'Dibatalkan',
};

export default function RiwayatPanen() {
  const [periode, setPeriode]   = useState<Periode>('bulan-ini');
  const [activeTab, setActiveTab] = useState<Tab>('panen');
  const [panenList, setPanenList] = useState<PanenData[]>([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPanen = async () => {
      try {
        const response = await panenAPI.getAll();
        const userPanen = response.data.filter((item: any) => item.user_id?._id === user?.id);
        setPanenList(userPanen);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchPanen();
  }, [user?.id]);

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
      const t = new Date(item.tanggal);
      switch (periode) {
        case 'bulan-ini':  return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
        case 'bulan-lalu': { const lm = new Date(now.getFullYear(), now.getMonth() - 1); return t.getMonth() === lm.getMonth() && t.getFullYear() === lm.getFullYear(); }
        case 'tahun-ini':  return t.getFullYear() === now.getFullYear();
        case 'tahun-lalu': return t.getFullYear() === now.getFullYear() - 1;
        default: return true;
      }
    });
  };

  const filterPenjualan = (data: PenjualanData[]) => {
    const now = new Date();
    return data.filter(item => {
      const t = new Date(item.tanggal);
      switch (periode) {
        case 'bulan-ini':  return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
        case 'bulan-lalu': { const lm = new Date(now.getFullYear(), now.getMonth() - 1); return t.getMonth() === lm.getMonth() && t.getFullYear() === lm.getFullYear(); }
        case 'tahun-ini':  return t.getFullYear() === now.getFullYear();
        case 'tahun-lalu': return t.getFullYear() === now.getFullYear() - 1;
        default: return true;
      }
    });
  };

  const filteredPanen    = filterByPeriode(panenList);
  const filteredPenjualan = filterPenjualan(penjualanStatis);
  const totalPendapatan  = filteredPenjualan.filter(p => p.status === 'lunas').reduce((s, p) => s + p.total, 0);

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold">Riwayat Panen</h1>
            <p className="text-sm opacity-80">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-xl">
            👨‍🌾
          </div>
        </div>

        {/* Filter Periode */}
        <p className="text-sm font-semibold mb-2">Filter & Periode</p>
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {periodeOptions.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriode(p.id)}
              className={`text-xs px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                periode === p.id ? 'bg-white text-[#5a6e1a] font-semibold' : 'bg-white/20 text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        {activeTab === 'panen' ? (
          <>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Total Panen</p>
              <p className="text-xs font-bold text-gray-800">{loading ? '--' : filteredPanen.length} Item</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-[10px] text-gray-400">Total Jumlah</p>
              <p className="text-xs font-bold text-gray-800">
                {loading ? '--' : (filteredPanen.reduce((s, i) => s + i.jumlah, 0) / 1000).toFixed(1)} Ton
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Status</p>
              <p className="text-xs font-bold text-[#7a8c2e]">Aktif ↗</p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Transaksi</p>
              <p className="text-xs font-bold text-gray-800">{filteredPenjualan.length} Kali</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-[10px] text-gray-400">Pendapatan</p>
              <p className="text-xs font-bold text-gray-800">
                Rp {(totalPendapatan / 1000000).toFixed(1)}Jt
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Lunas</p>
              <p className="text-xs font-bold text-[#7a8c2e]">
                {filteredPenjualan.filter(p => p.status === 'lunas').length} Transaksi
              </p>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-5 overflow-y-auto pb-28">

        {/* Tab Switcher */}
        <div className="flex items-center mx-4 mb-5 bg-[#f0f4e4] rounded-full p-1">
          <button
            onClick={() => setActiveTab('panen')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'panen'
                ? 'bg-[#3a4e10] text-white shadow-sm'
                : 'text-[#7a8c2e]'
            }`}
          >
            🌾 Hasil Panen
          </button>
          <button
            onClick={() => setActiveTab('penjualan')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'penjualan'
                ? 'bg-[#3a4e10] text-white shadow-sm'
                : 'text-[#7a8c2e]'
            }`}
          >
            🧾 Riwayat Penjualan
          </button>
        </div>

        {/* ── TAB: HASIL PANEN ── */}
        {activeTab === 'panen' && (
          <>
            <div className="flex justify-center mb-5">
              <button
                onClick={() => navigate('/tambah-panen')}
                className="flex items-center gap-2 bg-[#3a4e10] text-white rounded-full px-5 py-2.5 text-sm font-semibold shadow"
              >
                <span className="w-7 h-7 bg-[#7a8c2e] rounded-full flex items-center justify-center text-lg font-bold">+</span>
                Laporan Baru
              </button>
            </div>

            {loading && (
              <div className="flex justify-center py-10">
                <p className="text-gray-400 text-sm">Memuat data panen...</p>
              </div>
            )}

            {!loading && filteredPanen.length === 0 && (
              <div className="flex flex-col items-center py-14 gap-2">
                <span className="text-5xl">🌱</span>
                <p className="text-gray-400 text-sm">Belum ada data panen</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 px-4">
              {!loading && filteredPanen.map(item => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/detail-panen/${item._id}`)}
                  className="relative rounded-2xl overflow-hidden h-44 bg-gray-200 flex items-center justify-center cursor-pointer active:scale-95 transition-all group"
                >
                  {item.foto && item.foto.length > 0 && item.foto[0].path ? (
                    <img
                      src={`http://localhost:5000${item.foto[0].path}`}
                      alt={item.nama_komoditas}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className={`w-full h-full ${getBgColor(item.nama_komoditas)} flex items-center justify-center`}>
                      <span className="text-5xl">{getEmoji(item.nama_komoditas)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center">
                    <p className="font-bold text-white text-sm mb-1">{item.nama_komoditas}</p>
                    <p className="text-white text-xs opacity-90">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 rounded-lg px-2 py-1">
                    <p className="text-xs text-gray-800 font-bold">{item.jumlah} Kg</p>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── TAB: RIWAYAT PENJUALAN ── */}
        {activeTab === 'penjualan' && (
          <div className="px-4">

            {filteredPenjualan.length === 0 && (
              <div className="flex flex-col items-center py-14 gap-2">
                <span className="text-5xl">🧾</span>
                <p className="text-gray-400 text-sm">Belum ada riwayat penjualan</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {filteredPenjualan.map(item => (
                <div
                  key={item.id}
                  className="bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-4 shadow-sm active:scale-95 transition-all cursor-pointer"
                  onClick={() => {/* navigate ke detail penjualan jika ada */}}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {/* Emoji komoditas */}
                    <div className="w-12 h-12 rounded-xl bg-[#eaf0d8] flex items-center justify-center text-2xl flex-shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-gray-800">{item.komoditas}</p>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusPenjualanStyle[item.status]}`}>
                          {statusPenjualanLabel[item.status]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.pembeli}</p>
                    </div>
                  </div>

                  {/* Detail row */}
                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-[10px] text-gray-400">Jumlah</p>
                      <p className="text-xs font-bold text-gray-700">{item.jumlah.toLocaleString('id-ID')} Kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Harga/Kg</p>
                      <p className="text-xs font-bold text-gray-700">Rp {item.harga.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">Total</p>
                      <p className="text-xs font-bold text-[#5a6e1a]">
                        Rp {item.total.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">#{item.id}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav role="petani" />
    </div>
  );
}