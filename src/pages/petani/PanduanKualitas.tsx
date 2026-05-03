import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";
import { Icon } from "@iconify/react";

export default function PanduanKualitas() {
  const navigate = useNavigate();

  const gradeData = [
    {
      grade: "A",
      title: "Kualitas Premium",
      stars: "⭐⭐⭐",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      desc: "Produk dalam kondisi sempurna. Bentuk seragam, warna cerah, tekstur keras/segar, dan bebas dari cacat fisik atau serangan hama.",
      target: "Pasar Swalayan / Ekspor",
    },
    {
      grade: "B",
      title: "Kualitas Standar",
      stars: "⭐⭐",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      desc: "Produk layak konsumsi namun memiliki sedikit kekurangan fisik seperti bentuk tidak seragam atau sedikit goresan pada kulit.",
      target: "Pasar Tradisional / Olahan",
    },
    {
      grade: "C",
      title: "Kualitas Pemulihan",
      stars: "⭐",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      desc: "Produk mengalami kerusakan fisik signifikan, terlalu matang, atau bentuk sangat tidak beraturan. Tidak untuk dijual langsung.",
      target: "Recovery (Pakan/Kompos)",
    },
  ];

  const recoveryOptions = [
    {
      label: "Pakan Ternak",
      icon: "mdi:cow",
      desc: "Produk yang layu atau cacat fisik namun tidak busuk.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Bahan Kompos",
      icon: "mdi:recycle",
      desc: "Produk yang sudah mulai membusuk atau sisa tanaman.",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 pt-12 pb-8 text-white flex-shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-all"
          >
            <Icon icon="mdi:chevron-left" className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold">Panduan Kualitas</h1>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="flex-1 bg-white rounded-t-[40px] px-5 pt-8 pb-28 shadow-2xl overflow-y-auto">
        <h2 className="text-base font-black text-gray-800 uppercase tracking-widest mb-4 px-1">
          Penentuan Grade
        </h2>

        {/* Grade List */}
        <div className="flex flex-col gap-4 mb-10">
          {gradeData.map((item) => (
            <div
              key={item.grade}
              className={`${item.bg} ${item.border} border rounded-[30px] p-5 shadow-sm`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-xl ${item.color} shadow-sm`}
                  >
                    {item.grade}
                  </div>
                  <p
                    className={`font-black uppercase text-xs tracking-tighter ${item.color}`}
                  >
                    {item.title}
                  </p>
                </div>
                <span className="text-[10px]">{item.stars}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium mb-3">
                {item.desc}
              </p>
              <div className="flex items-center gap-1.5 pt-3 border-t border-gray-200/50">
                <Icon icon="mdi:store-check-outline" className={item.color} />
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Tujuan: {item.target}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recovery Section */}
        <div className="bg-[#f9faf5] rounded-[35px] p-6 border border-[#7a8c2e]/10 mb-6">
          <h2 className="text-base font-black text-[#3a4e10] uppercase tracking-widest mb-4">
            Pemanfaatan Grade C
          </h2>
          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            Jangan membuang hasil panen Grade C. Gunakan fitur{" "}
            <span className="font-bold text-[#7a8c2e]">Kelola Recovery</span>{" "}
            untuk mengalokasikannya menjadi:
          </p>

          <div className="grid grid-cols-2 gap-3">
            {recoveryOptions.map((opt) => (
              <div
                key={opt.label}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center"
              >
                <div
                  className={`w-12 h-12 ${opt.bg} ${opt.color} rounded-full flex items-center justify-center text-2xl mb-2`}
                >
                  <Icon icon={opt.icon} />
                </div>
                <p className="text-[11px] font-black text-gray-800 uppercase mb-1">
                  {opt.label}
                </p>
                <p className="text-[9px] text-gray-400 leading-tight">
                  {opt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Footer */}
        <div className="bg-[#3a4e10] rounded-2xl p-4 flex items-center gap-4 active:scale-95 transition-all cursor-pointer">
          <div className="text-2xl">💡</div>
          <p className="text-[11px] text-white font-bold italic leading-snug">
            Tips: Gunakan foto pencahayaan terang saat upload produk Grade A
            agar menarik minat pembeli premium.
          </p>
        </div>
      </div>

      <BottomNav role="petani" />
    </div>
  );
}
