import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../../services/api";
import { Icon } from "@iconify/react";

export default function KelolaPengguna() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [popupMsg, setPopupMsg] = useState("");

  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await authAPI.deleteUser(selectedUser._id);
      setUsers(users.filter((u) => u._id !== selectedUser._id));
      setPopupMsg("User berhasil dihapus!");
    } catch {
      setPopupMsg("Gagal menghapus user");
    } finally {
      closeModal();
      setTimeout(() => setPopupMsg(""), 2000);
    }
  };

  useEffect(() => {
    authAPI
      .getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setError("Gagal mengambil data pengguna"))
      .finally(() => setLoading(false));
  }, []);

  const nonAdminUsers = users.filter((u) => u.role !== "admin");
  const filteredUsers = nonAdminUsers.filter(
    (u) =>
      u.nama?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPengguna = nonAdminUsers.length;
  const penggunaAktif = nonAdminUsers.filter((u) =>
    u.status ? u.status === "Aktif" : true
  ).length;
  const validasiTertunda = nonAdminUsers.filter(
    (u) => u.status === "Tertunda"
  ).length;

  const ICONS = {
    trash: 'mdi:trash-can-outline',
    search: 'mdi:magnify',
  };

  const stats = [
    { label: "Total", value: totalPengguna, unit: "Orang", icon: "mdi:account-multiple", color: "text-[#5a6e1a]" },
    { label: "Pengguna", value: penggunaAktif, unit: "Aktif", icon: "mdi:check-circle", color: "text-blue-600" },
    { label: "Validasi", value: validasiTertunda, unit: "Tertunda", icon: "mdi:clock-outline", color: "text-orange-600" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* Header */}
      <div className="bg-[#7a8c2e] px-6 pt-12 pb-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Hallo, Admin</h1>
            <p className="text-sm opacity-80 mt-1">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-2xl shadow">
            🛡️
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 -mt-5 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative mb-5">
        {stats.map((s) => (
          <div key={s.label} className="text-center py-1">
            <Icon icon={s.icon} className="text-2xl text-[#7a8c2e] inline-block" />
            <p className={`text-sm font-bold mt-1.5 ${s.color}`}>
              {s.value}{" "}
              <span className="text-[10px] font-normal text-gray-400">{s.unit}</span>
            </p>
            <p className="text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-32">

        {loading && (
          <div className="flex items-center justify-center py-10 gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#7a8c2e] border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">Memuat data...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-800">Kelola Data Pengguna</h2>
              <p className="text-xs text-gray-400 mt-0.5">Daftar pengguna terdaftar</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Icon icon={ICONS.search} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Cari nama atau peran pengguna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#7a8c2e] focus:ring-1 focus:ring-[#7a8c2e] transition-all"
            />
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[3fr_2fr_2fr_2fr] px-3 py-2 text-[11px] font-semibold text-gray-500 border-b border-gray-100">
            <span>Nama Pengguna</span>
            <span className="text-center">Peran</span>
            <span className="text-center">Status</span>
            <span className="text-center">Aksi</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-50">
            {filteredUsers.map((u, i) => (
              <div
                key={i}
                className="grid grid-cols-[3fr_2fr_2fr_2fr] px-3 py-3 text-xs items-center hover:bg-gray-50 rounded-xl transition-colors"
              >
                <span className="font-medium text-gray-700">{u.nama}</span>
                <span className="text-center text-gray-500">{u.role}</span>
                <span
                  className={`text-center font-semibold ${
                    u.status === "Tertunda" ? "text-orange-500" : "text-green-600"
                  }`}
                >
                  {u.status || "Aktif"}
                </span>
                <span
                  onClick={() => openDeleteModal(u)}
                  className="flex flex-col items-center gap-0.5 text-red-500 cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <Icon icon={ICONS.trash} className="text-lg" />
                  <small className="text-[10px]">Hapus</small>
                </span>
              </div>
            ))}

            {filteredUsers.length === 0 && !loading && (
              <p className="text-xs text-gray-400 text-center py-6">
                Belum ada data pengguna
              </p>
            )}
          </div>

          <p className="text-center text-[10px] text-gray-300 mt-4">
            Terakhir sinkronisasi:{" "}
            {new Date().toLocaleString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            WIB
          </p>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <p className="text-2xl mb-2">🗑️</p>
            <h3 className="text-base font-bold text-gray-800 mb-1">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-500 mb-5">
              Yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-700">{selectedUser?.nama}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-full bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Notifikasi */}
      {popupMsg && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-gray-700 px-6 py-3 rounded-2xl shadow-lg text-sm font-medium z-[60]">
          {popupMsg}
        </div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-6 left-4 right-4 bg-black rounded-full flex p-2 shadow-xl z-50">
        <Link
          to="/monitoring"
          className="flex-1 py-2.5 rounded-full text-center text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Monitoring
        </Link>
        <Link
          to="/kelola-pengguna"
          className="flex-1 py-2.5 rounded-full text-center text-sm font-semibold bg-[#7a8c2e] text-white"
        >
          Pengguna
        </Link>
        <Link
          to="/profil-admin"
          className="flex-1 py-2.5 rounded-full text-center text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Profil
        </Link>
      </div>
    </div>
  );
}