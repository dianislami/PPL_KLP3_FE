import BottomNav from '../../components/layout/BottomNav';

const IconCheckCircle = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HasilMatching() {
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

      {/* Title Sub-Header */}
      <div className="px-5 mt-4">
        <h2 className="text-black font-bold text-lg leading-tight">
          Hasil Matching Permintaan #TKR-AGR-0411
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 mt-4 z-10">
        <div className="bg-white rounded-[30px] p-6 shadow-lg mb-10">
          <h3 className="font-bold text-gray-800 mb-6 text-base">Detail Pasokan Terkonfirmasi</h3>

          {/* Stepper / Process Section */}
          <div className="relative mb-6">
           
            <div className="absolute left-[20px] top-[40px] bottom-[40px] border-l-2 border-dashed border-[#7a8c2e]"></div>
            
            {/* Item 1: Total Pasokan */}
            <div className="flex items-center gap-4 mb-8">
              <div className="z-10 bg-white rounded-full"><IconCheckCircle /></div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Total Pasokan Terbanyak</p>
                <p className="text-gray-500 text-xs">E.g: 3.2 Ton</p>
              </div>
            </div>

            {/* Item 2: Rata-rata Kualitas Box */}
            <div className="flex items-start gap-4">
              <div className="z-10 bg-white rounded-full mt-1"><IconCheckCircle /></div>
              <div className="flex-1 bg-[#e6ead1] rounded-2xl p-4 min-h-[120px]">
                <p className="font-bold text-gray-800 text-sm border-b border-gray-400/30 pb-1 mb-2">Rata-rata Kualitas</p>
                <p className="text-gray-500 text-xs font-semibold italic">Detail List</p>
              </div>
            </div>
          </div>

          {/* Petani Info Section */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Petani A */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img src="https://images.pexels.com/photos/2169500/pexels-photo-2169500.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Petani" className="w-full h-full object-cover" />
              </div>
              <div className="text-[10px] leading-tight">
                <p className="font-bold text-sm">Petani A</p>
                <p className="text-gray-600">kualitas: Grade A</p>
                <p className="text-gray-600">Jumlah: 2.1 Ton</p>
                <p className="text-gray-600">Lokasi: Aceh Besar</p>
              </div>
            </div>
            {/* Petani B */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img src="https://images.pexels.com/photos/2560900/pexels-photo-2560900.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Petani" className="w-full h-full object-cover" />
              </div>
              <div className="text-[10px] leading-tight">
                <p className="font-bold text-sm">Petani B</p>
                <p className="text-gray-600">kualitas: Grade Super</p>
                <p className="text-gray-600">Jumlah: 1.1 Ton</p>
                <p className="text-gray-600">Lokasi: Pidie</p>
              </div>
            </div>
          </div>

          {/* Rekap Biaya Section */}
          <div className="flex justify-between items-end">
             <h4 className="font-bold text-gray-800 text-base mb-4">Rekap Biaya</h4>
             
             {/* Estimasi Box */}
             <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm w-3/5">
                <p className="text-[15px] font-bold text-center mb-2">Estimasi Biaya Transaksi</p>
                <div className="space-y-1 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga Dasar</span>
                    <span className="font-bold">IDR 300/Kg</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span className="text-gray-600">Biaya Logistik</span>
                    <span className="font-bold">IDR 200/Kg</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold">Total Pembayaran</span>
                    <span className="font-bold">IDR 500/Kg</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-10">
            <p className="text-[10px] text-gray-400">Data Anda akan divalidasi oleh sistem</p>
            <button className="text-[12px] font-bold border-b border-gray-800 text-gray-800 mt-1">
              Klik untuk bantuan
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}

      <BottomNav role="pedagang" />

    </div>
  );
}