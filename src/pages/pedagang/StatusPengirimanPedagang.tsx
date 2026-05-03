import BottomNav from '../../components/layout/BottomNav';

const IconCheckStatus = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const IconClockStatus = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#9E9E9E"/>
    <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function StatusPengiriman() {
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

      {/* Sub-Header Title */}
      <div className="px-5 mt-4">
        <h2 className="text-black font-bold text-lg leading-tight">
          Status Pengiriman #TKR-AGR-0411
        </h2>
      </div>

      {/* Main Content - White Card */}
      <div className="flex-1 px-5 mt-4 z-10">
        <div className="bg-white rounded-[30px] p-6 shadow-lg mb-10">
          <h3 className="font-bold text-gray-800 mb-8 text-base">Gayo Coffee Purchase Request</h3>

          {/* Stepper / Timeline Section */}
          <div className="relative space-y-8 ml-2">
            
            {/* Step 1: Permintaan Diajukan */}
            <div className="flex items-start gap-4 relative">
              
              <div className="absolute left-[15px] top-[32px] bottom-[-32px] border-l-2 border-dashed border-[#4CAF50]"></div>
              <IconCheckStatus />
              <div>
                <p className="font-bold text-gray-800 text-sm">Permintaan Diajukan</p>
                <p className="text-gray-500 text-xs">Menunggu Validasi</p>
              </div>
            </div>

            {/* Step 2: Sedang Diproses */}
            <div className="flex items-start gap-4 relative">
              
              <div className="absolute left-[15px] top-[32px] bottom-[-32px] border-l-2 border-dashed border-[#4CAF50]"></div>
              <IconCheckStatus />
              <div>
                <p className="font-bold text-gray-800 text-sm">Sedang Diproses (Mathing)</p>
              </div>
            </div>

            {/* Step 3: Pasokan Terkonfirmasi (Sedang Berjalan/Pending) */}
            <div className="flex items-start gap-4 relative">
              
              <div className="absolute left-[15px] top-[32px] bottom-[-32px] border-l-2 border-dashed border-gray-400"></div>
              <IconClockStatus />
              <div>
                <p className="font-bold text-gray-800 text-sm">Pasokan Terkonfirmasi (Matched)</p>
                <p className="text-gray-500 text-xs leading-tight">Menemukan 2 Petani Cocok, Verifikasi Stok</p>
              </div>
            </div>

            {/* Step 4: Siap Dikirim (Belum Selesai) */}
            <div className="flex items-start gap-4">
              <IconClockStatus />
              <div>
                <p className="font-bold text-gray-800 text-sm">Siap Dikirim</p>
                <p className="text-gray-500 text-xs">Menunggu Pengambilan Kurir</p>
              </div>
            </div>

          </div>

          {/* Footer Info inside Card */}
          <div className="text-center mt-12">
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