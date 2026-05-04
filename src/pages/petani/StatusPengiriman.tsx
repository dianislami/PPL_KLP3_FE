import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { permintaanAPI, panenAPI } from '../../services/api';

type StepStatus = 'done' | 'active' | 'pending';

interface Step {
  id: number;
  status: StepStatus;
  title: string;
  desc: string | React.ReactNode;
  icon?: string;
}

interface PanenData {
  _id: string;
  nama_komoditas: string;
  jumlah: number;
  foto?: Array<{ path: string }>;
  [key: string]: any;
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <div className="w-10 h-10 rounded-full bg-[#5a7a1a] flex items-center justify-center flex-shrink-0 z-10">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 11.5L9 16.5L18 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div className="w-10 h-10 rounded-full bg-[#c8d87a] border-4 border-[#e8f0b0] flex items-center justify-center flex-shrink-0 z-10">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v6l4 2" stroke="#5a7a1a" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="10" r="8" stroke="#5a7a1a" strokeWidth="2" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center flex-shrink-0 z-10">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 4v6l4 2" stroke="#aaa" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="10" r="8" stroke="#aaa" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default function StatusPengiriman() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [permintaan, setPermintaan] = useState<any>(null);
  const [panenList, setPanenList] = useState<PanenData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil data permintaan
        if (id) {
          const resPermintaan = await permintaanAPI.getById(id);
          setPermintaan(resPermintaan.data);
        }
        // Ambil semua data panen untuk lookup foto
        const resPanen = await panenAPI.getAll();
        setPanenList(resPanen.data);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading || !permintaan) {
    return (
      <div className="w-full min-h-screen bg-[#7a8c2e] flex items-center justify-center">
        <p className="text-white">Memuat data...</p>
      </div>
    );
  }

  const getProdukFoto = () => {
    if (permintaan.matches && permintaan.matches.length > 0) {
      const firstMatch = permintaan.matches[0];
      const panenItem = panenList.find(p => p._id === firstMatch.hasil_panen_id);
      if (panenItem?.foto && panenItem.foto.length > 0) {
        return `http://localhost:5000${panenItem.foto[0].path}`;
      }
    }
    return null;
  };

  const calculateEstimatedTime = () => {
    const pickupTime = new Date(permintaan.tanggal);
    const estimatedDelivery = new Date(pickupTime.getTime() + 4 * 60 * 60 * 1000); // Add 4 hours
    return estimatedDelivery.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const steps: Step[] = [
    {
      id: 4,
      status: 'done',
      title: 'Diterima',
      desc: `Pedagang: ${permintaan.user_id?.nama || 'Pembeli'}\nAlamat: ${permintaan.user_id?.alamat || 'Lokasi belum diatur'}`,
    },
    {
      id: 3,
      status: 'done',
      title: 'Tiba di Gudang',
      desc: `Menuju: ${permintaan.user_id?.alamat || 'Lokasi belum diatur'}, Est. ${calculateEstimatedTime()} WIB`,
    },
    {
      id: 2,
      status: 'done',
      title: 'Dalam Perjalanan',
      desc: `Dari Petani Penyuplai ke Gudang Pusat, Banda Aceh`,
    },
    {
      id: 1,
      status: 'done',
      title: 'Diambil',
      desc: `Dari Petani Penyuplai, ${new Date(permintaan.tanggal).toLocaleTimeString('id-ID')} WIB`,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-6 text-white flex-shrink-0">
        <div className="flex gap-3 items-center mb-3">
          <button
            onClick={() => navigate("/riwayat-panen?tab=penjualan")}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Status Pengiriman</h1>
            <p className="text-lg opacity-80">#{permintaan.nomor_permintaan}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-8 overflow-y-auto pb-30 px-5">

        {/* Header: Produk & Total Jumlah */}
        <div className="bg-white border border-gray-100 rounded-[30px] p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-inner">
              {getProdukFoto() ? (
                <img src={getProdukFoto()!} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#eaf0d8] flex items-center justify-center text-2xl">
                  🌾
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm uppercase truncate">
                {permintaan.nama_komoditas}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                {permintaan.jumlah} Kg Total
              </p>
              <p className="text-[10px] text-gray-500 font-semibold mt-1">
                Dari {permintaan.matches?.length || 0} Petani Penyuplai
              </p>
            </div>
          </div>
        </div>

        {/* Supplier List - Show all matches with their quantities */}
        {permintaan.matches && permintaan.matches.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Petani Penyuplai</p>
            <div className="space-y-2">
              {permintaan.matches.map((match: any, idx: number) => (
                <div key={idx} className="bg-[#f9faf5] rounded-2xl p-3 border border-gray-100 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7a8c2e] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {match.petani_nama?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{match.petani_nama}</p>
                    <p className="text-[10px] text-gray-500">Stok: <span className="font-bold text-[#7a8c2e]">{match.jumlah_diambil} Kg</span> · {match.lokasi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative flex flex-col gap-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Status Pengiriman</p>
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const isDone = step.status === 'done';

            return (
              <div key={step.id} className="flex gap-4 relative">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <StepIcon status={step.status} />
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 my-1 ${
                        isDone ? 'bg-[#5a7a1a]' : 'border-l-2 border-dashed border-gray-300 w-0'
                      }`}
                      style={{ minHeight: 32 }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-6 ${isLast ? 'pb-2' : ''}`}>
                  {step.id === 2 ? (
                    <div className="bg-[#f0f5e0] rounded-2xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 text-base">{step.title}</p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {step.desc as string}
                          </p>
                        </div>
                        {step.icon && (
                          <Icon icon={step.icon} className="text-5xl text-[#7a8c2e]" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#d8e8a0]">
                        <Icon icon="mdi:truck-fast-outline" className="text-4xl text-[#7a8c2e]" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Pengiriman - {permintaan.nomor_permintaan}</p>
                          <p className="text-xs text-gray-500">Status: Dalam Pengiriman</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <p className="font-bold text-base text-gray-900">
                        {step.title}
                      </p>
                      <p className="text-sm mt-0.5 whitespace-pre-line text-gray-600">
                        {step.desc as string}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}