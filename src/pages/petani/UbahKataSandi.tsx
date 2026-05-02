import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

export default function UbahKataSandi() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kataSandiLama, setKataSandiLama]       = useState('');
  const [kataSandiBaru, setKataSandiBaru]       = useState('');
  const [konfirmasi, setKonfirmasi]             = useState('');
  const [showLama, setShowLama]                 = useState(false);
  const [showBaru, setShowBaru]                 = useState(false);
  const [showKonfirmasi, setShowKonfirmasi]     = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState('');
  const [success, setSuccess]                   = useState('');

  const kekuatan = (() => {
    if (!kataSandiBaru) return 0;
    let skor = 0;
    if (kataSandiBaru.length >= 8)            skor++;
    if (/[A-Z]/.test(kataSandiBaru))          skor++;
    if (/[0-9]/.test(kataSandiBaru))          skor++;
    if (/[^A-Za-z0-9]/.test(kataSandiBaru))   skor++;
    return skor;
  })();

  const kekuatanLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const kekuatanColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
  const kekuatanText  = ['', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-600'];

  const handleSimpan = async () => {
    setError('');
    setSuccess('');

    if (!kataSandiLama || !kataSandiBaru || !konfirmasi) {
      setError('Semua field harus diisi.');
      return;
    }
    if (kataSandiBaru.length < 8) {
      setError('Kata sandi baru minimal 8 karakter.');
      return;
    }
    if (kataSandiBaru !== konfirmasi) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      if (!user?.id) {
        setError('User tidak ditemukan');
        setLoading(false);
        return;
      }

      await authAPI.changePassword(user.id, {
        passwordLama: kataSandiLama,
        passwordBaru: kataSandiBaru,
      });

      setSuccess('Kata sandi berhasil diubah!');
      setKataSandiLama('');
      setKataSandiBaru('');
      setKonfirmasi('');
      
      setTimeout(() => navigate(-1), 1800);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-6 pb-10 text-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-white font-bold text-lg leading-none">‹</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Ubah Kata Sandi</h1>
            <p className="text-sm opacity-80">Perbarui keamanan akun Anda</p>
          </div>
        </div>

        {/* Icon illustration */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center">
            <Icon icon="mdi:shield-lock-outline" className="text-5xl text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl px-5 pt-7 pb-12 overflow-y-auto">

        {/* Alert Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
            <Icon icon="mdi:alert-circle-outline" className="text-red-500 text-xl flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Alert Success */}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-4">
            <Icon icon="mdi:check-circle-outline" className="text-green-600 text-xl flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">
          Informasi Kata Sandi
        </p>

        {/* Kata Sandi Lama */}
        <div className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#eaf0d8] text-[#7a8c2e] rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:lock-outline" className="text-lg" />
          </div>
          <input
            type={showLama ? 'text' : 'password'}
            placeholder="Kata sandi lama"
            value={kataSandiLama}
            onChange={e => setKataSandiLama(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300 text-gray-800"
          />
          <button onClick={() => setShowLama(s => !s)} className="text-gray-400 hover:text-gray-600">
            <Icon icon={showLama ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="text-xl" />
          </button>
        </div>

        {/* Kata Sandi Baru */}
        <div className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 mb-1 shadow-sm">
          <div className="w-9 h-9 bg-[#eaf0d8] text-[#7a8c2e] rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:lock-plus-outline" className="text-lg" />
          </div>
          <input
            type={showBaru ? 'text' : 'password'}
            placeholder="Kata sandi baru"
            value={kataSandiBaru}
            onChange={e => setKataSandiBaru(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300 text-gray-800"
          />
          <button onClick={() => setShowBaru(s => !s)} className="text-gray-400 hover:text-gray-600">
            <Icon icon={showBaru ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="text-xl" />
          </button>
        </div>

        {/* Indikator kekuatan */}
        {kataSandiBaru.length > 0 && (
          <div className="px-1 mb-3">
            <div className="flex gap-1.5 mt-2 mb-1">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    i <= kekuatan ? kekuatanColor[kekuatan] : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs font-semibold ${kekuatanText[kekuatan]}`}>
              {kekuatanLabel[kekuatan]}
            </p>
          </div>
        )}

        {/* Konfirmasi */}
        <div className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 mb-2 shadow-sm">
          <div className="w-9 h-9 bg-[#eaf0d8] text-[#7a8c2e] rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:lock-check-outline" className="text-lg" />
          </div>
          <input
            type={showKonfirmasi ? 'text' : 'password'}
            placeholder="Ulangi kata sandi baru"
            value={konfirmasi}
            onChange={e => setKonfirmasi(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300 text-gray-800"
          />
          <button onClick={() => setShowKonfirmasi(s => !s)} className="text-gray-400 hover:text-gray-600">
            <Icon icon={showKonfirmasi ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="text-xl" />
          </button>
        </div>

        {/* Match indicator */}
        {konfirmasi.length > 0 && (
          <div className="flex items-center gap-1.5 px-1 mb-4">
            <Icon
              icon={kataSandiBaru === konfirmasi ? 'mdi:check-circle' : 'mdi:close-circle'}
              className={`text-base ${kataSandiBaru === konfirmasi ? 'text-green-500' : 'text-red-400'}`}
            />
            <p className={`text-xs font-medium ${kataSandiBaru === konfirmasi ? 'text-green-600' : 'text-red-500'}`}>
              {kataSandiBaru === konfirmasi ? 'Kata sandi cocok' : 'Kata sandi tidak cocok'}
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-[#f0f5e4] rounded-2xl px-4 py-4 mb-6">
          <div className="flex items-start gap-1.5">
            <Icon icon="mdi:lightbulb-on-outline" className="text-yellow-500 text-lg mb-2" />
            <p className="text-sm font-bold text-yellow-700 mb-3">Tips Membuat Kata Sandi Kuat</p>
          </div>
    
          {[
            'Minimal 8 karakter',
            'Kombinasi huruf besar & kecil',
            'Mengandung angka',
            'Mengandung karakter khusus (!@#$)',
          ].map(tip => (
            <div key={tip} className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7a8c2e] flex-shrink-0" />
              <p className="text-xs text-[#5a6e1a]">{tip}</p>
            </div>
          ))}
        </div>

        {/* Simpan Button */}
        <button
          onClick={handleSimpan}
          disabled={loading}
          className="w-full bg-[#7a8c2e] hover:bg-[#8a9c3e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full text-base transition-all shadow-md active:scale-95 mb-3"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Icon icon="mdi:loading" className="text-xl animate-spin" />
              Menyimpan...
            </span>
          ) : (
            'Simpan Perubahan'
          )}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full text-gray-400 font-semibold py-3 text-sm active:scale-95 transition-all"
        >
          Batal
        </button>
      </div>
    </div>
  );
}