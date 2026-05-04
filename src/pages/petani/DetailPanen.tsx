import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { panenAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '@iconify/react';
import { getBackendOrigin } from "../../services/api";

interface PanenDetail {
  _id: string;
  nama_komoditas: string;
  jumlah: number;
  harga?: number;
  tanggal: string;
  kualitas: string;
  status: string;
  deskripsi: string;
  foto?: Array<{ path: string }>;
  user_id?: { _id: string; nama: string };
  recovery?: { jenis?: 'pakan' | 'kompos' };
}

const statusColor: Record<string, string> = {
  'siap jual':     'text-green-700 bg-green-50',
  'proses':        'text-orange-700 bg-orange-50',
  'tersimpan':     'text-gray-700 bg-gray-100',
};

const kualitasEmoji: Record<string, string> = {
  'A': '⭐⭐⭐',
  'B': '⭐⭐',
  'C': '⭐',
};

export default function DetailPanen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [panen, setPanen] = useState<PanenDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = panen?.user_id?._id === user?.id;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const response = await panenAPI.getById(id);
          setPanen(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch panen detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Memuat detail panen...</p>
      </div>
    );
  }

  if (!panen) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-between px-4 pt-12 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Hasil</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Data panen tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await panenAPI.delete(id!);
      setShowDeleteModal(false);
      navigate('/riwayat-panen');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Gagal menghapus panen');
      setDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">

      {/* Top Nav Bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
        >
          <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Hasil</h1>
        {isOwner ? (
          <button
            onClick={() => navigate(`/edit-panen/${id}`)}
            className="w-10 h-10 rounded-full bg-[#7a8c2e] flex items-center justify-center active:scale-95 transition-all text-white"
          >
            <Icon icon="mdi:pencil" className="text-lg" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-12">

        {/* Section title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Detail Panen</h2>

        {/* Main Card: Image + Info grid */}
        <div className="flex gap-3 mb-4">
          {/* Image */}
          <div className="w-44 h-68 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {panen.foto && panen.foto.length > 0 && panen.foto[0].path ? (
              <img 
                src={`${getBackendOrigin()}${panen.foto[0].path}`} 
                alt={panen.nama_komoditas} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = 'none';
                  img.parentElement!.innerHTML = '<span style="font-size: 80px">🌱</span>';
                }}
              />
            ) : (
              <span style={{ fontSize: '80px' }}>🌱</span>
            )}
          </div>

          {/* Info pills */}
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {[
              { label: 'Jumlah', value: `${panen.jumlah} Kg` },
              { label: 'Harga', value: panen.harga ? `Rp ${panen.harga.toLocaleString('id-ID')}/Kg` : '-' },
              { label: 'Tanggal', value: new Date(panen.tanggal).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) },
              { label: 'Kualitas', value: panen.kualitas },
              { label: 'Status', value: panen.status },
            ].map(item => (
              <div
                key={item.label}
                className="bg-gray-100 rounded-2xl px-4 py-2.5 text-center"
              >
                <p className="text-xs font-bold text-[#5a6e1a]">{item.label}</p>
                <p className="text-sm text-gray-700 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nama Tanaman pill */}
        <div className="bg-gray-100 rounded-2xl px-5 py-3 mb-4">
          <p className="text-base font-bold text-gray-800">{panen.nama_komoditas}</p>
        </div>

        {/* Deskripsi card */}
        {panen.deskripsi && (
          <div className="bg-gray-100 rounded-2xl px-5 py-4 mb-6">
            <p className="text-xs font-bold text-[#5a6e1a] mb-2 uppercase">Deskripsi</p>
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
              {panen.deskripsi}
            </p>
          </div>
        )}

        {/* Badge row */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <span className="text-xs font-bold px-4 py-2 rounded-full text-green-700 bg-green-50">
            {kualitasEmoji[panen.kualitas] || '⭐'} Grade {panen.kualitas}
          </span>
          <span className={`text-xs font-bold px-4 py-2 rounded-full ${statusColor[panen.status.toLowerCase()] || 'text-gray-600 bg-gray-100'}`}>
            {panen.status}
          </span>
          {panen.recovery?.jenis && (
            <span 
              className="text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5"
              style={{
                background: panen.recovery.jenis === 'pakan' ? '#DBEAFE' : '#DCFCE7',
                color: panen.recovery.jenis === 'pakan' ? '#1E40AF' : '#15803D'
              }}
            >
              <span>{panen.recovery.jenis === 'pakan' ? '🐄' : '♻️'}</span>
              <span>{panen.recovery.jenis === 'pakan' ? 'Pakan Ternak' : 'Kompos'}</span>
            </span>
          )}
        </div>

        {/* Petani Info */}
        {panen.user_id && (
          <div className="bg-blue-50 rounded-2xl px-5 py-4 mb-6 border border-blue-200">
            <p className="text-xs font-bold text-blue-600 mb-2 uppercase">Petani</p>
            <p className="text-sm font-semibold text-gray-800">{panen.user_id.nama}</p>
          </div>
        )}

        {/* Delete Button - for owner only */}
        {isOwner && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mb-6"
          >
            <Icon icon="mdi:trash-can-outline" className="text-lg" />
            Hapus Panen
          </button>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-500 mb-6">
              Yakin ingin menghapus hasil panen <strong>{panen.nama_komoditas}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-700 font-bold py-2 rounded-lg transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}