import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { panenAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '@iconify/react';
import BottomNav from '../../components/layout/BottomNav';

interface PanenData {
  _id: string;
  nama_komoditas: string;
  jumlah: number;
  harga?: number;
  tanggal: string;
  kualitas: string;
  deskripsi: string;
  foto?: Array<{ path: string }>;
}

const IconChevron = ({ isOpen }: { isOpen: boolean }) => (
  <div
    className={`bg-white/30 rounded-full p-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </div>
);

export default function EditPanen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [panen, setPanen] = useState<PanenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showKualitas, setShowKualitas] = useState(false);

  const [formData, setFormData] = useState({
    nama_komoditas: '',
    jumlah: '',
    harga: '',
    tanggal: '',
    kualitas: 'A',
    deskripsi: '',
  });

  const listKualitas = [
    { value: "A", label: "Grade A" },
    { value: "B", label: "Grade B" },
    { value: "C", label: "Grade C" },
  ];

  const kualitasLabel = listKualitas.find((k) => k.value === formData.kualitas)?.label ?? "Pilih Grade";

  useEffect(() => {
    const fetchPanen = async () => {
      try {
        if (id) {
          const response = await panenAPI.getById(id);
          const data = response.data;
          
          // Cek apakah pemilik adalah user yang login
          if (data.user_id?._id !== user?.id) {
            setMessage({ type: 'error', text: 'Anda tidak berhak mengedit panen ini' });
            setTimeout(() => navigate(-1), 2000);
            return;
          }

          setPanen(data);
          setFormData({
            nama_komoditas: data.nama_komoditas,
            jumlah: data.jumlah.toString(),
            harga: (data.harga || '').toString(),
            tanggal: data.tanggal.split('T')[0],
            kualitas: data.kualitas,
            deskripsi: data.deskripsi || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch panen:', error);
        setMessage({ type: 'error', text: 'Gagal memuat data panen' });
      } finally {
        setLoading(false);
      }
    };

    fetchPanen();
  }, [id, user?.id, navigate]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Validasi
      if (!formData.nama_komoditas.trim()) {
        setMessage({ type: 'error', text: 'Nama komoditas tidak boleh kosong' });
        setSaving(false);
        return;
      }

      if (!formData.jumlah || Number(formData.jumlah) <= 0) {
        setMessage({ type: 'error', text: 'Jumlah harus lebih dari 0' });
        setSaving(false);
        return;
      }

      if (!formData.harga || Number(formData.harga) <= 0) {
        setMessage({ type: 'error', text: 'Harga harus lebih dari 0' });
        setSaving(false);
        return;
      }

      const updateData = {
        nama_komoditas: formData.nama_komoditas,
        jumlah: Number(formData.jumlah),
        harga: Number(formData.harga),
        tanggal: formData.tanggal,
        kualitas: formData.kualitas,
        deskripsi: formData.deskripsi,
      };

      await panenAPI.update(id!, updateData);
      setMessage({ type: 'success', text: 'Hasil panen berhasil diperbarui!' });
      setTimeout(() => {
        navigate(`/detail-panen/${id}`);
      }, 1500);
    } catch (error: any) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal menyimpan perubahan' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await panenAPI.delete(id!);
      setMessage({ type: 'success', text: 'Hasil panen berhasil dihapus!' });
      setTimeout(() => {
        navigate('/riwayat-panen');
      }, 1500);
    } catch (error: any) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal menghapus panen' });
      setSaving(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#7a8c2e] flex items-center justify-center">
        <p className="text-white">Memuat data panen...</p>
      </div>
    );
  }

  if (!panen) {
    return (
      <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
        <div className="px-6 py-6 text-white">
          <h1 className="text-3xl font-bold">Edit Panen</h1>
          <p className="text-sm opacity-80">Data tidak ditemukan</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-[#7a8c2e] font-bold px-6 py-3 rounded-full"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
          </button>
          <h1 className="text-2xl font-bold">Edit Data</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 bg-white rounded-t-3xl pt-8 px-5 pb-28 overflow-y-auto">
        <h2 className="text-base font-semibold text-gray-500 mb-4">
          Edit Hasil Panen
        </h2>

        {/* Error */}
        {message.type === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 mb-4 flex items-center gap-2">
            <Icon
              icon="mdi:alert-circle-outline"
              className="text-red-500 flex-shrink-0"
            />
            {message.text}
          </div>
        )}

        {/* Success */}
        {message.type === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-700 mb-4 flex items-center gap-2">
            <Icon
              icon="mdi:check-circle-outline"
              className="text-green-500 flex-shrink-0"
            />
            {message.text}
          </div>
        )}

        {/* Nama Tanaman */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            <Icon icon="mdi:sprout" />
          </div>
          <input
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300"
            placeholder="Nama Tanaman (komoditas)"
            value={formData.nama_komoditas}
            onChange={(e) => handleChange('nama_komoditas', e.target.value)}
          />
        </div>

        {/* Jumlah */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            <Icon icon="mdi:scale-balance" />
          </div>
          <input
            type="number"
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300"
            placeholder="Jumlah Panen (Kg)"
            value={formData.jumlah}
            onChange={(e) => handleChange('jumlah', e.target.value)}
          />
          <span className="text-xs font-bold text-gray-400">Kg</span>
        </div>

        {/* Harga */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            <Icon icon="mdi:cash-multiple" />
          </div>
          <span className="text-xs font-semibold text-gray-400">Rp</span>
          <input
            type="number"
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300"
            placeholder="Harga per Kg"
            value={formData.harga}
            onChange={(e) => handleChange('harga', e.target.value)}
          />
          <span className="text-xs font-bold text-gray-400">/Kg</span>
        </div>

        {/* Deskripsi */}
        <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
            <Icon icon="mdi:card-text-outline" />
          </div>
          <textarea
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300 resize-none"
            placeholder="Deskripsi Panen"
            rows={2}
            value={formData.deskripsi}
            onChange={(e) => handleChange('deskripsi', e.target.value)}
          />
        </div>

        {/* Kualitas Dropdown */}
        <div className="relative mb-5">
          <button
            type="button"
            onClick={() => setShowKualitas((v) => !v)}
            className="w-full flex justify-between items-center bg-[#7a8c2e] text-white px-4 py-3 rounded-2xl text-sm font-semibold"
          >
            <span>{kualitasLabel}</span>
            <IconChevron isOpen={showKualitas} />
          </button>
          {showKualitas && (
            <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#e6ead1] border border-[#7a8c2e] rounded-2xl overflow-hidden z-30 shadow-lg">
              {listKualitas.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    handleChange('kualitas', item.value);
                    setShowKualitas(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm border-b border-[#7a8c2e]/20 last:border-0 transition-colors ${
                    formData.kualitas === item.value
                      ? "bg-[#7a8c2e] text-white font-semibold"
                      : "text-gray-700 hover:bg-[#7a8c2e] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Simpan */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#7a8c2e] hover:bg-[#6a7a26] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full text-base transition-all shadow-md mb-3 active:scale-95"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <Icon icon="mdi:loading" className="animate-spin text-xl" />
              Menyimpan...
            </span>
          ) : (
            "Simpan Perubahan"
          )}
        </button>

        {/* Hapus */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full text-base transition-all active:scale-95"
        >
          Hapus Panen
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-500 mb-6">
              Yakin ingin menghapus hasil panen <strong>{formData.nama_komoditas}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-700 font-bold py-2 rounded-lg transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all"
              >
                {saving ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav role="petani" />
    </div>
  );
}
