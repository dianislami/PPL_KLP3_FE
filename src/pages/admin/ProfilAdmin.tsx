import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const ICONS = {
  edit: 'mdi:pencil',
  email: 'mdi:email-outline',
  password: 'mdi:password-reset',
  logout: 'mdi:logout',
  eye: 'mdi:eye',
  eyeOff: 'mdi:eye-off',
};

export default function ProfilAdmin() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    email: user?.email || "",
  });
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  const handleEditChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEmail = async () => {
    setSaveLoading(true);
    setSaveMessage({ type: '', text: '' });

    try {
      if (!editData.email.trim()) {
        setSaveMessage({ type: 'error', text: 'Email tidak boleh kosong' });
        setSaveLoading(false);
        return;
      }

      if (user?.id) {
        await authAPI.updateUser(user.id, {
          nama: user.nama,
          email: editData.email,
        });

        updateUser({
          email: editData.email,
        });
      }

      setSaveMessage({ type: 'success', text: 'Email berhasil diperbarui!' });
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

  const handleChangePassword = async () => {
    setSaveLoading(true);
    setSaveMessage({ type: '', text: '' });

    try {
      // Validasi
      if (!passwordData.oldPassword.trim()) {
        setSaveMessage({ type: 'error', text: 'Kata sandi lama tidak boleh kosong' });
        setSaveLoading(false);
        return;
      }

      if (!passwordData.newPassword.trim()) {
        setSaveMessage({ type: 'error', text: 'Kata sandi baru tidak boleh kosong' });
        setSaveLoading(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setSaveMessage({ type: 'error', text: 'Kata sandi minimal 6 karakter' });
        setSaveLoading(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setSaveMessage({ type: 'error', text: 'Kata sandi baru tidak cocok' });
        setSaveLoading(false);
        return;
      }

      if (user?.id) {
        await authAPI.changePassword(user.id, {
          passwordLama: passwordData.oldPassword,
          passwordBaru: passwordData.newPassword,
        });
      }

      setSaveMessage({ type: 'success', text: 'Kata sandi berhasil diubah!' });
      setTimeout(() => {
        setChangePasswordMode(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setSaveMessage({ type: '', text: '' });
      }, 1500);
    } catch (error: any) {
      console.error('Password change error:', error);
      setSaveMessage({ type: 'error', text: error.response?.data?.message || 'Gagal mengubah kata sandi' });
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
            <p className="text-sm opacity-80">Data Admin Anda</p>
          </div>
          <button
            onClick={() => {
              setEditMode(!editMode);
              if (editMode) {
                setEditData({
                  email: user?.email || "",
                });
              }
            }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-full transition-all active:scale-95 flex items-center gap-2"
          >
            {editMode ? (
              "✕ Batal"
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
            🛡️
          </div>
          <p className="text-lg font-bold">{user?.nama || "Admin"}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
            <p className="text-xs opacity-80">Admin Aktif</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl overflow-y-auto pb-28">
        {/* Info Cards - Editable */}
        <div className="px-4 mb-6 mt-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
            Informasi Akun
          </p>

          {/* Save Message */}
          {saveMessage.text && (
            <div
              className={`rounded-lg p-3 text-sm mb-4 ${
                saveMessage.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {saveMessage.text}
            </div>
          )}

          <div className="flex flex-col gap-2">
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
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    className="w-full text-sm font-semibold text-gray-800 bg-white border border-[#7a8c2e]/30 rounded-lg px-2 py-1 mt-0.5 focus:outline-none focus:ring-2 focus:ring-[#7a8c2e]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.email || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Save Button - positioned below edit section */}
          {editMode && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveEmail}
                disabled={saveLoading}
                className="flex-1 bg-[#7a8c2e] hover:bg-[#6a7a26] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all"
              >
                {saveLoading ? "Menyimpan..." : "Simpan Perubahan"}
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
            {/* Change Password Button */}
            <button
              onClick={() => setChangePasswordMode(!changePasswordMode)}
              className="flex items-center gap-3 bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-3 text-left active:scale-95 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0">
                <Icon
                  icon={ICONS.password}
                  className="text-[#7a8c2e] text-lg"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Ubah Kata Sandi
                </p>
                <p className="text-[10px] text-gray-400">
                  Perbarui keamanan akun Anda
                </p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>

            {/* Change Password Form */}
            {changePasswordMode && (
              <div className="bg-[#f9faf5] border border-gray-100 rounded-2xl px-4 py-4 flex flex-col gap-3">
                {/* Old Password */}
                <div className="relative">
                  <p className="text-[10px] text-gray-400 mb-1">Kata Sandi Lama</p>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                      placeholder="Masukkan kata sandi lama"
                      className="w-full text-sm font-semibold text-gray-800 bg-white border border-[#7a8c2e]/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a8c2e] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icon icon={showPasswords.old ? ICONS.eye : ICONS.eyeOff} className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <p className="text-[10px] text-gray-400 mb-1">Kata Sandi Baru</p>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      placeholder="Masukkan kata sandi baru (min. 6 karakter)"
                      className="w-full text-sm font-semibold text-gray-800 bg-white border border-[#7a8c2e]/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a8c2e] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icon icon={showPasswords.new ? ICONS.eye : ICONS.eyeOff} className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <p className="text-[10px] text-gray-400 mb-1">Konfirmasi Kata Sandi Baru</p>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      placeholder="Konfirmasi kata sandi baru"
                      className="w-full text-sm font-semibold text-gray-800 bg-white border border-[#7a8c2e]/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a8c2e] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icon icon={showPasswords.confirm ? ICONS.eye : ICONS.eyeOff} className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={saveLoading}
                    className="flex-1 bg-[#7a8c2e] hover:bg-[#6a7a26] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg text-sm transition-all"
                  >
                    {saveLoading ? "Mengubah..." : "Ubah Kata Sandi"}
                  </button>
                  <button
                    onClick={() => {
                      setChangePasswordMode(false);
                      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 rounded-lg text-sm transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-left active:scale-95 transition-all mt-1"
            >
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-base flex-shrink-0">
                <Icon icon={ICONS.logout} className="text-red-600 text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-600">Keluar</p>
                <p className="text-[10px] text-red-400">Logout dari akun ini</p>
              </div>
              <span className="text-red-300 text-lg">›</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-300 pb-4">
          Smart Harvest v1.0.0
        </p>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-6 left-4 right-4 bg-black rounded-full flex p-2 shadow-xl z-50">
        <button
          onClick={() => navigate("/monitoring")}
          className="flex-1 py-2.5 rounded-full text-center text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Monitoring
        </button>
        <button
          onClick={() => navigate("/kelola-pengguna")}
          className="flex-1 py-2.5 rounded-full text-center text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Pengguna
        </button>
        <button
          onClick={() => navigate("/profil-admin")}
          className="flex-1 py-2.5 rounded-full text-center text-sm font-semibold bg-[#7a8c2e] text-white"
        >
          Profil
        </button>
      </div>
    </div>
  );
}
