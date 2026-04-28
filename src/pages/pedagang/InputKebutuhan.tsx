import { useState } from 'react';

// buat komponen Icon kecil di sini supaya kodenya rapi dan tidak perlu instal library
const IconBasket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/><path d="M5 9h14"/><path d="M5 21h14a2 2 0 0 0 2-2V9H3v10a2 2 0 0 0 2 2Z"/><path d="m9 14 2 2 4-4"/></svg>
);

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
);

const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

export default function InputPermintaan() {
  const [kategori, setKategori] = useState('Semua Tanaman');

  return (
    <div className="w-full min-h-screen bg-[#D1D1D1] flex flex-col font-sans">
      
      {/* Header Section (Warna hijau zaitun seperti temanmu) */}
      <div className="bg-[#7a8c2e] px-5 pt-10 pb-12 text-white relative">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold italic">Hallo, Seller</h1>
            <p className="text-sm opacity-80 mb-4">Minggu, 11 April 2026</p>
          </div>
        </div>
        
        {/* Alamat dengan Emoji Lokasi (📍) biar simpel seperti cara temanmu */}
        <div className="flex items-start gap-2">
          <span className="text-lg">📍</span>
          <div className="text-[11px]">
            <p className="font-bold">CV. Hasil Bumi Sejahtera</p>
            <p className="opacity-90 leading-tight">Alamat: Jl. Teuku Umar No. 10, Banda Aceh</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 px-5 -mt-6 z-10">
        <h2 className="text-black font-bold text-lg mb-4">Input Permintaan Komoditas</h2>
        
        {/* White Form Card */}
        <div className="bg-white rounded-[30px] p-6 shadow-lg mb-28">
          <h3 className="font-bold text-gray-800 mb-6 text-sm">Formulir Permintaan Komoditas</h3>

          {/* Input Nama Komoditas */}
          <div className="mb-4">
            <label className="text-[11px] text-gray-500 font-bold ml-1 mb-1 block">
              Pilih Nama Komoditas:
            </label>
            <div className="flex items-center bg-[#e6ead1] rounded-2xl px-4 py-3 text-gray-600">
              <IconBasket />
              <input 
                type="text" 
                placeholder="Contoh: Cabai Merah"
                className="bg-transparent outline-none text-sm w-full ml-3 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Input Jumlah */}
          <div className="mb-4">
            <label className="text-[11px] text-gray-500 font-bold ml-1 mb-1 block">
              Jumlah (Kg)
            </label>
            <div className="flex items-center bg-[#e6ead1] rounded-2xl px-4 py-3 text-gray-600">
              <IconBasket />
              <input 
                type="number" 
                placeholder="Contoh: 200"
                className="bg-transparent outline-none text-sm w-full ml-3 placeholder-gray-500"
              />
              <span className="font-bold text-sm ml-2">Kg</span>
            </div>
          </div>

          {/* Input Tanggal Panen */}
          <div className="mb-5">
            <div className="flex items-center bg-[#e6ead1] rounded-2xl px-4 py-3 text-gray-600">
              <IconCalendar />
              <input 
                type="text" 
                placeholder="Tanggal Panen"
                onFocus={(e) => (e.target.type = 'date')}
                className="bg-transparent outline-none text-sm w-full ml-3 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Dropdown Row */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex justify-between items-center bg-[#9aaa3f] text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
              <span>Kualitas</span>
              <div className="bg-black/20 rounded-full p-0.5"><IconChevronDown /></div>
            </div>
            <div className="flex justify-between items-center bg-[#9aaa3f] text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
              <span>Status</span>
              <div className="bg-black/20 rounded-full p-0.5"><IconChevronDown /></div>
            </div>
          </div>

          {/* Ringkasan Box */}
          <div className="bg-[#e6ead1] border border-[#7a8c2e] rounded-2xl p-4 mb-6">
            <h4 className="font-bold text-gray-800 text-sm">Ringkasan Permintaan</h4>
            <p className="text-gray-600 text-[13px]">Cabai Merah, 200 Kg, Grade A</p>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-[#9aaa3f] text-white py-4 rounded-3xl font-bold text-lg shadow-md hover:bg-[#899935] active:scale-95 transition-all">
            Ajukan Permintaan Beli
          </button>

          <div className="text-center mt-6">
            <p className="text-[10px] text-gray-400">Data Anda akan divalidasi oleh sistem</p>
            <button className="text-[12px] font-bold border-b border-gray-800 text-gray-800 mt-1">
              Klik untuk bantuan
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Hitam seperti di gambar) */}
      <div className="fixed bottom-0 w-full bg-black rounded-t-[40px] h-20 flex items-center justify-around px-2 z-50">
        <div className="text-2xl opacity-50 grayscale">🏠</div>
        
        {/* Tombol Tambah yang Aktif */}
        <div className="bg-[#5a7a00] rounded-3xl px-6 py-1 flex flex-col items-center">
          <span className="text-white text-xl font-bold">+</span>
          <span className="text-white text-[10px] font-bold uppercase tracking-wider">Tambah</span>
        </div>

        <div className="text-2xl opacity-50 grayscale">👤</div>
        <div className="text-2xl opacity-50 grayscale">🕒</div>
        <div className="text-2xl opacity-50 grayscale">✅</div>
      </div>
    </div>
  );
}