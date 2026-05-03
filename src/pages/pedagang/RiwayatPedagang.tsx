import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/layout/BottomNav';

type Periode = 'bulan-ini' | 'bulan-lalu' | 'tahun-ini' | 'tahun-lalu';
type StatusFilter = 'Semua' | 'Lunas' | 'Pending' | 'Dibatalkan';

interface RiwayatItem {
  id: string;
  noOrder: string;
  produk: string;
  petani: string;
  lokasi: string;
  jumlah: number;
  harga: number;
  total: number;
  kualitas: string;
  status: 'lunas' | 'pending' | 'dibatalkan';
  tanggal: string;
  emoji: string;
  bg: string;
  statusPengiriman: 'diambil' | 'perjalanan' | 'gudang' | 'diterima';
}

const periodeOptions: { id: Periode; label: string }[] = [
  { id: 'bulan-ini',  label: 'Bulan Ini' },
  { id: 'bulan-lalu', label: 'Bulan Lalu' },
  { id: 'tahun-ini',  label: 'Tahun Ini' },
  { id: 'tahun-lalu', label: 'Tahun Lalu' },
];

const riwayatData: RiwayatItem[] = [
  {
    id: '1', noOrder: 'ORD-2604-001',
    produk: 'Kentang Kennebec', petani: 'Budi Santoso',
    lokasi: 'Atong, Kec. Montasik, Aceh Besar',
    jumlah: 500, harga: 8000, total: 4000000,
    kualitas: 'Premium', status: 'lunas',
    tanggal: '2026-04-28', emoji: '🥔', bg: 'bg-yellow-700',
    statusPengiriman: 'diterima',
  },
  {
    id: '2', noOrder: 'ORD-2504-002',
    produk: 'Tomat Merah', petani: 'Ridwan Musa',
    lokasi: 'Desa Lamreung, Krueng Barona Jaya',
    jumlah: 300, harga: 12000, total: 3600000,
    kualitas: 'Grade A', status: 'lunas',
    tanggal: '2026-04-25', emoji: '🍅', bg: 'bg-red-500',
    statusPengiriman: 'diterima',
  },
  {
    id: '3', noOrder: 'ORD-2304-003',
    produk: 'Wortel Lokal', petani: 'Siti Rahma',
    lokasi: 'Kec. Bukit, Bener Meriah',
    jumlah: 800, harga: 6500, total: 5200000,
    kualitas: 'Grade A', status: 'pending',
    tanggal: '2026-04-23', emoji: '🥕', bg: 'bg-amber-600',
    statusPengiriman: 'perjalanan',
  },
  {
    id: '4', noOrder: 'ORD-2004-004',
    produk: 'Jagung Manis', petani: 'Ahmad Fauzi',
    lokasi: 'Kec. Bebesen, Aceh Tengah',
    jumlah: 1200, harga: 4000, total: 4800000,
    kualitas: 'Grade B', status: 'lunas',
    tanggal: '2026-04-20', emoji: '🌽', bg: 'bg-yellow-400',
    statusPengiriman: 'diterima',
  },
  {
    id: '5', noOrder: 'ORD-1504-005',
    produk: 'Kangkung Segar', petani: 'Zulkifli AR',
    lokasi: 'Kec. Lueng Bata, Banda Aceh',
    jumlah: 200, harga: 3000, total: 600000,
    kualitas: 'Grade B', status: 'dibatalkan',
    tanggal: '2026-04-15', emoji: '🥬', bg: 'bg-green-700',
    statusPengiriman: 'diambil',
  },
  {
    id: '6', noOrder: 'ORD-2803-006',
    produk: 'Bawang Merah', petani: 'Nurul Huda',
    lokasi: 'Kec. Bandar Dua, Pidie Jaya',
    jumlah: 400, harga: 22000, total: 8800000,
    kualitas: 'Premium', status: 'lunas',
    tanggal: '2026-03-28', emoji: '🧅', bg: 'bg-orange-700',
    statusPengiriman: 'diterima',
  },
  {
    id: '7', noOrder: 'ORD-2003-007',
    produk: 'Cabai Merah Keriting', petani: 'Fitri Yanti',
    lokasi: 'Kec. Kuta Makmur, Aceh Utara',
    jumlah: 150, harga: 45000, total: 6750000,
    kualitas: 'Premium', status: 'pending',
    tanggal: '2026-04-29', emoji: '🌶️', bg: 'bg-red-700',
    statusPengiriman: 'gudang',
  },
];

