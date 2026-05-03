import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/layout/BottomNav';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const ICONS = {
  total: 'mdi:store-outline',
  panen: 'mdi:shopping-bag-outline',
  status: 'mdi:account-check',
  edit: 'mdi:pencil',
  nama: 'mdi:account-outline',
  email: 'mdi:email-outline',
  role: 'mdi:account-badge-outline',
  tanggal: 'mdi:calendar-outline',
  password: 'mdi:password-reset',
  faq: 'mdi:question-mark-circle-outline',
  logout: 'mdi:logout',
};

export default function ProfilPedagang() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);

  const [editData, setEditData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  const joinDateFormatted = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Tanggal tidak tersedia';

  

  const handleEditChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveMessage({ type: '', text: '' });

    try {
      if (!editData.nama.trim()) {
        setSaveMessage({ type: 'error', text: 'Nama tidak boleh kosong' });
        setSaveLoading(false);
        return;
      }

      if (!editData.email.trim()) {
        setSaveMessage({ type: 'error', text: 'Email tidak boleh kosong' });
        setSaveLoading(false);
        return;
      }

      if (user?.id) {
        await authAPI.updateUser(user.id, {
          nama: editData.nama,
          email: editData.email,
        });

        updateUser({
          nama: editData.nama,
          email: editData.email,
        });
      }

      setSaveMessage({ type: 'success', text: 'Perubahan berhasil disimpan!' });
      setTimeout(() => {
        setEditMode(false);
        setSaveMessage({ type: '', text: '' });
      }, 1500);
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage({ type: 'error', text: 'Gagal menyimpan perubahan' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-6 pt-6 pb-10 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold">Profil</h1>
            <p className="text-sm opacity-80">Data Pedagang Anda</p>
          </div>
          <button
            onClick={() => {
              setEditMode(!editMode);
              if (editMode) {
                setEditData({ nama: user?.nama || '', email: user?.email || '' });
              }
            }}
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
            🏪
          </div>
          <p className="text-lg font-bold">{user?.nama || 'Pedagang'}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
            <p className="text-xs opacity-80">Pedagang Aktif</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl overflow-y-auto pb-28">

        {/* Info Cards - Editable */}
        <div className="px-4 my-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
            Informasi Pribadi
          </p>

          {/* Save Message */}
          {saveMessage.text && (
            <div className={`rounded-lg p-3 text-sm mb-4 ${
              saveMessage.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {saveMessage.text}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {/* Nama Lengkap */}
            <div className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0">
                <Icon icon={ICONS.nama} className="text-[#7a8c2e] text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400">Nama Lengkap</p>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.nama}
                    onChange={(e) => handleEditChange('nama', e.target.value)}
                    className="w-full text-sm font-semibold text-gray-800 bg-white border border-[#7a8c2e]/30 rounded-lg px-2 py-1 mt-0.5 focus:outline-none focus:ring-2 focus:ring-[#7a8c2e]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-800">{user?.nama || 'N/A'}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0">
                <Icon icon={ICONS.email} className="text-[#7a8c2e] text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400">Email</p>
                {editMode ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="w-full text-sm font-semibold text-gray-800 bg-white border border-[#7a8c2e]/30 rounded-lg px-2 py-1 mt-0.5 focus:outline-none focus:ring-2 focus:ring-[#7a8c2e]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.email || 'N/A'}</p>
                )}
              </div>
            </div>

            {/* Role (Read-only) */}
            <div className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 opacity-75">
              <div className="w-9 h-9 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0">
                <Icon icon={ICONS.role} className="text-[#7a8c2e] text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400">Role</p>
                <p className="text-sm font-semibold text-gray-800">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}</p>
              </div>
            </div>

            {/* Bergabung Sejak (Read-only) */}
            <div className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 opacity-75">
              <div className="w-9 h-9 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0">
                <Icon icon={ICONS.tanggal} className="text-[#7a8c2e] text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400">Bergabung Sejak</p>
                <p className="text-sm font-semibold text-gray-800">{joinDateFormatted}</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {editMode && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="flex-1 bg-[#7a8c2e] hover:bg-[#6a7a26] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all"
              >
                {saveLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          )}
        </div>

        {/* Aksi */}
        <div className="px-4 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
            Akun
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/ubah-kata-sandi')}
              className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 text-left active:scale-95 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0">
                <Icon icon={ICONS.password} className="text-[#7a8c2e] text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Ubah Kata Sandi</p>
                <p className="text-[10px] text-gray-400">Perbarui keamanan akun Anda</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-left active:scale-95 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-base flex-shrink-0">
                <Icon icon={ICONS.logout} className="text-red-600 text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-600">Keluar</p>
                <p className="text-[10px] text-red-500">Logout dari akun Anda</p>
              </div>
              <span className="text-red-300 text-lg">›</span>
            </button>
          </div>
        </div>

      </div>

      <BottomNav role="pedagang" />
    </div>
  );
}
