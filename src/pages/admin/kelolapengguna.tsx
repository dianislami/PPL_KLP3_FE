

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../../services/api";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import "./kelolapengguna.css";

export default function KelolaPengguna() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const nonAdminUsers = users.filter(u => u.role !== 'admin');
  const totalPengguna = nonAdminUsers.length;
  const penggunaAktif = nonAdminUsers.filter(u => (u.status ? u.status === 'Aktif' : true)).length;
  const validasiTertunda = nonAdminUsers.filter(u => u.status === 'Tertunda').length;

  return (
    <div className="page">
      {loading && <div>Loading...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      {/* HEADER */}
      <div className="header">
        <div>
          <h2>Hallo, Admin</h2>
          <p className="date">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* TITLE */}
      <h3 className="title">Kelola Data Pengguna</h3>

      {/* CARD */}
      <div className="card">
        <h4>Daftar Pengguna & Status</h4>

        {/* STATS */}
        <div className="stats">
          <div className="stat">
            <p>Total Pengguna</p>
            <h2>{totalPengguna}</h2>
          </div>
          <div className="stat">
            <p>Pengguna Aktif</p>
            <h2>{penggunaAktif}</h2>
          </div>
          <div className="stat">
            <p>Validasi Tertunda</p>
            <h2>{validasiTertunda}</h2>
          </div>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Cari data disini"
          className="search"
        />

        {/* TABLE */}
        <div className="table">
          <div className="thead">
            <span>Nama Pengguna</span>
            <span>Peran</span>
            <span>Status</span>
            <span>Aksi</span>
          </div>

          {nonAdminUsers.map((u, i) => (
              <div
                className="row"
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
                  alignItems: 'center',
                  padding: '8px 0',
                }}
              >
                <span style={{ textAlign: 'left', wordBreak: 'break-word' }}>{u.nama}</span>
                <span style={{ textAlign: 'center' }}>👤 {u.role}</span>
                <span className={u.status === 'Tertunda' ? 'pending' : 'active'} style={{ textAlign: 'center' }}>{u.status || 'Aktif'}</span>
                <span className="actions" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 13 }}>
                    <FaEye style={{ fontSize: 18 }} />
                    <span>Lihat</span>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 13 }}>
                    <FaTrash style={{ fontSize: 18 }} />
                    <span>Hapus</span>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 13 }}>
                    <FaEdit style={{ fontSize: 18 }} />
                    <span>Edit</span>
                  </span>
                </span>
              </div>
            ))}
        </div>

        <p className="footer">
          Terakhir sinkronisasi: {new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
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
