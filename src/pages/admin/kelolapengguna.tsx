import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../../services/api";
import { FaTrash } from "react-icons/fa";
import "./kelolapengguna.css";

export default function KelolaPengguna() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [popupMsg, setPopupMsg] = useState("");

  // Fungsi hapus user
  // Tampilkan modal konfirmasi
  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Tutup modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Hapus user setelah konfirmasi
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await authAPI.deleteUser(selectedUser._id);
      setUsers(users.filter(u => u._id !== selectedUser._id));
      setPopupMsg("User berhasil dihapus!");
    } catch (err) {
      setPopupMsg("Gagal menghapus user");
    } finally {
      closeModal();
      setTimeout(() => setPopupMsg(""), 2000);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getUsers();
        setUsers(res.data);
      } catch (err: any) {
        setError("Gagal mengambil data pengguna");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Statistik (admin tidak dihitung)
  const nonAdminUsers = users.filter(u => u.role !== "admin");
  // Filter pencarian
  const filteredUsers = nonAdminUsers.filter(u =>
    u.nama?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPengguna = nonAdminUsers.length;
  const penggunaAktif = nonAdminUsers.filter(u =>
    u.status ? u.status === "Aktif" : true
  ).length;
  const validasiTertunda = nonAdminUsers.filter(
    u => u.status === "Tertunda"
  ).length;

  return (
    <div className="page">
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* HEADER */}
      <div className="header">
        <div>
          <h2>Hallo, Admin</h2>
          <p className="date">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* TITLE */}
      <h3 className="title">Kelola Data Pengguna</h3>

      {/* CARD */}
      <div className="card">
        <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Daftar Pengguna & Status</h4>

        {/* STATS */}
        <div className="stats">
          <div className="stat">
            <p style={{ fontSize: 15, fontWeight: 600 }}>Total Pengguna</p>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{totalPengguna}</h2>
          </div>
          <div className="stat">
            <p style={{ fontSize: 15, fontWeight: 600 }}>Pengguna Aktif</p>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{penggunaAktif}</h2>
          </div>
          <div className="stat">
            <p style={{ fontSize: 15, fontWeight: 600 }}>Validasi Tertunda</p>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{validasiTertunda}</h2>
          </div>
        </div>

        <div style={{ position: "relative", margin: "18px 0 14px 0" }}>
          <span style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 16
          }}>🔍</span>
          <input
            type="text"
            placeholder="Cari nama atau peran pengguna..."
            className="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 14px 8px 38px",
              borderRadius: 20,
              border: "1.2px solid #cfd8dc",
              fontSize: 15,
              outline: "none",
              background: "#f8fafc",
              boxShadow: "0 1px 6px #0001"
            }}
          />
        </div>

        {/* TABLE */}
        <div className="table">

          {/* HEADER */}
          <div className="thead">
            <span>Nama Pengguna</span>
            <span>Peran</span>
            <span>Status</span>
            <span>Aksi</span>
          </div>

          {/* ROW */}
          {filteredUsers.map((u, i) => (
            <div className="row" key={i}>
              <span>{u.nama}</span>
              <span>👤 {u.role}</span>
              <span className={u.status === "Tertunda" ? "pending" : "active"}>
                {u.status || "Aktif"}
              </span>
              <span className="actions">
                <span className="action-item delete" onClick={() => openDeleteModal(u)}>
                  <FaTrash />
                  <small>Hapus</small>
                </span>
              </span>
            </div>
          ))}
              {/* MODAL KONFIRMASI HAPUS */}
              {showModal && (
                <div style={{
                  position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                  <div style={{ background: "#fff", padding: 24, borderRadius: 12, minWidth: 300, boxShadow: "0 2px 12px #0002", textAlign: "center" }}>
                    <h3>Konfirmasi Hapus</h3>
                    <p>Yakin ingin menghapus user <b>{selectedUser?.nama}</b>?</p>
                    <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16 }}>
                      <button style={{ background: "#e74c3c", color: "#fff", border: 0, borderRadius: 6, padding: "8px 18px", cursor: "pointer" }} onClick={handleDelete}>Hapus</button>
                      <button style={{ background: "#aaa", color: "#fff", border: 0, borderRadius: 6, padding: "8px 18px", cursor: "pointer" }} onClick={closeModal}>Batal</button>
                    </div>
                  </div>
                </div>
              )}

              {/* POPUP NOTIFIKASI */}
              {popupMsg && (
                <div style={{
                  position: "fixed", top: "20%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", color: "#333", padding: "16px 32px", borderRadius: 10, boxShadow: "0 2px 12px #0002", zIndex: 1100, fontWeight: 500
                }}>
                  {popupMsg}
                </div>
              )}
        </div>

        {/* FOOTER */}
        <p className="footer">
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

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <Link to="/monitoring" className="nav-btn">
          Monitoring
        </Link>
        <Link to="/kelola-pengguna" className="nav-btn active">
          Pengguna
        </Link>
      </div>
    </div>
  );
}
