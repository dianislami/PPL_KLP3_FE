import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { permintaanAPI } from "../../services/api";
import { Icon } from "@iconify/react";

const IconCheckStatus = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" fill="#4CAF50" />
    <path
      d="M8 12L11 15L16 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function StatusPengiriman() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      permintaanAPI
        .getById(id)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log("Gagal ambil data status", err));
    }
  }, [id]);

  if (!data)
    return (
      <div className="p-20 text-center">Data status tidak ditemukan...</div>
    );

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex flex-col pb-28">
      {/* Header Section */}
      <div className="bg-[#7a8c2e] px-5 pt-10 pb-12 text-white relative flex-shrink-0">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-white uppercase">
            Hallo, {user?.nama?.split(" ")[0]}
          </h1>
          <div className="w-10 h-10 rounded-full bg-[#9aaa3f] flex items-center justify-center">
            🏪
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
          <Icon icon="mdi:map-marker" className="text-xl text-[#dce6a7]" />
          <div className="text-[11px]">
            <p className="font-bold uppercase tracking-wider">{user?.nama}</p>
            <p className="opacity-90 leading-tight">
              {user?.alamat || "Banda Aceh"}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Headers */}
      <div className="px-5 mt-4">
        <h2 className="text-black font-bold text-lg leading-tight uppercase">
          Status Pengiriman {data.nomor_permintaan}
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 mt-4 z-10">
        <div className="bg-white rounded-[30px] p-6 shadow-lg mb-10">
          <h3 className="font-bold text-[#7a8c2e] mb-8 text-base uppercase tracking-tighter">
            {data.nama_komoditas} Purchase Completed
          </h3>

          <div className="relative space-y-8 ml-2">
            {/* Step 1 */}
            <div className="flex items-start gap-4 relative">
              <div className="absolute left-[15px] top-[32px] bottom-[-32px] border-l-2 border-[#4CAF50]"></div>
              <IconCheckStatus />
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  Permintaan Diajukan
                </p>
                <p className="text-gray-500 text-[10px]">Validasi Berhasil</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 relative">
              <div className="absolute left-[15px] top-[32px] bottom-[-32px] border-l-2 border-[#4CAF50]"></div>
              <IconCheckStatus />
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  Matching Petani
                </p>
                <p className="text-gray-500 text-[10px]">
                  Sistem Menemukan Mitra
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 relative">
              <div className="absolute left-[15px] top-[32px] bottom-[-32px] border-l-2 border-[#4CAF50]"></div>
              <IconCheckStatus />
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  Pasokan Terkonfirmasi
                </p>
                <p className="text-gray-500 text-[10px] leading-tight">
                  Konfirmasi Harga Selesai
                </p>
              </div>
            </div>

            {/* Step 4: Selesai */}
            <div className="flex items-start gap-4">
              <IconCheckStatus />
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  Pesanan Selesai
                </p>
                <p className="text-[#4CAF50] text-[10px] font-bold uppercase">
                  Barang Telah Diterima
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-[10px] text-gray-400">
              Transaksi ini telah diarsipkan oleh sistem
            </p>
          </div>
        </div>
      </div>

      <BottomNav role="pedagang" />
    </div>
  );
}
