import { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';


type Periode = 'bulan-ini' | 'bulan-lalu' | 'tahun-ini' | 'tahun-lalu';

const panenData = [
  { id: 1, nama: 'Wortel',       bulan: 'Januari',  jumlah: '12.300', bg: 'bg-amber-600',  emoji: '🥕' },
  { id: 2, nama: 'Tomat Merah',  bulan: 'April',    jumlah: '3.000',  bg: 'bg-red-600',    emoji: '🍅' },
  { id: 3, nama: 'Jagung',       bulan: 'Februari', jumlah: '3.400',  bg: 'bg-yellow-400', emoji: '🌽' },
  { id: 4, nama: 'Kentang',      bulan: 'Maret',    jumlah: '5.200',  bg: 'bg-yellow-700', emoji: '🥔' },
  { id: 5, nama: 'Kangkung',     bulan: 'April',    jumlah: '800',    bg: 'bg-green-700',  emoji: '🥬' },
  { id: 6, nama: 'Bawang Merah', bulan: 'Maret',    jumlah: '2.100',  bg: 'bg-orange-800', emoji: '🧅' },
];

const periodeOptions: { id: Periode; label: string }[] = [
  { id: 'bulan-ini',   label: 'Bulan Ini' },
  { id: 'bulan-lalu',  label: 'Bulan Lalu' },
  { id: 'tahun-ini',   label: 'Tahun Ini' },
  { id: 'tahun-lalu',  label: 'Tahun Lalu' },
];

export default function RiwayatPanen() {
  const [periode, setPeriode] = useState<Periode>('bulan-ini');
  const navigate = useNavigate();

  const handleLaporanBaru = () => {
    navigate('/tambah-panen');
  };


  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold">Riwayat Panen</h1>
            <p className="text-sm opacity-80">Senin, 28 April 2026</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-xl">
            👨‍🌾
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
          <p className="text-[10px] text-gray-400">Hasil Kumulatif</p>
          <p className="text-xs font-bold text-gray-800">35.4 Ton</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400">Lahan Aktif</p>
          <p className="text-xs font-bold text-gray-800">12 Hektar</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Prediksi Pasar</p>
          <p className="text-xs font-bold text-[#7a8c2e]">Stabil ↗</p>
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

        {/* Grid Kartu Panen */}
        <div className="grid grid-cols-2 gap-3 px-4">
          {panenData.map(item => (
            <div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden h-44 ${item.bg} flex items-center justify-center`}
            >
              {/* Placeholder gambar */}
              <span className="text-6xl opacity-80">{item.emoji}</span>
              <p className="absolute top-2 left-3 text-[10px] text-white/50 font-medium">
                panen{item.id}
              </p>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 rounded-b-2xl px-3 py-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-white">{item.nama}</span>
                  <span className="text-[10px] text-white/70">{item.bulan}</span>
                </div>
                <p className="text-base font-bold text-white">{item.jumlah} Kg</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav role="petani" />
    </div>
  );
}