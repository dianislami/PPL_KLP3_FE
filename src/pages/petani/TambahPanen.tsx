import { useState } from 'react';
import { useRef } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { panenAPI } from '../../services/api';
import { useEffect } from 'react';

export default function TambahPanen() {
  const [tanaman, setTanaman] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [kualitas, setKualitas] = useState('');
  const [status, setStatus] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();
  const dateRef = useRef<HTMLInputElement>(null);

  const [panenList, setPanenList] = useState<any[]>([]);

  useEffect(() => {
    const fetchPanen = async () => {
      try {
        const response = await panenAPI.getAll();
        const userPanen = response.data.filter((item: any) => item.user_id?._id === user?.id);
        setPanenList(userPanen);
      } catch (error) {
        console.error('Failed to fetch panen:', error);
      }
    };

    if (user?.id) {
      fetchPanen();
    }
  }, [user?.id]);

  const ICONS = {
    tanaman: 'mdi:sprout',                 
    jumlah: 'mdi:scale-balance',           
    tanggal: 'mdi:calendar-range-outline', 
    deskripsi: 'mdi:card-text-outline',    
    foto: 'mdi:camera-outline',            
  };

  const handleSimpan = async () => {
    setError('');
    setSuccess('');

    if (!tanaman || !jumlah || !tanggal || !kualitas || !status) {
      setError('Semua field harus diisi');
      return;
    }

    setLoading(true);
    try {
      // Persiapkan FormData untuk upload gambar
      const formData = new FormData();
      formData.append('user_id', user?.id || '');
      formData.append('nama_komoditas', tanaman);
      formData.append('jumlah', jumlah);
      formData.append('kualitas', kualitas);
      formData.append('status', status);
      formData.append('tanggal', new Date(tanggal).toISOString());
      formData.append('deskripsi', deskripsi);
      
      // Jika ada gambar, append file
      if (gambar) {
        formData.append('gambar', gambar);
      }

      // Kirim dengan Content-Type: multipart/form-data
      const response = await fetch('http://localhost:5000/api/panen', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal menambahkan panen');
      }

      setSuccess('Panen berhasil ditambahkan!');
      setTimeout(() => {
        navigate('/dashboard-petani');
      }, 1500);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Gagal menambahkan panen');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold">Tambah Data</h1>
            <p className="text-sm opacity-80">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button 
            onClick={() => navigate('/riwayat-panen')}
            className="flex gap-2 items-center text-xs bg-white/20 rounded-full px-3 py-1"
          >
            Riwayat
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Total Panen</p>
          <p className="text-xs font-bold text-gray-800">{loading ? '--' : panenList.length} Item</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400">Total Jumlah</p>
          <p className="text-xs font-bold text-gray-800">{loading ? '--' : (panenList.reduce((sum, item) => sum + item.jumlah, 0) / 1000).toFixed(1)} Ton</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Status</p>
          <p className="text-xs font-bold text-[#7a8c2e]">Aktif ↗</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-4 pt-8 px-5 pb-28 overflow-y-auto">
        <h2 className="text-base font-semibold text-gray-500 mb-4">Input Hasil Panen</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 mb-4">
            {success}
          </div>
        )}

        {/* Nama Tanaman */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            <Icon icon={ICONS.tanaman} />
          </div>
          <input
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300"
            placeholder="Nama Tanaman (komoditas)"
            value={tanaman}
            onChange={e => setTanaman(e.target.value)}
          />
        </div>

        {/* Jumlah Panen */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            <Icon icon={ICONS.jumlah} />
          </div>
          <input
            type="number"
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300"
            placeholder="Jumlah Panen (Kg)"
            value={jumlah}
            onChange={e => setJumlah(e.target.value)}
          />
        </div>

        {/* Deskripsi Panen */}
        <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
            <Icon icon={ICONS.deskripsi} />
          </div>
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
            <div 
              onClick={() => dateRef.current?.showPicker()}
              className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-base flex-shrink-0"
            >
              <Icon icon={ICONS.tanggal} />
            </div>
            <input
              ref={dateRef}
              type="date"
              className="flex-1 text-xs bg-transparent outline-none text-gray-400"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 bg-white border-2 border-dashed border-[#c8d4a0] rounded-2xl px-3 py-3 cursor-pointer">
            <div className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-base flex-shrink-0">
              <Icon icon={ICONS.foto} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">{gambar ? gambar.name.slice(0, 10) + '…' : 'Foto hasil panen'}</p>
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
          disabled={loading}
          className="w-full bg-[#7a8c2e] hover:bg-[#6a7a26] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-base transition-all shadow-md mb-3"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>

        <p className="text-center text-xs text-[#7a8c2e] underline cursor-pointer">Lihat panduan kualitas panen</p>
      </div>

      <BottomNav role="petani" />
    </div>
  );
}