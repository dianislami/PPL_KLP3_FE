import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/layout/BottomNav';
import { Icon } from '@iconify/react';

interface InfoItem {
  label: string;
  value: string;
  icon: string;
}

const ICONS = {
  edit: 'mdi:pencil',
  nama: 'mdi:account-outline',
  email: 'mdi:email-outline',
  luasLahan: 'mdi:ruler-square',
  tanggal: 'mdi:calendar-outline',
  password: 'mdi:lock-reset',
  logout: 'mdi:logout',
};

const infoData: InfoItem[] = [
  { label: 'Nama Lengkap',    value: 'Budi Santoso',               icon: ICONS.nama },
  { label: 'Email',           value: 'budi.santoso@email.com',     icon: ICONS.email },
  { label: 'Luas Lahan',      value: '12 Hektar',                  icon: ICONS.luasLahan },
  { label: 'Bergabung Sejak', value: 'Januari 2024',               icon: ICONS.tanggal },
];

const statData = [
  { label: 'Total Panen',  value: '35.4 Ton', icon: '🏆' },
  { label: 'Lahan Aktif',  value: '12 Ha',    icon: '🌱' },
  { label: 'Pengiriman',   value: '48 Kali',  icon: '🚚' },
];

export default function ProfilPetani() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-6 pt-6 pb-10 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold">Profil</h1>
            <p className="text-sm opacity-80">Data Petani Anda</p>
          </div>
          <button
            onClick={() => setEditMode(e => !e)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-full transition-all active:scale-95 flex items-center gap-2"
          >
            {editMode ? (
              '✕ Batal'
            ) : (
              <>
                <Icon icon={ICONS.edit} className="text-lg" />
                <span>Edit Profil</span>
              </>
            )}
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#9aaa3f] border-4 border-white/40 flex items-center justify-center text-5xl shadow-lg mb-3">
            👨‍🌾
          </div>
          <p className="text-lg font-bold">Budi Santoso</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
            <p className="text-xs opacity-80">Petani Aktif • Aceh Besar</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl overflow-y-auto pb-28">

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-0 border-b border-gray-100 mx-4 mt-5 mb-5 bg-[#f5f7ee] rounded-2xl overflow-hidden">
          {statData.map((s, i) => (
            <div
              key={s.label}
              className={`text-center py-4 ${i !== statData.length - 1 ? 'border-r border-white' : ''}`}
            >
              <p className="text-lg"><Icon icon={s.icon} className="text-[#7a8c2e] text-lg" /></p>
              <p className="text-sm font-bold text-[#3a4e10] mt-0.5">{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="px-4 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
            Informasi Pribadi
          </p>
          <div className="flex flex-col gap-2">
            {infoData.map(item => (
              <div
                key={item.label}
                className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3"
              >
                <div className="w-9 h-9 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0">
                  <Icon icon={item.icon} className="text-[#7a8c2e] text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400">{item.label}</p>
                  {editMode ? (
                    <input
                      defaultValue={item.value}
                      className="w-full text-sm font-semibold text-gray-800 bg-white border border-[#7a8c2e]/30 rounded-lg px-2 py-1 mt-0.5 focus:outline-none focus:ring-2 focus:ring-[#7a8c2e]/30"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aksi */}
        <div className="px-4 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
            Akun
          </p>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 text-left active:scale-95 transition-all">
              <div className="w-9 h-9 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0">🔒</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Ubah Kata Sandi</p>
                <p className="text-[10px] text-gray-400">Perbarui keamanan akun Anda</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>

            <button
              onClick={() => navigate('/bantuan')}
              className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 text-left active:scale-95 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0">❓</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Bantuan & Dukungan</p>
                <p className="text-[10px] text-gray-400">FAQ dan hubungi tim kami</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-left active:scale-95 transition-all mt-1"
            >
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-base flex-shrink-0">🚪</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-600">Keluar</p>
                <p className="text-[10px] text-red-400">Logout dari akun ini</p>
              </div>
              <span className="text-red-300 text-lg">›</span>
            </button>
          </div>
        </div>

        {/* Save button when edit mode */}
        {editMode && (
          <div className="px-4 mb-4">
            <button
              onClick={() => setEditMode(false)}
              className="w-full bg-[#7a8c2e] text-white font-bold py-4 rounded-full text-base shadow-md active:scale-95 transition-all"
            >
              Simpan Perubahan
            </button>
          </div>
        )}

        <p className="text-center text-[10px] text-gray-300 pb-4">Smart Harvest v1.0.0</p>
      </div>

      <BottomNav role="petani" />
    </div>
  );
}