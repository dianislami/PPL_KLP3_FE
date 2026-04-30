import { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';

export default function TambahPanen() {
  const [tanaman, setTanaman] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [kualitas, setKualitas] = useState('');
  const [status, setStatus] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);

  const handleSimpan = () => {
    console.log({ tanaman, jumlah, lokasi, deskripsi, tanggal, kualitas, status, gambar });
  };

  const handleGambar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setGambar(e.target.files[0]);
  };

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 text-white">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h1 className="text-3xl font-bold">Hallo, Farmers</h1>
            <p className="text-sm opacity-80">Senin, 28 April 2026</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs bg-white/20 rounded-full px-3 py-1">Riwayat</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-4 grid grid-cols-3 gap-2 -mb-4 z-10 relative">
        <div className="text-center">
          <p className="text-xs text-gray-400">Hasil Kumulatif</p>
          <p className="font-bold text-gray-800">35.4 Ton</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-xs text-gray-400">Lahan Aktif</p>
          <p className="font-bold text-gray-800">12 Hektar</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Prediksi Pasar</p>
          <p className="font-bold text-[#7a8c2e]">Stabil ↗</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-4 pt-8 px-5 pb-28 overflow-y-auto">
        <h2 className="text-base font-semibold text-gray-500 mb-4">Input Hasil Panen</h2>

        {/* Nama Tanaman */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] rounded-xl flex items-center justify-center text-lg flex-shrink-0">🧺</div>
          <input
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300"
            placeholder="Nama Tanaman (komoditas)"
            value={tanaman}
            onChange={e => setTanaman(e.target.value)}
          />
        </div>

        {/* Jumlah Panen */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] rounded-xl flex items-center justify-center text-lg flex-shrink-0">⚖️</div>
          <input
            type="number"
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300"
            placeholder="Jumlah Panen (Kg)"
            value={jumlah}
            onChange={e => setJumlah(e.target.value)}
          />
        </div>

        {/* Lokasi Lahan */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] rounded-xl flex items-center justify-center text-lg flex-shrink-0">📍</div>
          <input
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300"
            placeholder="Lokasi Lahan"
            value={lokasi}
            onChange={e => setLokasi(e.target.value)}
          />
        </div>

        {/* Deskripsi Panen */}
        <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5">📋</div>
          <textarea
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300 resize-none"
            placeholder="Deskripsi Panen"
            rows={2}
            value={deskripsi}
            onChange={e => setDeskripsi(e.target.value)}
          />
        </div>

        {/* Tanggal & Gambar */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-3 py-3 shadow-sm">
            <div className="w-9 h-9 bg-[#f0f4e0] rounded-xl flex items-center justify-center text-base flex-shrink-0">📅</div>
            <input
              type="date"
              className="flex-1 text-xs bg-transparent outline-none text-gray-400"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 bg-white border-2 border-dashed border-[#c8d4a0] rounded-2xl px-3 py-3 cursor-pointer">
            <div className="w-9 h-9 bg-[#f0f4e0] rounded-xl flex items-center justify-center text-base flex-shrink-0">📷</div>
            <div>
              <p className="text-xs font-medium text-gray-600">{gambar ? gambar.name.slice(0, 10) + '…' : 'Ambil Gambar'}</p>
              <p className="text-[10px] text-gray-400">Foto hasil panen</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleGambar} />
          </label>
        </div>

        {/* Kualitas & Status */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <select
            className="bg-[#7a8c2e] text-white rounded-2xl px-4 py-3 text-sm font-medium appearance-none outline-none"
            value={kualitas}
            onChange={e => setKualitas(e.target.value)}
          >
            <option value="" disabled>Kualitas</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>
          <select
            className="bg-[#7a8c2e] text-white rounded-2xl px-4 py-3 text-sm font-medium appearance-none outline-none"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="" disabled>Status</option>
            <option value="siap">Siap Jual</option>
            <option value="proses">Dalam Proses</option>
            <option value="tersimpan">Tersimpan</option>
          </select>
        </div>

        {/* Simpan Button */}
        <button
          onClick={handleSimpan}
          className="w-full bg-[#7a8c2e] hover:bg-[#6a7a26] text-white font-bold py-4 rounded-2xl text-base transition-all shadow-md mb-3"
        >
          Simpan
        </button>

        <p className="text-center text-xs text-[#7a8c2e] underline cursor-pointer">Lihat panduan kualitas panen</p>
      </div>

      <BottomNav role="petani" />
    </div>
  );
}