import { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function DashboardPetani() {
  const [location] = useState('Banda Aceh');
  const [temperature] = useState('32');
  const navigate = useNavigate();
  const handleInputPanen = () => navigate('/tambah-panen');

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold">Hallo, Farmers</h1>
            <p className="text-sm opacity-90">Minggu, 11 April 2026</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-xl">
            👨‍🌾
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Cari disini"
            className="w-full pl-12 pr-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24 flex flex-col overflow-y-auto bg-white rounded-t-3xl mt-4">
        {/* Location & Weather Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md -mt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-semibold text-gray-800">{location}</p>
              </div>
            </div>
            <div className="text-center">
              <span className="text-2xl">☁️</span>
              <p className="text-2xl font-bold text-gray-800">+{temperature}°C</p>
            </div>
          </div>

          {/* Weather Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl mb-1">🌡️</div>
              <p className="text-xs text-gray-500">Suhu tanah</p>
              <p className="font-bold text-gray-800">+30°C</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💨</div>
              <p className="text-xs text-gray-500">Angin</p>
              <p className="font-bold text-gray-800">5 Km/h</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💧</div>
              <p className="text-xs text-gray-500">Kelembaban</p>
              <p className="font-bold text-gray-800">88%</p>
            </div>
          </div>

          {/* Sun Path */}
          <div className="relative h-24 mb-2">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path d="M10,80 Q150,20 290,80" stroke="#999" strokeWidth="2" fill="none" strokeDasharray="5,5" />
              <circle cx="150" cy="30" r="8" fill="#FFD700" />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-2">
            <div>
              <p>Fajar</p>
              <p className="font-semibold text-gray-700">06.33</p>
            </div>
            <div className="text-right">
              <p>Senja</p>
              <p className="font-semibold text-gray-700">18.46</p>
            </div>
          </div>
        </div>

        {/* Input Hasil Panen Button */}
        <button
          onClick={handleInputPanen}
          className="w-full bg-[#7a8c2e] hover:bg-[#929548] text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all shadow-md mb-6"
        >
          Input Hasil Panen
        </button>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#e8efd6] border-2 border-[#a3a551] rounded-2xl p-4 text-center">
            <p className="font-bold text-gray-800 text-sm">Riwayat<br />Panen</p>
          </div>
          <div className="bg-[#e8efd6] border-2 border-[#a3a551] rounded-2xl p-4 text-center">
            <p className="font-bold text-gray-800 text-sm">Kelola<br />Recovery</p>
          </div>
          <div className="bg-[#e8efd6] border-2 border-[#a3a551] rounded-2xl p-4 text-center">
            <p className="font-bold text-gray-800 text-sm">Status<br />Distribusi</p>
          </div>
        </div>

        {/* News & Recommendations */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Berita & Rekomendasi</h2>
          <div className="bg-[#dde8c5] rounded-2xl p-4 flex gap-4">
            <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav role="petani" />
    </div>
  );
}
