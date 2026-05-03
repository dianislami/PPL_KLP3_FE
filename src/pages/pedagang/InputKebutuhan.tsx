import { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import { permintaanAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const IconBasket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/><path d="M5 9h14"/><path d="M5 21h14a2 2 0 0 0 2-2V9H3v10a2 2 0 0 0 2 2Z"/></svg>
);

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
);

const IconChevron = ({ isOpen }: { isOpen: boolean }) => (
  <div className={`bg-black/20 rounded-full p-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  </div>
);

export default function InputKebutuhan() {
  const { user } = useAuth();
  const [showKualitas, setShowKualitas] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_komoditas: '',
    jumlah: '',
    tanggal: '',
    kualitas: 'Premium',
    status: 'Tersedia',
  });

  const listKualitas = ['Premium', 'Standar', 'Ekonomis', 'Rusak'];
  const listStatus   = ['Tersedia', 'Sebagian Terjual', 'Sudah Dialokasikan'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectKualitas = (value: string) => {
    handleInputChange('kualitas', value);
    setShowKualitas(false);
  };

  const handleSelectStatus = (value: string) => {
    handleInputChange('status', value);
    setShowStatus(false);
  };

  const handleSubmit = async () => {
    if (!formData.nama_komoditas || !formData.jumlah || !formData.tanggal || !user?.id) {
      alert('Mohon isi semua field');
      return;
    }
    try {
      setLoading(true);
      await permintaanAPI.create({
        user_id: user.id,
        nama_komoditas: formData.nama_komoditas,
        jumlah: parseInt(formData.jumlah),
        tanggal: formData.tanggal,
        kualitas: formData.kualitas,
        status: formData.status,
      });
      alert('Permintaan berhasil diajukan!');
      setFormData({ nama_komoditas: '', jumlah: '', tanggal: '', kualitas: 'Premium', status: 'Tersedia' });
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Gagal mengajukan permintaan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header — sama persis dengan halaman lain */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold">Input Kebutuhan</h1>
            <p className="text-sm opacity-80">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-xl">
            🏪
          </div>
        </div>

        {/* Info toko */}
        <div className="flex items-center gap-2 bg-white/15 rounded-2xl px-4 py-2.5">
          <span className="text-base">📍</span>
          <div>
            <p className="text-xs font-bold text-white">CV. Hasil Bumi Sejahtera</p>
            <p className="text-[11px] text-white/75">Jl. Teuku Umar No. 10, Banda Aceh</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Produk Tersedia</p>
          <p className="text-xs font-bold text-gray-800">6 Produk</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400">Total Nilai</p>
          <p className="text-xs font-bold text-gray-800">Rp 145Jt</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Pasar</p>
          <p className="text-xs font-bold text-[#7a8c2e]">Stabil ↗</p>
        </div>
      </div>

      {/* Content — white rounded card area */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-6 px-5 pb-28 overflow-y-auto">

        <h2 className="text-base font-bold text-gray-800 mb-4">Input Permintaan Komoditas</h2>

        {/* Form Card — style tidak diubah */}
        <div className="bg-white rounded-[30px] p-6 shadow-lg mb-6 border border-gray-100 relative">
          <h3 className="font-bold text-gray-800 mb-6 text-sm">Formulir Permintaan Komoditas</h3>

          <div className="mb-4">
            <label className="text-[11px] text-gray-500 font-bold ml-1 mb-1 block">Pilih Nama Komoditas:</label>
            <div className="flex items-center bg-[#e6ead1] rounded-2xl px-4 py-3 text-gray-600">
              <IconBasket />
              <input
                type="text"
                placeholder="Contoh: Cabai Merah"
                value={formData.nama_komoditas}
                onChange={e => handleInputChange('nama_komoditas', e.target.value)}
                className="bg-transparent outline-none text-sm w-full ml-3 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[11px] text-gray-500 font-bold ml-1 mb-1 block">Jumlah (Kg)</label>
            <div className="flex items-center bg-[#e6ead1] rounded-2xl px-4 py-3 text-gray-600">
              <IconBasket />
              <input
                type="number"
                placeholder="Contoh: 200"
                value={formData.jumlah}
                onChange={e => handleInputChange('jumlah', e.target.value)}
                className="bg-transparent outline-none text-sm w-full ml-3 placeholder-gray-500"
              />
              <span className="font-bold text-sm ml-2">Kg</span>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[11px] text-gray-500 font-bold ml-1 mb-1 block">Tanggal Panen:</label>
            <div className="flex items-center bg-[#e6ead1] rounded-2xl px-4 py-3 text-gray-600">
              <IconCalendar />
              <input
                type="date"
                value={formData.tanggal}
                onChange={e => handleInputChange('tanggal', e.target.value)}
                className="bg-transparent outline-none text-sm w-full ml-3 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6 relative">
            <div className="relative">
              <div
                onClick={() => { setShowKualitas(!showKualitas); setShowStatus(false); }}
                className="flex justify-between items-center bg-[#9aaa3f] text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
              >
                <span>{formData.kualitas}</span>
                <IconChevron isOpen={showKualitas} />
              </div>
              {showKualitas && (
                <div className="absolute top-[100%] left-0 w-full bg-[#e6ead1] border border-[#9aaa3f] mt-1 rounded-xl overflow-hidden z-20 shadow-lg">
                  {listKualitas.map(item => (
                    <div
                      key={item}
                      onClick={() => handleSelectKualitas(item)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-[#9aaa3f] hover:text-white border-b border-[#9aaa3f]/30 last:border-0 cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div
                onClick={() => { setShowStatus(!showStatus); setShowKualitas(false); }}
                className="flex justify-between items-center bg-[#9aaa3f] text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
              >
                <span>{formData.status}</span>
                <IconChevron isOpen={showStatus} />
              </div>
              {showStatus && (
                <div className="absolute top-[100%] left-0 w-full bg-[#e6ead1] border border-[#9aaa3f] mt-1 rounded-xl overflow-hidden z-20 shadow-lg">
                  {listStatus.map(item => (
                    <div
                      key={item}
                      onClick={() => handleSelectStatus(item)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-[#9aaa3f] hover:text-white border-b border-[#9aaa3f]/30 last:border-0 cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#e6ead1] border border-[#7a8c2e] rounded-2xl p-4 mb-6">
            <h4 className="font-bold text-gray-800 text-sm">Ringkasan Permintaan</h4>
            <p className="text-gray-600 text-[13px]">
              {formData.nama_komoditas || 'Pilih Komoditas'}, {formData.jumlah || '0'} Kg, {formData.kualitas}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#9aaa3f] text-white py-4 rounded-3xl font-bold text-lg shadow-md hover:bg-[#899935] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mengajukan...' : 'Ajukan Permintaan Beli'}
          </button>

          <div className="text-center mt-6">
            <p className="text-[10px] text-gray-400">Data Anda akan divalidasi oleh sistem</p>
            <button className="text-[12px] font-bold border-b border-gray-800 text-gray-800 mt-1">
              Klik untuk bantuan
            </button>
          </div>
        </div>
      </div>

      <BottomNav role="pedagang" />
    </div>
  );
}