const statusStyle: Record<string, string> = {
  lunas:      'bg-green-100 text-green-700',
  pending:    'bg-yellow-100 text-yellow-700',
  dibatalkan: 'bg-red-100 text-red-600',
};
const statusLabel: Record<string, string> = {
  lunas: 'Lunas', pending: 'Diproses', dibatalkan: 'Dibatalkan',
};
const kualitasColor: Record<string, string> = {
  'Premium': 'bg-purple-100 text-purple-700',
  'Grade A': 'bg-green-100 text-green-700',
  'Grade B': 'bg-yellow-100 text-yellow-700',
};

function filterByPeriode(data: RiwayatItem[], periode: Periode) {
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
}

export default function RiwayatPedagang() {
  const navigate = useNavigate();
  const [periode, setPeriode]       = useState<Periode>('bulan-ini');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Semua');

  const byPeriode  = filterByPeriode(riwayatData, periode);
  const filtered   = byPeriode.filter(d =>
    statusFilter === 'Semua' ? true : statusLabel[d.status] === statusFilter
  );

  const totalBelanja = byPeriode.filter(d => d.status === 'lunas').reduce((s, d) => s + d.total, 0);
  const totalOrder   = byPeriode.length;
  const totalLunas   = byPeriode.filter(d => d.status === 'lunas').length;

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold">Riwayat Pembelian</h1>
            <p className="text-sm opacity-80">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-xl">
            🏪
          </div>
        </div>

        {/* Filter Periode */}
        <p className="text-sm font-semibold mb-2">Filter & Periode</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Total Order</p>
          <p className="text-xs font-bold text-gray-800">{totalOrder} Order</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400">Total Belanja</p>
          <p className="text-xs font-bold text-gray-800">
            Rp {(totalBelanja / 1000000).toFixed(1)}Jt
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Selesai</p>
          <p className="text-xs font-bold text-[#7a8c2e]">{totalLunas} Order</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-5 overflow-y-auto pb-28">

        {/* Status Filter Pills */}
        <div className="flex gap-2 px-4 mb-4 overflow-x-auto scrollbar-hide">
          {(['Semua', 'Lunas', 'Pending', 'Dibatalkan'] as StatusFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-semibold border transition-all ${
                statusFilter === f
                  ? 'bg-[#3a4e10] text-white border-[#3a4e10]'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-2">
            <span className="text-5xl">🧾</span>
            <p className="text-gray-400 text-sm">Belum ada riwayat pembelian</p>
          </div>
        )}

        {/* List */}
        <div className="flex flex-col gap-3 px-4">
          {filtered.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(`/status-pengiriman-pedagang/${item.id}`)}
              className="w-full text-left bg-[#f9faf5] border border-gray-100 rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-all"
            >
              {/* Top Strip */}
              <div className={`${item.bg} px-4 py-2.5 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <p className="text-sm font-bold text-white">{item.produk}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle[item.status]}`}>
                  {statusLabel[item.status]}
                </span>
              </div>

              {/* Body */}
              <div className="px-4 py-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">{item.noOrder}</p>
                    <p className="text-xs text-gray-600">👨‍🌾 {item.petani}</p>
                    <p className="text-xs text-gray-400">📍 {item.lokasi}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${kualitasColor[item.kualitas]}`}>
                    {item.kualitas}
                  </span>
                </div>

                {/* Detail row */}
                <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-2.5 mt-1">
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
                    <p className="text-xs font-bold text-[#5a6e1a]">Rp {item.total.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400">
                    {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] font-semibold text-[#7a8c2e]">
                    Lihat Status Pengiriman →
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav role="pedagang" />
    </div>
  );
}