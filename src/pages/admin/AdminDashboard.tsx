import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import BottomNav from '../../components/layout/BottomNav';
import { authAPI, panenAPI, permintaanAPI } from '../../services/api';

type AdminTab = 'monitoring' | 'pengguna' | 'permintaan' | 'panen' | 'chat';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('monitoring');
  const [users, setUsers] = useState<any[]>([]);
  const [panen, setPanen] = useState<any[]>([]);
  const [permintaan, setPermintaan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id?: string; type?: string }>({ show: false });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, panenRes, permintaanRes] = await Promise.all([
        authAPI.getUsers(),
        panenAPI.getAll(),
        permintaanAPI.getAll(),
      ]);
      setUsers(usersRes.data);
      setPanen(panenRes.data);
      setPermintaan(permintaanRes.data);
    } catch (err) {
      setError('Gagal memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await authAPI.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      setDeleteConfirm({ show: false });
    } catch {
      alert('Gagal menghapus user');
    }
  };

  const handleDeletePanen = async (id: string) => {
    try {
      await panenAPI.delete(id);
      setPanen(panen.filter(p => p._id !== id));
      setDeleteConfirm({ show: false });
    } catch {
      alert('Gagal menghapus panen');
    }
  };

  const handleDeletePermintaan = async (id: string) => {
    try {
      await permintaanAPI.getAll(); // Assuming there's a delete endpoint
      setPermintaan(permintaan.filter(p => p._id !== id));
      setDeleteConfirm({ show: false });
    } catch {
      alert('Gagal menghapus permintaan');
    }
  };

  // ─── MONITORING TAB ───
  const renderMonitoring = () => {
    const totalPanen = panen.reduce((s, p) => s + (p.jumlah || 0), 0);
    const totalRecovery = panen
      .filter(p => p.recovery?.jenis)
      .reduce((s, p) => s + (p.jumlah || 0), 0);
    const totalUsers = users.filter(u => u.role !== 'admin').length;
    const totalPermintaan = permintaan.length;

    return (
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f0f5e4] rounded-2xl p-4 border border-[#d4e4a0]">
            <p className="text-2xl mb-1">🌾</p>
            <p className="text-xs text-[#5a6e1a] font-semibold">Total Panen</p>
            <p className="text-xl font-bold text-[#3a4e10]">{panen.length}</p>
            <p className="text-[10px] text-[#7a8c2e] mt-1">{totalPanen.toLocaleString('id-ID')} kg</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <p className="text-2xl mb-1">♻️</p>
            <p className="text-xs text-orange-600 font-semibold">Recovery</p>
            <p className="text-xl font-bold text-orange-700">{panen.filter(p => p.recovery?.jenis).length}</p>
            <p className="text-[10px] text-orange-400 mt-1">{totalRecovery.toLocaleString('id-ID')} kg</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-2xl mb-1">👥</p>
            <p className="text-xs text-blue-600 font-semibold">Total User</p>
            <p className="text-xl font-bold text-blue-700">{totalUsers}</p>
            <p className="text-[10px] text-blue-400 mt-1">Pengguna aktif</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <p className="text-2xl mb-1">📋</p>
            <p className="text-xs text-green-600 font-semibold">Permintaan</p>
            <p className="text-xl font-bold text-green-700">{totalPermintaan}</p>
            <p className="text-[10px] text-green-400 mt-1">Belum diproses</p>
          </div>
        </div>

        {/* Summary by Commodity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">📊 Komoditas Terpopuler</h3>
          <div className="space-y-2">
            {['tomat', 'kentang', 'wortel', 'jagung', 'kangkung'].map(k => {
              const total = panen.filter(p => p.nama_komoditas?.toLowerCase().includes(k)).length;
              if (total === 0) return null;
              return (
                <div key={k} className="flex justify-between items-center text-xs">
                  <span className="capitalize font-semibold text-gray-600">{k}</span>
                  <span className="text-gray-400">{total} laporan</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recovery Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">♻️ Recovery Breakdown</h3>
          <div className="space-y-2">
            {(() => {
              const pakanItems = panen.filter(p => p.recovery?.jenis === 'pakan');
              const komposItems = panen.filter(p => p.recovery?.jenis === 'kompos');
              const pakanTotal = pakanItems.reduce((s, p) => s + (p.jumlah || 0), 0);
              const komposTotal = komposItems.reduce((s, p) => s + (p.jumlah || 0), 0);
              
              return (
                <>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span>🐄 Pakan Ternak</span>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{pakanItems.length}</span>
                    </div>
                    <span className="text-gray-400 font-semibold">{pakanTotal.toLocaleString('id-ID')} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span>♻️ Kompos</span>
                      <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-semibold">{komposItems.length}</span>
                    </div>
                    <span className="text-gray-400 font-semibold">{komposTotal.toLocaleString('id-ID')} kg</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    );
  };

  // ─── PENGGUNA TAB ───
  const renderPengguna = () => {
    const nonAdminUsers = users.filter(u => u.role !== 'admin');
    const filtered = nonAdminUsers.filter(u =>
      u.nama?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="space-y-4">
        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 px-3 py-2 flex items-center gap-2">
          <Icon icon="mdi:magnify" className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari pengguna..."
            className="flex-1 text-sm outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Users List */}
        <div className="space-y-2">
          {filtered.map(user => (
            <div key={user._id} className="bg-white rounded-2xl p-3 border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm text-gray-800">{user.nama}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-semibold">{user.role}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${user.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    {user.status || 'Aktif'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDeleteConfirm({ show: true, id: user._id, type: 'user' })}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
              >
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── PANEN TAB ───
  const renderPanen = () => {
    return (
      <div className="space-y-3">
        {panen.map(p => (
          <div key={p._id} className="bg-white rounded-2xl p-3 border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm text-gray-800">{p.nama_komoditas}</p>
                <p className="text-xs text-gray-500">{p.user_id?.nama}</p>
              </div>
              <button
                onClick={() => setDeleteConfirm({ show: true, id: p._id, type: 'panen' })}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
              >
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Jumlah</span>
                <p className="font-bold text-gray-800">{p.jumlah} kg</p>
              </div>
              <div>
                <span className="text-gray-500">Harga</span>
                <p className="font-bold text-gray-800">Rp {p.harga?.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <span className="text-gray-500">Grade</span>
                <p className="font-bold text-gray-800">{p.kualitas}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2">
              <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-semibold">{p.status}</span>
              {p.recovery?.jenis && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: p.recovery.jenis === 'pakan' ? '#DBEAFE' : '#DCFCE7',
                    color: p.recovery.jenis === 'pakan' ? '#1E40AF' : '#15803D'
                  }}
                >
                  {p.recovery.jenis === 'pakan' ? '🐄 Pakan' : '♻️ Kompos'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ─── PERMINTAAN TAB ───
  const renderPermintaan = () => {
    return (
      <div className="space-y-3">
        {permintaan.map(p => (
          <div key={p._id} className="bg-white rounded-2xl p-3 border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm text-gray-800">{p.nama_komoditas}</p>
                <p className="text-xs text-gray-500">{p.pedagang_id?.nama}</p>
              </div>
              <button
                onClick={() => setDeleteConfirm({ show: true, id: p._id, type: 'permintaan' })}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
              >
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Jumlah</span>
                <p className="font-bold text-gray-800">{p.jumlah_kebutuhan} kg</p>
              </div>
              <div>
                <span className="text-gray-500">Harga</span>
                <p className="font-bold text-gray-800">Rp {p.harga_maksimal?.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <p className={`font-bold ${p.status === 'Terisi' ? 'text-green-600' : p.status === 'Pending' ? 'text-yellow-600' : 'text-gray-600'}`}>
                  {p.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ─── CHAT TAB ───
  const renderChat = () => {
    return (
      <div className="space-y-3">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-center">
          <p className="text-3xl mb-1">💬</p>
          <p className="text-sm font-bold text-blue-700">Total Percakapan</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">-</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
          <p className="text-sm text-gray-600">Fitur monitoring chat sedang dalam pengembangan</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-[#7a8c2e] px-6 pt-12 pb-8 text-white">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm opacity-80 mt-1">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long' })}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hide">
          {(['monitoring', 'pengguna', 'panen', 'permintaan', 'chat'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-[#7a8c2e] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'monitoring' && '📊 Monitoring'}
              {tab === 'pengguna' && '👥 Pengguna'}
              {tab === 'panen' && '🌾 Panen'}
              {tab === 'permintaan' && '📋 Permintaan'}
              {tab === 'chat' && '💬 Chat'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-32">
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#7a8c2e] border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">
            ⚠️ {error}
          </div>
        ) : (
          <>
            {activeTab === 'monitoring' && renderMonitoring()}
            {activeTab === 'pengguna' && renderPengguna()}
            {activeTab === 'panen' && renderPanen()}
            {activeTab === 'permintaan' && renderPermintaan()}
            {activeTab === 'chat' && renderChat()}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm">
            <p className="text-lg font-bold text-gray-800 mb-2">Hapus data?</p>
            <p className="text-sm text-gray-600 mb-4">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false })}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'user') handleDeleteUser(deleteConfirm.id!);
                  else if (deleteConfirm.type === 'panen') handleDeletePanen(deleteConfirm.id!);
                  else if (deleteConfirm.type === 'permintaan') handleDeletePermintaan(deleteConfirm.id!);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default AdminDashboard;
