import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/layout/BottomNav';
import { useAuth } from '../../context/AuthContext';
import { panenAPI } from '../../services/api';
import { Icon } from '@iconify/react';

type TabType = 'semua' | 'pakan' | 'kompos' | 'limbah';
type RecoveryType = 'pakan' | 'kompos';

const tabOptions: { id: TabType; label: string }[] = [
  { id: 'semua',  label: 'Semua' },
  { id: 'pakan',  label: 'Pakan Ternak' },
  { id: 'kompos', label: 'Kompos' },
  { id: 'limbah', label: 'Limbah' },
];

interface RecoveryOption {
  id: RecoveryType;
  label: string;
  icon: string;
  desc: string;
}

const ICONS = {
  pakan: 'mdi:cow',
  kompos: 'mdi:recycle',
};

const recoveryOptions: RecoveryOption[] = [
  { id: 'pakan', label: 'Pakan Ternak', icon: '🐄', desc: 'Dijadikan pakan untuk ternak' },
  { id: 'kompos', label: 'Kompos', icon: '♻️', desc: 'Dijadikan bahan kompos organik' },
];

interface PanenItem {
  _id?: string;
  id?: string;
  nama_komoditas?: string;
  nama?: string;
  jumlah: number;
  harga?: number;
  kualitas: string;
  status: string;
  tanggal: string;
  deskripsi: string;
  emoji?: string;
  foto?: { path: string }[];
  recovery?: { jenis?: RecoveryType };
}

function filterByTab(items: PanenItem[], tab: TabType): PanenItem[] {
  if (tab === 'limbah') return items.filter(d => d.status === 'grade_c' || d.status === 'rusak');
  if (tab === 'pakan') return items.filter(d => d.recovery?.jenis === 'pakan');
  if (tab === 'kompos') return items.filter(d => d.recovery?.jenis === 'kompos');
  return items;
}

export default function PemulihanPanen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('semua');
  const [panenData, setPanenData] = useState<PanenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recoveryType, setRecoveryType] = useState<RecoveryType | null>(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) fetchPanen();
  }, [user]);

  const fetchPanen = async () => {
    try {
      setLoading(true);
      const response = await panenAPI.getAll();
      // Filter hanya grade C dan yang belum ada recovery
      const allItems: PanenItem[] = response.data || [];
      const gradeCPanen = allItems.filter((item: PanenItem & any) => {
        // Pastikan hanya data milik petani yang sedang login
        const ownerId = item.user_id?._id || item.user_id || item.user?._id || item.user?.id;
        if (!user?.id || !ownerId) return false;
        if (String(ownerId) !== String(user.id)) return false;

        const quality = (item.kualitas || '').toLowerCase();
        return quality.includes('c') || quality.includes('rusak');
      });

      setPanenData(gradeCPanen);
    } catch (error) {
      console.error('Error fetching panen:', error);
    } finally {
      setLoading(false);
    }
  };

  const openRecoveryModal = (id: string) => {
    setSelectedId(id);
    setRecoveryType(null);
    setShowRecoveryModal(true);
  };

  const submitRecovery = async () => {
    if (!selectedId || !recoveryType) return;

    try {
      setSubmitting(true);
      await panenAPI.update(selectedId, {
        recovery: {
          jenis: recoveryType
        }
      });
      // Update local state
      setPanenData(prev => prev.map(item => 
        item._id === selectedId || item.id === selectedId
          ? { ...item, recovery: { jenis: recoveryType } }
          : item
      ));
      setShowRecoveryModal(false);
    } catch (error) {
      console.error('Error updating recovery:', error);
      alert('Gagal memperbarui data pemulihan');
    } finally {
      setSubmitting(false);
    }
  };

  const displayed = filterByTab(panenData, activeTab);
  
  const stats = {
    rusak: panenData.filter(d => d.status === 'grade_c' || d.status === 'rusak').length,
    dipulih: panenData.filter(d => d.recovery?.jenis).length,
    total: panenData.reduce((sum, item) => sum + item.jumlah, 0)
  };

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold">Pemulihan Panen</h1>
            <p className="text-sm opacity-80">Kelola panen grade C</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Panen Rusak</p>
          <p className="text-xs font-bold text-gray-800">{stats.rusak}</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400">Dipulihkan</p>
          <p className="text-xs font-bold text-green-600">{stats.dipulih}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Total Kg</p>
          <p className="text-xs font-bold text-[#7a8c2e]">{stats.total.toLocaleString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-5 overflow-y-auto pb-28">

        <p className="text-base font-bold text-gray-800 px-4 mb-4">
          Kelola Kualitas & Kerusakan Panen
        </p>

        {/* Tabs */}
        <div className="flex gap-2 px-4 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {tabOptions.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-semibold border transition-all ${
                activeTab === t.id
                  ? 'bg-[#3a4e10] text-white border-[#3a4e10]'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4 px-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada data panen untuk kategori ini</p>
            </div>
          ) : (
            displayed.map(item => {
              const itemId = item._id || item.id || '';
              return (
                <div 
                  key={itemId} 
                  onClick={() => navigate(`/detail-panen/${itemId}`)}
                  className="bg-[#f5f4ee] rounded-2xl p-4 cursor-pointer active:scale-95 transition-all"
                >

                  {/* Card Top */}
                  <div className="flex gap-3">
                    <div className="w-[100px] h-[100px] rounded-xl bg-gray-200 flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
                      {item.foto && item.foto.length > 0 ? (
                        <img 
                          src={`http://localhost:5000${item.foto[0].path}`}
                          alt={item.nama_komoditas}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{item.emoji || '🌾'}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-gray-900">
                        {item.nama_komoditas || item.nama || 'Panen'}, {item.jumlah} Kg
                      </p>
                      <p className="text-sm text-gray-500">Harga: {item.harga ? `Rp ${item.harga.toLocaleString('id-ID')}/Kg` : '-'}</p>
                      <p className="text-sm text-gray-500">Kualitas: {item.kualitas}</p>
                      {item.recovery?.jenis && (
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mt-1.5 ${
                          item.recovery.jenis === 'pakan' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              item.recovery.jenis === 'pakan' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            <Icon
                              icon={item.recovery.jenis === 'pakan' ? ICONS.pakan : ICONS.kompos}
                              className="text-sm"
                            />
                            {item.recovery.jenis === 'pakan' ? 'Pakan Ternak' : 'Kompos'}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!item.recovery?.jenis && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openRecoveryModal(itemId)}
                        className="flex-1 bg-[#5a6e1a] text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#4a5c0a] transition-all"
                      >
                        Pilih Pemulihan
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pilih Jenis Pemulihan</h3>
            <p className="text-sm text-gray-500 mb-6">Produk ini akan masuk ke halaman Hasil Panen dengan tag limbah yang dipilih</p>

            <div className="flex flex-col gap-3 mb-6">
              {recoveryOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setRecoveryType(option.id)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    recoveryType === option.id
                      ? 'border-[#5a6e1a] bg-[#f0f7e8]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="text-left flex-1">
                      <p className="font-bold text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.desc}</p>
                    </div>
                    {recoveryType === option.id && (
                      <div className="w-6 h-6 rounded-full bg-[#5a6e1a] flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-full hover:bg-gray-300 transition-all"
              >
                Batal
              </button>
              <button
                onClick={submitRecovery}
                disabled={!recoveryType || submitting}
                className="flex-1 bg-[#5a6e1a] text-white font-semibold py-3 rounded-full hover:bg-[#4a5c0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav role="petani" />
    </div>
  );
}