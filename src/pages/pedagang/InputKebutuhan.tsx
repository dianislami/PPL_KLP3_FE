import { useState, useEffect } from "react";
import BottomNav from "../../components/layout/BottomNav";
import { permintaanAPI, panenAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

export default function InputKebutuhan() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // UI States
  const [showKualitas, setShowKualitas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMatching, setIsMatching] = useState(false); // Untuk animasi mencari petani
  const [showResult, setShowResult] = useState(false); // Untuk popup sukses
  const [matchData, setMatchData] = useState<any>(null);
  const [stats, setStats] = useState({ count: 0, value: 0 });

  const [formData, setFormData] = useState({
    nama_komoditas: "",
    jumlah: "",
    tanggal: "",
    kualitas: "A",
  });

  const listKualitas = ["A", "B", "C", "Premium"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await panenAPI.getAll();
        const data = response.data || [];
        const available = data.filter(
          (p: any) => p.status !== "Terjual" && p.jumlah > 0,
        );
        const totalVal = available.reduce(
          (s: number, p: any) => s + p.jumlah * (p.harga || 0),
          0,
        );
        setStats({ count: available.length, value: totalVal });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.nama_komoditas ||
      !formData.jumlah ||
      !formData.tanggal ||
      !user?.id
    ) {
      alert("Mohon isi semua field");
      return;
    }

    try {
      setLoading(true);
      const resCreate = await permintaanAPI.create({
        user_id: user.id,
        nama_komoditas: formData.nama_komoditas,
        jumlah: parseInt(formData.jumlah),
        tanggal: formData.tanggal,
        kualitas: formData.kualitas,
      });

      // 2. Tampilkan Overlay "Mencari Petani..."
      setIsMatching(true);

      // 3. Panggil Logic Matching di Backend
      const resMatch = await permintaanAPI.match(resCreate.data._id, {});

      // Simulasi delay sedikit agar user lihat proses "Mencari" (Opsional)
      setTimeout(() => {
        const data = resMatch.data.data;
        setMatchData(data); // Simpan hasil matching
        setIsMatching(false);
        setShowResult(true);
        setLoading(false);
      }, 2000);
    } catch (error) {
    console.error("Error:", error);
    alert("Gagal memproses permintaan");
    setLoading(false);
    setIsMatching(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col font-sans relative overflow-hidden">
      {/* HEADER SECTION (Dinamis dari Profil) */}
      <div className="px-5 pt-10 pb-4 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Input Kebutuhan</h1>
            <p className="text-sm opacity-80 mt-1">
              Lengkapi formulir permintaan Anda
            </p>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold">
            Tersedia
          </p>
          <p className="text-xs font-bold text-gray-800">
            {stats.count} Produk
          </p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase font-bold">
            Total Nilai
          </p>
          <p className="text-xs font-bold text-gray-800">
            Rp {(stats.value / 1000000).toFixed(0)}Jt
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Pasar</p>
          <p className="text-xs font-bold text-[#7a8c2e]">Stabil ↗</p>
        </div>
      </div>

      {/* FORM CONTENT */}
      <div className="flex-1 bg-white rounded-t-3xl px-5 pt-8 pb-28 shadow-xl overflow-y-auto">
        <div className="bg-[#f9faf5] rounded-[30px] p-6 border border-[#7a8c2e]/10">
          <h3 className="font-bold text-[#3a4e10] mb-6 text-sm flex items-center gap-2">
            <Icon icon="mdi:form-select" className="text-lg" />
            Formulir Permintaan Komoditas
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-[10px] text-gray-400 font-bold ml-1 mb-1 block uppercase">
                Komoditas
              </label>
              <input
                className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#7a8c2e] outline-none shadow-sm"
                placeholder="Contoh: Cabai Merah"
                value={formData.nama_komoditas}
                onChange={(e) =>
                  handleInputChange("nama_komoditas", e.target.value)
                }
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold ml-1 mb-1 block uppercase">
                Jumlah (Kg)
              </label>
              <input
                type="number"
                className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#7a8c2e] outline-none shadow-sm"
                placeholder="0"
                value={formData.jumlah}
                onChange={(e) => handleInputChange("jumlah", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold ml-1 mb-1 block uppercase">
                Tanggal Dibutuhkan
              </label>
              <input
                type="date"
                className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#7a8c2e] outline-none shadow-sm"
                value={formData.tanggal}
                onChange={(e) => handleInputChange("tanggal", e.target.value)}
              />
            </div>

            {/* Ringkasan Box */}
            <div className="bg-[#f0f4e4] border-l-4 border-[#7a8c2e] rounded-xl p-4 mb-6">
              <h4 className="font-bold text-[#3a4e10] text-[10px] uppercase tracking-widest mb-1">
                Ringkasan
              </h4>
              <p className="text-gray-700 text-xs font-semibold">
                {formData.nama_komoditas || "..."}, {formData.jumlah || "0"} Kg,
                Grade {formData.kualitas}
              </p>
            </div>

            {/* Dropdown Kualitas */}
            <div className="relative">
              <label className="text-[10px] text-gray-400 font-bold ml-1 mb-1 block uppercase">
                Kualitas
              </label>
              <div
                onClick={() => setShowKualitas(!showKualitas)}
                className="flex justify-between items-center bg-[#7a8c2e] text-white px-4 py-3 rounded-2xl text-sm font-bold cursor-pointer"
              >
                <span>Grade {formData.kualitas}</span>
                <Icon icon="mdi:chevron-down" />
              </div>
              {showKualitas && (
                <div className="absolute top-[100%] left-0 w-full bg-white border border-gray-100 mt-2 rounded-2xl shadow-xl z-30 overflow-hidden">
                  {listKualitas.map((q) => (
                    <div
                      key={q}
                      onClick={() => {
                        handleInputChange("kualitas", q);
                        setShowKualitas(false);
                      }}
                      className="px-4 py-3 text-sm hover:bg-[#f0f4e4] cursor-pointer"
                    >
                      Grade {q}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#3a4e10] text-white py-4 rounded-2xl font-bold text-base shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Ajukan Permintaan Beli"}
          </button>
        </div>
      </div>

      {/* --- OVERLAY: MENCARI PETANI --- */}
      {isMatching && (
        <div className="fixed inset-0 bg-[#7a8c2e]/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white px-10 text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">
              🔍
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Menganalisis Stok...</h2>
          {/* GANTI KALIMAT DI BAWAH INI */}
          <p className="text-sm opacity-80 italic">
            Sistem sedang mencocokkan permintaan Anda dengan seluruh database
            mitra petani kami...
          </p>
        </div>
      )}

      {/* --- MODAL HASIL MATCHING (Dinamis) --- */}
      {showResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center px-6">
          <div className="bg-white w-full max-w-sm rounded-[35px] p-8 text-center shadow-2xl animate-in zoom-in duration-300">
            {/* KONDISI A: STOK DITEMUKAN (PETANI > 0) */}
            {matchData?.list_petani?.length > 0 ? (
              <>
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  ✅
                </div>
                <h2 className="text-xl font-black text-gray-800 mb-1">
                  Permintaan Cocok!
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Kami menemukan stok dari{" "}
                  <span className="font-bold text-[#7a8c2e]">
                    {matchData.list_petani.length} Petani
                  </span>
                  . Total terkumpul:{" "}
                  <span className="font-bold text-gray-800">
                    {matchData.total_ditemukan} Kg
                  </span>
                  .
                </p>
                <button
                  onClick={() => navigate("/riwayat-pedagang")}
                  className="w-full bg-[#3a4e10] text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                >
                  Lihat Hasil Matching
                </button>
              </>
            ) : (
              /* KONDISI B: STOK TIDAK DITEMUKAN (KOSONG) */
              <>
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  ❌
                </div>
                <h2 className="text-xl font-black text-gray-800 mb-1">
                  Stok Belum Tersedia
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Maaf, saat ini belum ada petani yang memiliki stok{" "}
                  <span className="font-bold text-red-600">
                    {formData.nama_komoditas} Grade {formData.kualitas}
                  </span>
                  .
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowResult(false);
                      setFormData({ ...formData, nama_komoditas: "" }); // Reset nama untuk coba lagi
                    }}
                    className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold active:scale-95 transition-all"
                  >
                    Coba Komoditas Lain
                  </button>
                  <button
                    onClick={() => navigate("/riwayat-pedagang")}
                    className="w-full text-[#7a8c2e] py-2 text-xs font-bold underline"
                  >
                    Tetap Simpan di Riwayat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <BottomNav role="pedagang" />
    </div>
  );
}
