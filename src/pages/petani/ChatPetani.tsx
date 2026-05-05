import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatAPI, authAPI, getImageUrl } from '../../services/api';

interface Message {
  _id?: string;
  sender_id: any;
  receiver_id?: string;
  pesan: string;
  tanggal: string;
  dibaca?: boolean;
}

// ── Parse string pesan produk → object ──
function parseProduk(pesan: string) {
  try {
    const lines = pesan.split('\n').map(l => l.trim()).filter(Boolean);
    const get = (prefix: string) => lines.find(l => l.startsWith(prefix))?.replace(prefix, '').trim() ?? '';

    let foto = '';
    const fotoLine = pesan.split('\n')[0];
    if (fotoLine.startsWith('[FOTO_URL:')) {
      let rawFoto = fotoLine.slice(10, -1);
      
      // Bersihkan double URL dulu
      const doubleMatch = rawFoto.match(/https?:\/\/.+(https?:\/\/.+)/);
      if (doubleMatch) rawFoto = doubleMatch[1];
      
      foto = getImageUrl(rawFoto);
    }

    const nama = get('🌾');
    const hargaRaw = get('💰').replace('Rp', '').replace('/Kg', '').replace(/[^\d]/g, '');
    const harga = parseInt(hargaRaw) || 0;
    const kualitas = get('📊');
    const jumlahRaw = get('⚖️').replace('Kg tersedia', '').replace(/[^\d]/g, '');
    const jumlah = parseInt(jumlahRaw) || 0;

    const skipPfx = ['[FOTO_URL:', '🌾', '💰', '📊', '⚖️', 'Tertarik'];
    const deskripsi = lines.filter(l => !skipPfx.some(p => l.startsWith(p))).join(' ').trim();

    return nama && foto ? { nama, harga, kualitas, jumlah, deskripsi, foto } : null;
  } catch {
    return null;
  }
}

// ── Warna per grade ──
const paletteMap: Record<string, { bg: string; light: string }> = {
  'Grade A':  { bg: '#16a34a', light: '#f0fdf4' },
  'Grade B':  { bg: '#d97706', light: '#fffbeb' },
  'Grade C':  { bg: '#dc2626', light: '#fff1f1' },
  'A':        { bg: '#16a34a', light: '#f0fdf4' },
  'B':        { bg: '#d97706', light: '#fffbeb' },
  'C':        { bg: '#dc2626', light: '#fff1f1' },
};

function getPalette(kualitas: string) {
  return paletteMap[kualitas] ?? { bg: '#7a8c2e', light: '#f0f4e4' };
}

// ── Card bubble produk ──
function ProdukBubble({ pesan, time }: { pesan: string; time: string }) {
  const data = parseProduk(pesan);
  if (!data) return null;

  const pal = getPalette(data.kualitas);

  return (
    <div className="flex justify-start">
      <div className="flex flex-col items-start" style={{ width: 288 }}>
        <div
          className="w-full rounded-2xl overflow-hidden shadow-lg"
          style={{ border: `1.5px solid ${pal.bg}25` }}
        >
          {/* ── Foto Header ── */}
          <div className="w-full h-40 bg-gray-300 overflow-hidden relative">
            <img 
              src={data.foto}
              alt={data.nama}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg';
              }}
            />
          </div>

          {/* ── Header ── */}
          <div
            className="flex items-center gap-3 px-4 py-3 relative"
            style={{ background: pal.bg }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold leading-tight truncate">{data.nama}</p>
              <p className="text-white/70 text-[11px] mt-0.5">Penawaran Produk</p>
            </div>
            {data.kualitas && (
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white flex-shrink-0"
                style={{ background: pal.bg }}
              >
                {data.kualitas}
              </span>
            )}
          </div>

          {/* ── Body ── */}
          <div className="px-4 py-3 flex flex-col gap-2.5" style={{ background: pal.light }}>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-medium text-gray-600">Harga/Kg</span>
              <span className="text-sm font-bold" style={{ color: pal.bg }}>
                Rp {data.harga.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-medium text-gray-600">Stok</span>
              <span className="text-sm font-semibold text-gray-700">
                {data.jumlah} Kg
              </span>
            </div>

            {data.deskripsi && (
              <div style={{ borderTop: `1.5px solid ${pal.bg}20` }} className="pt-2.5 mt-1">
                <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-2">
                  {data.deskripsi}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 mt-1.5 pl-1">{time}</p>
      </div>
    </div>
  );
}

export default function ChatPetani() {
  const { id: contactId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id && contactId) {
      fetchChatMessages();
      fetchContactInfo();
    }
  }, [user?.id, contactId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContactInfo = async () => {
    try {
      const response = await authAPI.getUserById(contactId || '');
      setContactInfo(response.data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChatMessages(user?.id || '', contactId || '');
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const t = input.trim();
    if (!t || !user?.id || !contactId) return;

    try {
      setSending(true);
      const response = await chatAPI.sendMessage(user.id, contactId, t);
      setMessages(prev => [...prev, response.data]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#7a8c2e] flex items-center justify-center">
        <p className="text-white">Memuat chat...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f5f7f0]">

      {/* Header */}
      <div
        className="relative flex-shrink-0 bg-[#7a8c2e] text-white pt-12 pb-6 px-5"
        style={{ borderRadius: '0 0 50% 50% / 0 0 36px 36px' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="fixed top-12 left-4 w-10 h-10 bg-[#7a8c2e] rounded-full flex items-center justify-center hover:bg-white/30 transition-all active:scale-95 z-50" 
        >
          <span className="text-white font-bold text-2xl leading-none">‹</span>
        </button>

        <div className="flex flex-col items-center w-full">
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-full bg-[#9aaa3f] border-4 border-white/30 flex items-center justify-center text-3xl shadow-md">
              {contactInfo?.role === 'pedagang' ? '🏪' : '👨‍🌾'}
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <p className="text-white font-bold text-lg">{contactInfo?.nama || '...'}</p>
          <p className="text-white/70 text-xs mt-0.5">🟢 Online sekarang</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 pb-4 bg-[#f5f7f0]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
            <span className="text-4xl">💬</span>
            <p className="text-gray-500 text-sm">Belum ada pesan. Mulai percakapan!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const senderId  = typeof msg.sender_id === 'object' ? msg.sender_id._id : msg.sender_id;
            const isMe      = senderId === user?.id;
            const isProduct = msg.pesan.startsWith('[FOTO_URL:');
            const timeStr   = new Date(msg.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            if (isProduct && !isMe) {
              return <ProdukBubble key={msg._id || idx} pesan={msg.pesan} time={timeStr} />;
            }

            return (
              <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-[#eaf0d8] flex items-center justify-center text-base flex-shrink-0 mt-1">
                    {contactInfo?.role === 'pedagang' ? '🏪' : '👨‍🌾'}
                  </div>
                )}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[78%]`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-[#5a6e1a] text-white rounded-tr-sm'
                        : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                    }`}
                  >
                    {msg.pesan}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 px-1">{timeStr}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white/90 backdrop-blur-sm px-4 py-4 flex items-center gap-3 border-t border-gray-100 position: sticky bottom-0">
        <button className="w-11 h-11 rounded-full bg-[#7a8c2e] flex items-center justify-center flex-shrink-0 shadow-md active:scale-95 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ketik pesan Anda disini..."
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a8c2e]/40"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-11 h-11 rounded-full bg-[#7a8c2e] flex items-center justify-center flex-shrink-0 shadow-md active:scale-95 transition-all disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}