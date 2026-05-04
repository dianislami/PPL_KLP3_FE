import { useState, useRef, useEffect } from "react";
import BottomNav from "../../components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";
import { panenAPI } from "../../services/api";

const IconChevron = ({ isOpen }: { isOpen: boolean }) => (
  <div
    className={`bg-black/20 rounded-full p-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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

export default function TambahPanen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dateRef = useRef<HTMLInputElement>(null);

  const [tanaman, setTanaman] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [kualitas, setKualitas] = useState(""); 
  const [gambar, setGambar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showKualitas, setShowKualitas] = useState(false);
  const [panenList, setPanenList] = useState<any[]>([]);

  const listKualitas = [
    { value: "A", label: "Grade A" },
    { value: "B", label: "Grade B" },
    { value: "C", label: "Grade C" },
  ];

  const kualitasLabel =
    listKualitas.find((k) => k.value === kualitas)?.label ?? "Pilih Kualitas";

  useEffect(() => {
    const fetchPanen = async () => {
      try {
        const response = await panenAPI.getAll();
        const userPanen = response.data.filter(
          (item: any) => item.user_id?._id === user?.id,
        );
        setPanenList(userPanen);
      } catch {
        console.error("Failed to fetch panen");
      }
    };
    if (user?.id) fetchPanen();
  }, [user?.id]);

  const handleSimpan = async () => {
    setError("");
    setSuccess("");

    if (!tanaman || !jumlah || !harga || !tanggal || !kualitas || !deskripsi) {
      setError("Semua field harus diisi");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", user?.id || "");
      formData.append("nama_komoditas", tanaman);
      formData.append("jumlah", jumlah);
      formData.append("harga", harga);
      formData.append("kualitas", kualitas);
      formData.append("status", "Tersedia"); 
      formData.append("lokasi", user?.alamat || "Banda Aceh"); 
      formData.append("tanggal", new Date(tanggal).toISOString());
      formData.append("deskripsi", deskripsi);
      if (gambar) formData.append("gambar", gambar);

      const response = await fetch("http://localhost:5000/api/panen", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Gagal menambahkan panen");

      setSuccess("Panen berhasil ditambahkan!");
      setTimeout(() => navigate("/dashboard-petani"), 1500);
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan panen");
    } finally {
      setLoading(false);
    }
  };

  const handleGambar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setGambar(e.target.files[0]);
  };

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
      <style>{`
        /* Hide native date input icon (Chrome/Safari) */
        .hide-date::-webkit-calendar-picker-indicator {
          display: none;
          -webkit-appearance: none;
        }
        /* Hide spinner on number inputs if any */
        .hide-date::-webkit-inner-spin-button, .hide-date::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
      {/* Header */}
      <div className="px-6 py-6 text-white">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h1 className="text-3xl font-bold">Tambah Data</h1>
            <p className="text-sm opacity-80">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => navigate("/riwayat-panen")}
            className="flex gap-2 items-center text-xs bg-white/20 rounded-full px-3 py-1.5"
          >
            Riwayat
          </button>
        </div>
      </div>

      {/* Stats Area */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Total Item
          </p>
          <p className="text-xs font-bold text-gray-800">{panenList.length}</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Volume
          </p>
          <p className="text-xs font-bold text-gray-800">
            {(panenList.reduce((s, i) => s + i.jumlah, 0) / 1000).toFixed(1)}{" "}
            Ton
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Status
          </p>
          <p className="text-xs font-bold text-[#7a8c2e]">AKTIF</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-4 pt-8 px-5 pb-28 overflow-y-auto">
        <h2 className="text-base font-semibold text-gray-500 mb-4">
          Input Hasil Panen
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 mb-4 flex items-center gap-2">
            <Icon
              icon="mdi:alert-circle-outline"
              className="text-red-500 flex-shrink-0"
            />
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-700 mb-4 flex items-center gap-2">
            <Icon
              icon="mdi:check-circle-outline"
              className="text-green-500 flex-shrink-0"
            />
            {success}
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
            value={tanaman}
            onChange={(e) => setTanaman(e.target.value)}
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
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
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
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
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
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />
        </div>

        {/* Tanggal & Foto */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-3 py-3 shadow-sm">
            <div
              onClick={() => dateRef.current?.showPicker()}
              className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-base flex-shrink-0 cursor-pointer"
            >
              <Icon icon="mdi:calendar-range-outline" />
            </div>
            <input
              ref={dateRef}
              type="date"
              className="flex-1 text-xs bg-transparent outline-none text-gray-400 hide-date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 bg-white border-2 border-dashed border-[#c8d4a0] rounded-2xl px-3 py-3 cursor-pointer">
            <div className="w-9 h-9 bg-[#f0f4e0] text-[#7a8c2e] rounded-xl flex items-center justify-center text-base flex-shrink-0">
              <Icon icon="mdi:camera-outline" />
            </div>
            <p className="text-xs font-medium text-gray-500 truncate">
              {gambar ? gambar.name.slice(0, 10) + "…" : "Foto panen"}
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGambar}
            />
          </label>
        </div>

        {/* ── Kualitas & Status — dropdown style InputKebutuhan ── */}
        <div className="grid grid-cols gap-3 mb-5">
          {/* Kualitas Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowKualitas((v) => !v);
              }}
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
                      setKualitas(item.value);
                      setShowKualitas(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm border-b border-[#7a8c2e]/20 last:border-0 transition-colors ${
                      kualitas === item.value
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
        </div>

        {/* Simpan */}
        <button
          onClick={handleSimpan}
          disabled={loading}
          className="w-full bg-[#7a8c2e] hover:bg-[#6a7a26] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full text-base transition-all shadow-md mb-3 active:scale-95"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Icon icon="mdi:loading" className="animate-spin text-xl" />
              Menyimpan...
            </span>
          ) : (
            "Simpan"
          )}
        </button>

        <button
          onClick={() => navigate("/panduan-kualitas")} // <--- Ubah ini
          className="text-center text-xs text-[#7a8c2e] underline cursor-pointer mt-2 w-full"
        >
          Lihat panduan kualitas panen
        </button>
      </div>

      <BottomNav role="petani" />
    </div>
  );
}