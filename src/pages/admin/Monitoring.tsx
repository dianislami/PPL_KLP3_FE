import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from "@iconify/react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { panenAPI } from '../../services/api';

const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

// ── Custom Tooltip ──
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const MonitoringPage: React.FC = () => {
  const [panen, setPanen]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    panenAPI.getAll()
      .then(res => setPanen(res.data))
      .catch(() => setError('Gagal mengambil data panen'))
      .finally(() => setLoading(false));
  }, []);

  const totalPanen     = panen.reduce((s, p) => s + (p.jumlah || 0), 0);
  const totalTransaksi = panen.length;
  const totalRecovery  = panen
    .filter(p => p.recovery?.jenis)
    .reduce((s, p) => s + (p.jumlah || 0), 0);
  const recoveryPakan  = panen
    .filter(p => p.recovery?.jenis === 'pakan')
    .reduce((s, p) => s + (p.jumlah || 0), 0);
  const recoveryKompos = panen
    .filter(p => p.recovery?.jenis === 'kompos')
    .reduce((s, p) => s + (p.jumlah || 0), 0);

  const chartData = months.map((m, idx) => {
    const mp = panen.filter(p => new Date(p.tanggal).getMonth() === idx);
    return {
      name: m,
      Panen: +(mp.reduce((s, p) => s + (p.jumlah || 0), 0) / 1000).toFixed(1),
      Distribusi: mp.length,
    };
  });

  const stats = [
    { label: 'Total Panen',  value: `${totalPanen.toLocaleString('id-ID')}`, unit: 'kg', icon: "mdi:leaf", color: 'text-[#5a6e1a]' },
    { label: 'Transaksi',    value: `${totalTransaksi}`,                  unit: 'Order', icon: "mdi:clipboard-list", color: 'text-blue-600' },
    { label: 'Recovery',     value: `${totalRecovery.toLocaleString('id-ID')}`, unit: 'kg', icon: "mdi:recycle", color: 'text-orange-600' },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* ── Header ── */}
      <div className="bg-[#7a8c2e] px-6 pt-12 pb-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Hallo, Admin</h1>
            <p className="text-sm opacity-80 mt-1">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-2xl shadow">
            🛡️
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="mx-4 -mt-5 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative mb-5">
        {stats.map(s => (
          <div key={s.label} className="text-center py-1">
            <Icon icon={s.icon} className="text-2xl text-[#7a8c2e] inline-block" />
            <p className={`text-sm font-bold mt-1.5 ${s.color}`}>
              {s.value} <span className="text-[10px] font-normal text-gray-400">{s.unit}</span>
            </p>
            <p className="text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-4 pb-32">

        {loading && (
          <div className="flex items-center justify-center py-10 gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#7a8c2e] border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">Memuat data...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Chart card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-800">Analitik Panen & Distribusi</h2>
              <p className="text-xs text-gray-400 mt-0.5">Data bulanan tahun {new Date().getFullYear()}</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <span className="w-3 h-1.5 rounded-full inline-block bg-[#5a7a1a]" />
                <span className="text-[10px] text-gray-500">Panen</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-1.5 rounded-full inline-block bg-[#dc2626]" />
                <span className="text-[10px] text-gray-500">Distribusi</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f0f0f0" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Panen"
                  stroke="#5a7a1a"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#5a7a1a', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#5a7a1a' }}
                />
                <Line
                  type="monotone"
                  dataKey="Distribusi"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#dc2626', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#dc2626' }}
                  strokeDasharray="5 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-[10px] text-gray-300 mt-3">
            Terakhir sinkronisasi: {new Date().toLocaleString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })} WIB
          </p>
        </div>

        {/* Detail stats cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#f0f5e4] rounded-2xl p-4 border border-[#d4e4a0]">
            <p className="text-4xl mb-3">🌾</p>
            <p className="text-xs text-[#5a6e1a] font-semibold">Total Panen</p>
            <p className="text-2xl font-bold text-[#3a4e10] mt-1">
              {totalPanen.toLocaleString('id-ID')}
              <span className="text-sm font-normal text-[#5a6e1a] ml-1">kg</span>
            </p>
            <p className="text-[10px] text-[#7a8c2e] mt-1">Dari {totalTransaksi} laporan panen</p>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <p className="text-4xl mb-3">♻️</p>
            <p className="text-xs text-orange-600 font-semibold">Recovery</p>
            <p className="text-2xl font-bold text-orange-700 mt-1">
              {totalRecovery.toLocaleString('id-ID')}
              <span className="text-sm font-normal text-orange-500 ml-1">kg</span>
            </p>
            <p className="text-[10px] text-orange-400 mt-1">Grade C / Rusak</p>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Ringkasan Komoditas</h3>
          {['tomat','kentang','wortel','jagung','kangkung'].map(k => {
            const total = panen.filter(p => p.nama_komoditas?.toLowerCase().includes(k)).reduce((s,p) => s+p.jumlah,0);
            const pct   = totalPanen > 0 ? Math.round((total / totalPanen) * 100) : 0;
            if (total === 0) return null;
            return (
              <div key={k} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-semibold text-gray-600 capitalize">{k}</p>
                  <p className="text-xs text-gray-400">{total.toLocaleString("id-ID")} Kg ({pct}%)</p>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#7a8c2e] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {panen.length === 0 && !loading && (
            <p className="text-xs text-gray-400 text-center py-4">Belum ada data komoditas</p>
          )}
        </div>

        {/* Recovery Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">♻️ Breakdown Recovery</h3>
          <div className="space-y-3">
            {/* Pakan */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold text-gray-600">🐄 Pakan Ternak</p>
                <p className="text-xs text-blue-600 font-bold">{panen.filter(p => p.recovery?.jenis === 'pakan').length} item</p>
              </div>
              <p className="text-sm font-bold text-blue-700">{recoveryPakan.toLocaleString('id-ID')} kg</p>
              <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${totalRecovery > 0 ? (recoveryPakan / totalRecovery) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            {/* Kompos */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold text-gray-600">♻️ Kompos</p>
                <p className="text-xs text-green-600 font-bold">{panen.filter(p => p.recovery?.jenis === 'kompos').length} item</p>
              </div>
              <p className="text-sm font-bold text-green-700">{recoveryKompos.toLocaleString('id-ID')} kg</p>
              <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${totalRecovery > 0 ? (recoveryKompos / totalRecovery) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
          {totalRecovery === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">Belum ada data recovery</p>
          )}
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div className="fixed bottom-6 left-4 right-4 bg-black rounded-full flex p-2 shadow-xl z-50">
        <Link
          to="/monitoring"
          className="flex-1 py-2.5 rounded-full text-center text-sm font-semibold bg-[#7a8c2e] text-white"
        >
          Monitoring
        </Link>
        <Link
          to="/kelola-pengguna"
          className="flex-1 py-2.5 rounded-full text-center text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Pengguna
        </Link>
        <Link
          to="/profil-admin"
          className="flex-1 py-2.5 rounded-full text-center text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Profil
        </Link>
      </div>
    </div>
  );
};

export default MonitoringPage;