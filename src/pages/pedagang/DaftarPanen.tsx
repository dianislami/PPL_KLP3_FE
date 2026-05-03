import { useState, useEffect } from 'react';
import { panenAPI } from '../../services/api';

const IconChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

interface PanenItem {
  _id: string;
  nama_komoditas: string;
  jumlah: number;
  kualitas: string;
  tanggal: string;
  foto: { path: string }[];
  recovery?: { jenis?: 'pakan' | 'kompos' };
}

export default function DaftarPanen() {
  const [dataPanen, setDataPanen] = useState<PanenItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPanen();
  }, []);

  const fetchPanen = async () => {
    try {
      setLoading(true);
      const response = await panenAPI.getAll();
      setDataPanen(response.data || []);
    } catch (error) {
      console.error('Error fetching panen:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (foto?: { path: string }[]): string => {
    if (foto && foto.length > 0) {
      return `http://localhost:5000${foto[0].path}`;
    }
    return "https://images.pexels.com/photos/2468876/pexels-photo-2468876.jpeg?auto=compress&cs=tinysrgb&w=1200";
  };

  const getMonthName = (dateString: string): string => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const date = new Date(dateString);
    return monthNames[date.getMonth()];
  };

  return (
    <div className="w-full min-h-screen bg-[#D1D1D1] flex flex-col font-sans pb-28 relative">
      
      {/* Header Section */}
      <div className="bg-[#7a8c2e] px-5 pt-10 pb-12 text-white relative flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Hallo, Seller</h1>
            <p className="text-sm opacity-80 mb-4">Temukan produk dari petani lokal</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-lg">📍</span>
          <div className="text-[11px]">
            <p className="font-bold">CV. Hasil Bumi Sejahtera</p>
            <p className="opacity-90 leading-tight">Alamat: Jl. Teuku Umar No. 10, Banda Aceh</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 -mt-6 z-10">
        
        {/* Kategori Selector */}
        <div className="mb-4">
          <p className="text-base font-bold text-black mb-2 ml-1">Kategori Tanaman</p>
          <div className="inline-flex items-center bg-[#e6ead1] px-3 py-1.5 rounded-full shadow-sm cursor-pointer border border-black/5">
            <span className="text-[11px] font-bold text-gray-800 mr-2">Semua Tanaman</span>
            <IconChevronDown />
          </div>
        </div>

        {/* Grid Daftar Panen */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Memuat data panen...</p>
          </div>
        ) : dataPanen.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada panen tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {dataPanen.map((item) => (
              <div key={item._id} className="relative h-60 rounded-[35px] overflow-hidden shadow-lg bg-gray-200 group">
                <img 
                  src={getImageUrl(item.foto)} 
                  alt={item.nama_komoditas} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                
                {/* Recovery Tag - Overlay di top-right */}
                {item.recovery?.jenis && (
                  <div className="absolute top-3 right-3 z-20">
                    <div className={`px-3 py-1.5 rounded-full font-bold text-white text-[10px] shadow-lg flex items-center gap-1 ${
                      item.recovery.jenis === 'pakan'
                        ? 'bg-blue-600/90 backdrop-blur'
                        : 'bg-green-600/90 backdrop-blur'
                    }`}>
                      <span>{item.recovery.jenis === 'pakan' ? '🐄' : '♻️'}</span>
                      <span>{item.recovery.jenis === 'pakan' ? 'Pakan Ternak' : 'Kompos'}</span>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-3 right-3 bg-black/40 backdrop-blur-md rounded-[20px] p-4 text-white">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold">{item.nama_komoditas}</span>
                    <span className="text-[10px] opacity-80">{getMonthName(item.tanggal)}</span>
                  </div>
                  <p className="text-lg font-bold mt-1">{item.jumlah} Kg</p>
                  <p className="text-[10px] opacity-75 mt-0.5">Kualitas: {item.kualitas}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-black rounded-t-[40px] h-20 flex items-center justify-around px-2 z-50">
        
        <div className="text-2xl cursor-pointer">🏠</div>
        <div className="text-2xl cursor-pointer">➕</div>

        {/* Menu Aktif */}
        <div className="bg-[#5a7a00] rounded-3xl px-6 py-1.5 flex flex-col items-center cursor-pointer">
          <span className="text-white text-xl font-bold leading-none">👥</span>
          <span className="text-white text-[10px] font-bold uppercase tracking-wider mt-0.5">Daftar Panen</span>
        </div>
        
        <div className="text-2xl cursor-pointer">🕒</div>
        <div className="text-2xl cursor-pointer">✅</div>
      </div>

    </div>
  );
}