const IconChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

export default function DaftarPanen() {
  const dataPanen = [
    {
      id: 1,
      nama: "Wortel",
      bulan: "Januari",
      jumlah: "12.300 Kg",
      img: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 2,
      nama: "Tomat Merah",
      bulan: "April",
      jumlah: "3.00 Kg",
      img: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 3,
      nama: "Jagung",
      bulan: "Februari",
      jumlah: "3.400 Kg",
      img: "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 4,
      nama: "Kentang",
      bulan: "Maret",
      jumlah: "5.200 Kg",
      img: "https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=1200"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#D1D1D1] flex flex-col font-sans pb-28 relative">
      
      {/* Header Section */}
      <div className="bg-[#7a8c2e] px-5 pt-10 pb-12 text-white relative flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Hallo, Seller</h1>
            <p className="text-sm opacity-80 mb-4">Minggu, 11 April 2026</p>
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
        <div className="grid grid-cols-2 gap-4">
          {dataPanen.map((item) => (
            <div key={item.id} className="relative h-60 rounded-[35px] overflow-hidden shadow-lg bg-gray-200">
              <img 
                src={item.img} 
                alt={item.nama} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-4 left-3 right-3 bg-black/40 backdrop-blur-md rounded-[20px] p-4 text-white">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold">{item.nama}</span>
                  <span className="text-[10px] opacity-80">{item.bulan}</span>
                </div>
                <p className="text-lg font-bold mt-1">{item.jumlah}</p>
              </div>
            </div>
          ))}
        </div>
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