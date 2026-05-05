import { useState, useEffect } from "react";
import BottomNav from "../../components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import artikelData from "../data/artikelBerita.json";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";
import { weatherAPI, chatAPI } from "../../services/api";

interface Artikel {
  id: string;
  judul: string;
  ringkasan: string;
  isi: string;
  kategori: string;
  tanggal: string;
  emoji: string;
  warna: string;
}

interface WeatherData {
  lokasi: string;
  suhu: string;
  kelembapan: number;
  angin: string;
  kondisi: string;
  deskripsi: string;
  icon: string;
}

const ICONS = {
  recovery: "mdi:recycle",
  delivery: "mdi:truck-fast-outline",
  chat: "mdi:chat-outline",
  search: "mdi:magnify",
};

const artikel = artikelData as Artikel[];

export default function DashboardPetani() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayLocation = user?.alamat || "Banda Aceh";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const city = displayLocation;

        try {
          const response = await weatherAPI.get(city);
          if (response.data) {
            setWeather(response.data);
            return;
          }
        } catch {
          const fallbackResponse = await weatherAPI.get("Banda Aceh");
          if (fallbackResponse.data) {
            setWeather(fallbackResponse.data);
            return;
          }
        }
      } catch (error) {
        setWeather({
          lokasi: "Banda Aceh",
          suhu: "28",
          kelembapan: 80,
          angin: "1.5",
          kondisi: "Clouds",
          deskripsi: "Data cuaca lokal",
          icon: "https://openweathermap.org/img/wn/03d@2x.png",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchWeather();
  }, [user, displayLocation]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        if (user?.id) {
          const response = await chatAPI.getUnreadCount(user.id);
          setUnreadCount(response.data?.unreadCount || 0);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    if (user?.id) fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(() => {
      if (user?.id) fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  const handleInputPanen = () => navigate("/tambah-panen");

  // Filter artikel berdasarkan search query
  const filteredArtikel = artikel.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.judul.toLowerCase().includes(query) ||
      item.ringkasan.toLowerCase().includes(query) ||
      item.kategori.toLowerCase().includes(query) ||
      item.isi.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              Hallo, {user?.nama || "Farmers"}
            </h1>
            <p className="text-sm opacity-90">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-xl">
            👨‍🌾
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Icon
            icon={ICONS.search}
            className="text-xl absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
          />
          <input
            type="text"
            placeholder="Cari berita, tips, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2 bg-white/30 text-white text-sm placeholder-white/70 rounded-full focus:outline-none focus:ring-1 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24 flex flex-col overflow-y-auto bg-white rounded-t-3xl mt-4">
        {/* Location & Weather Card */}
        <div className="bg-white rounded-2xl p-6 mt-2 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <div>
                {/* Pastikan lokasi tampil, jika tidak ada tampilkan alamat user atau Banda Aceh */}
                <p className="font-semibold text-gray-800">
                  {loading ? "Memuat..." : displayLocation}
                </p>
              </div>
            </div>
            <div className="text-center">
              {loading || !weather ? (
                <p className="text-2xl font-bold text-gray-800">--°C</p>
              ) : (
                <>
                  {/* Tambahkan pengecekan jika icon ada */}
                  {weather.icon && (
                    <img
                      src={weather.icon}
                      alt="weather"
                      className="w-12 h-12 mx-auto mb-1"
                    />
                  )}
                  <p className="text-2xl font-bold text-gray-800">
                    {/* Pakai || '--' agar tidak muncul undefined */}
                    {weather.suhu ? `+${weather.suhu}°C` : "--°C"}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Weather Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl mb-1">🌡️</div>
              <p className="text-xs text-gray-500">Suhu</p>
              {/* Proteksi terhadap undefined */}
              <p className="font-bold text-gray-800">
                {loading || !weather?.suhu ? "--" : `+${weather.suhu}°C`}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💨</div>
              <p className="text-xs text-gray-500">Angin</p>
              <p className="font-bold text-gray-800">
                {loading || !weather?.angin ? "--" : `${weather.angin} m/s`}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💧</div>
              <p className="text-xs text-gray-500">Kelembaban</p>
              <p className="font-bold text-gray-800">
                {loading || !weather?.kelembapan
                  ? "--"
                  : `${weather.kelembapan}%`}
              </p>
            </div>
          </div>

          {/* Kondisi */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 text-center">
            <p className="text-sm text-gray-600">
              {loading || !weather?.deskripsi
                ? "Memuat data cuaca..."
                : weather.deskripsi}
            </p>
          </div>
        </div>

        {/* Input Hasil Panen Button */}
        <button
          onClick={handleInputPanen}
          className="w-full bg-[#7a8c2e] hover:bg-[#929548] text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all shadow-md mb-6 mt-6"
        >
          Input Hasil Panen
        </button>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate("/daftar-chat-petani")}
            className="bg-[#e8efd6] border-2 border-[#7a8c2e] rounded-2xl p-4 text-center active:scale-95 flex flex-col items-center transition-all relative"
          >
            <Icon
              icon={ICONS.chat}
              className="text-3xl mb-2 text-[#7a8c2e]"
            />
            <p className="font-bold text-gray-800 text-xs">Daftar Chat</p>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-[#7a8c2e] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </button>
          <button
            onClick={() => navigate("/pemulihan-panen")}
            className="bg-[#e8efd6] border-2 border-[#7a8c2e] rounded-2xl p-4 text-center active:scale-95 flex flex-col items-center transition-all"
          >
            <Icon
              icon={ICONS.recovery}
              className="text-3xl mb-2 text-[#7a8c2e]"
            />
            <p className="font-bold text-gray-800 text-xs">Kelola Recovery</p>
          </button>
          <button
            onClick={() => navigate("/riwayat-panen?tab=penjualan")}
            className="bg-[#e8efd6] border-2 border-[#7a8c2e] rounded-2xl p-4 text-center active:scale-95 flex flex-col items-center transition-all"
          >
            <Icon
              icon={ICONS.delivery}
              className="text-3xl mb-2 text-[#7a8c2e]"
            />
            <p className="font-bold text-gray-800 text-xs">Status Distribusi</p>
          </button>
        </div>

        {/* Berita & Rekomendasi */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Berita & Rekomendasi
            </h2>
            <span className="text-xs text-[#7a8c2e] font-semibold">
              {filteredArtikel.length} artikel
            </span>
          </div>

          {filteredArtikel.length === 0 ? (
            <div className="w-full bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-400 text-sm">
                Tidak ada artikel yang cocok dengan pencarian "{searchQuery}"
              </p>
            </div>
          ) : (
            <>
              {/* Artikel Featured (pertama dari hasil filter) */}
              <button
                onClick={() =>
                  navigate(`/detail-artikel/${filteredArtikel[0].id}`)
                }
                className={`w-full ${filteredArtikel[0].warna} rounded-2xl p-4 flex gap-4 mb-3 text-left active:scale-95 transition-all`}
              >
                <div className="w-20 h-20 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0 text-4xl">
                  {filteredArtikel[0].emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/60 text-gray-600 mb-1.5 inline-block">
                    {filteredArtikel[0].kategori}
                  </span>
                  <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-1">
                    {filteredArtikel[0].judul}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {filteredArtikel[0].ringkasan}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {filteredArtikel[0].tanggal}
                  </p>
                </div>
              </button>

              {/* Artikel list (sisanya) */}
              <div className="flex flex-col gap-3">
                {filteredArtikel.slice(1).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/detail-artikel/${item.id}`)}
                    className="w-full bg-white border border-gray-100 rounded-2xl p-3 flex gap-3 text-left active:scale-95 transition-all shadow-sm"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl ${item.warna} flex items-center justify-center flex-shrink-0 text-3xl`}
                    >
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#eaf0d8] text-[#5a6e1a]">
                          {item.kategori}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.tanggal}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                        {item.judul}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav role="petani" />
    </div>
  );
}
