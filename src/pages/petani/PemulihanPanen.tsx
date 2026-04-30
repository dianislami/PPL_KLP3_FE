import { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';

type Periode = 'bulan-ini' | 'bulan-lalu' | 'tahun-ini' | 'tahun-lalu';
type TabType = 'semua' | 'pakan' | 'kompos' | 'limbah';
type StatusType = 'rusak' | 'bs' | 'ok';

const periodeOptions: { id: Periode; label: string }[] = [
  { id: 'bulan-ini',  label: 'Bulan Ini' },
  { id: 'bulan-lalu', label: 'Bulan Lalu' },
  { id: 'tahun-ini',  label: 'Tahun Ini' },
  { id: 'tahun-lalu', label: 'Tahun Lalu' },
];

const tabOptions: { id: TabType; label: string }[] = [
  { id: 'semua',  label: 'Semua' },
  { id: 'pakan',  label: 'Pakan Ternak' },
  { id: 'kompos', label: 'Kompos' },
  { id: 'limbah', label: 'Limbah' },
];

interface PanenItem {
  id: string;
  nama: string;
  jumlah: string;
  kualitas: string;
  status: StatusType;
  emoji: string;
}

const panenData: PanenItem[] = [
  { id: 'REC-QUAL-0421', nama: 'Tomat Merah', jumlah: '3.200', kualitas: 'Rusak',            status: 'rusak', emoji: '🍅' },
  { id: 'REC-QUAL-0422', nama: 'Wortel',       jumlah: '1.500', kualitas: 'Bisa Dipulihkan', status: 'bs',    emoji: '🥕' },
  { id: 'REC-QUAL-0423', nama: 'Kentang',      jumlah: '2.100', kualitas: 'Rusak',            status: 'rusak', emoji: '🥔' },
  { id: 'REC-QUAL-0424', nama: 'Kangkung',     jumlah: '400',   kualitas: 'Bisa Dipulihkan', status: 'bs',    emoji: '🥬' },
  { id: 'REC-QUAL-0425', nama: 'Jagung',       jumlah: '800',   kualitas: 'Rusak',            status: 'rusak', emoji: '🌽' },
];

function getBadgeClass(status: StatusType): string {
  if (status === 'rusak') return 'bg-red-100 text-red-800';
  if (status === 'bs')    return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

function getBadgeLabel(status: StatusType): string {
  if (status === 'rusak') return 'Rusak';
  if (status === 'bs')    return 'Bisa Dipulihkan';
  return 'Layak Jual';
}

function filterByTab(items: PanenItem[], tab: TabType): PanenItem[] {
  if (tab === 'limbah') return items.filter(d => d.status === 'rusak');
  return items;
}

export default function PemulihanPanen() {
  const [periode, setPeriode]   = useState<Periode>('bulan-ini');
  const [activeTab, setActiveTab] = useState<TabType>('semua');

  const displayed = filterByTab(panenData, activeTab);

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold">Pemulihan Panen</h1>
            <p className="text-sm opacity-80">Kamis, 30 April 2026</p>
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

        <p className="text-base font-bold text-gray-800 px-4 mb-4">
          Kelola Kualitas & Kerusakan Panen
        </p>

        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-2 px-4 mb-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className="text-base font-bold text-red-600">3</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Rusak</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className="text-base font-bold text-yellow-600">2</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Bs Pulih</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className="text-base font-bold text-green-600">5.6 Ton</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Dipulihkan</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {tabOptions.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-semibold border transition-all ${
                activeTab === t.id
                  ? 'bg-[#3a4e10] text-white border-[#3a4e10]'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4 px-4">
          {displayed.map(item => (
            <div key={item.id} className="bg-[#f5f4ee] rounded-2xl p-4">

              {/* Card Top */}
              <div className="flex gap-3 mb-3">
                <div className="w-[72px] h-[72px] rounded-xl bg-gray-200 flex items-center justify-center text-4xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 mb-1">#{item.id}</p>
                  <p className="text-base font-bold text-gray-900">
                    {item.nama}, {item.jumlah} Kg
                  </p>
                  <p className="text-sm text-gray-500">Kualitas: {item.kualitas}</p>
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mt-1.5 ${getBadgeClass(item.status)}`}>
                    {getBadgeLabel(item.status)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 bg-[#5a6e1a] text-white text-xs font-semibold px-4 py-2.5 rounded-full">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">🐄</span>
                  Data Pakan Ternak
                </button>
                <button className="flex items-center gap-2 bg-[#e8a020] text-white text-xs font-semibold px-4 py-2.5 rounded-full">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">🌱</span>
                  Data Kompos
                </button>
                {item.status === 'rusak' && (
                  <button className="flex items-center gap-2 bg-red-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">🗑</span>
                    Limbah
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

      <BottomNav role="petani" />
    </div>
  );
}