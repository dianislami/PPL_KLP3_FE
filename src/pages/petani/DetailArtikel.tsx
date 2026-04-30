import { useParams, useNavigate } from 'react-router-dom';
import artikelData from '../data/artikelBerita.json';

interface Artikel {
  id: string;
  judul: string;
  ringkasan: string;
  isi: string;
  kategori: string;
  tanggal: string;
  emoji: string;
  warna: string;
}

export default function DetailArtikel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const artikel = (artikelData as Artikel[]).find(a => a.id === id);

  if (!artikel) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-500 text-sm">Artikel tidak ditemukan.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#7a8c2e] font-semibold text-sm underline"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const paragraf = artikel.isi.split('\n\n');

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">

      {/* Hero */}
      <div className={`relative w-full flex-shrink-0 ${artikel.warna}`} style={{ minHeight: '220px' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center z-20 shadow-lg hover:bg-white transition-all active:scale-95"
        >
          <span className="text-gray-700 font-bold text-lg leading-none">‹</span>
        </button>

        {/* Emoji besar di tengah */}
        <div className="flex items-center justify-center h-full pt-16 pb-10">
          <span style={{ fontSize: '90px', lineHeight: 1 }}>{artikel.emoji}</span>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10" style={{ lineHeight: 0 }}>
          <svg
            viewBox="0 0 390 50"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '50px' }}
          >
            <path
              d="M0,25 C80,50 160,0 260,20 C320,32 360,10 390,25 L390,50 L0,50 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white px-5 pt-2 pb-12 overflow-y-auto">

        {/* Kategori & Tanggal */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eaf0d8] text-[#5a6e1a]">
            {artikel.kategori}
          </span>
          <span className="text-xs text-gray-400">{artikel.tanggal}</span>
        </div>

        {/* Judul */}
        <h1 className="text-xl font-bold text-gray-900 leading-snug mb-3">
          {artikel.judul}
        </h1>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* Ringkasan */}
        <p className="text-sm font-semibold text-[#5a6e1a] leading-relaxed mb-4 italic">
          {artikel.ringkasan}
        </p>

        {/* Isi artikel */}
        <div className="flex flex-col gap-4">
          {paragraf.map((p, i) => (
            <p key={i} className="text-sm text-justify text-gray-700 leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">Smart Harvest • {artikel.tanggal}</p>
        </div>
      </div>
    </div>
  );
}