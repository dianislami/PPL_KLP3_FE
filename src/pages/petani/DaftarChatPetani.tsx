import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/api';
import { Icon } from '@iconify/react';

interface ChatItem {
  id: string;
  nama: string;
  peran: 'petani' | 'pedagang';
  pesanTerakhir: string;
  waktu: string;
  belumDibaca: number;
  online: boolean;
}

export default function DaftarChatPetani() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchChatList();
  }, [user?.id]);

  const fetchChatList = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChatList(user?.id || '');
      setChatList(response.data || []);
    } catch (error) {
      console.error('Error fetching chat list:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = chatList.filter(c =>
    c.nama.toLowerCase().includes(search.toLowerCase()) ||
    c.pesanTerakhir.toLowerCase().includes(search.toLowerCase())
  );

  const totalBelumDibaca = chatList.reduce((s, c) => s + c.belumDibaca, 0);

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-gray-700 font-bold text-lg leading-none">
                ‹
            </span>
          </button>
          <div>
            <h1 className="text-3xl font-bold">Pesan</h1>
            <p className="text-sm opacity-80">
              {totalBelumDibaca > 0
                ? `${totalBelumDibaca} pesan belum dibaca`
                : 'Semua pesan telah dibaca'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white/60">
            <Icon icon="mdi:search" />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau pesan..."
            className="w-full pl-11 pr-4 py-3 bg-white/25 text-white placeholder-white/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Total Chat</p>
          <p className="text-xs font-bold text-gray-800">{chatList.length} Pedagang</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400">Online</p>
          <p className="text-xs font-bold text-green-600">{chatList.filter((c: ChatItem) => c.online).length} Aktif</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Belum Dibaca</p>
          <p className="text-xs font-bold text-[#7a8c2e]">{totalBelumDibaca} Pesan</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-5 overflow-y-auto pb-28">

        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-3">
          Chat dengan Pedagang
        </p>

        {loading ? (
          <div className="flex flex-col items-center py-16 gap-2">
            <span className="text-5xl">💬</span>
            <p className="text-gray-400 text-sm">Memuat pesan...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-2">
            <span className="text-5xl text-[#7a8c2e]">
                <Icon icon="mdi:chat-remove" />
            </span>
            <p className="text-[#7a8c2e] text-sm">Tidak ada chat ditemukan</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(`/chat-petani/${item.id}`)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#eaf0d8] flex items-center justify-center text-2xl border-2 border-white shadow-sm">
                    {item.peran === 'pedagang' ? '🏪' : '👨‍🌾'}
                  </div>
                  {item.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className={`text-sm ${item.belumDibaca > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                      {item.nama}
                    </p>
                    <p className={`text-[10px] flex-shrink-0 ${item.belumDibaca > 0 ? 'text-[#7a8c2e] font-bold' : 'text-gray-400'}`}>
                      {item.waktu}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate pr-2 ${item.belumDibaca > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                      {item.pesanTerakhir}
                    </p>
                    {item.belumDibaca > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#7a8c2e] text-white text-[10px] font-bold flex items-center justify-center">
                        {item.belumDibaca}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}