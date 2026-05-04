import { Link } from "react-router-dom";
import "./kelolapengguna.css";

export default function kelolapengguna() {
  const users = Array(6).fill({
    nama: "Lorem Ipsum",
    peran: "Petani",
    status: "Aktif",
  });

  return (
    <div className="page">
      {/* HEADER */}
      <div className="header">
        <div>
          <h2>Hallo, Admin</h2>
          <p className="date">Minggu, 11 April 2026</p>
        </div>
        <div className="profile">👤</div>
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
            <h2>20</h2>
          </div>
          <div className="stat">
            <p>Pengguna Aktif</p>
            <h2>8</h2>
          </div>
          <div className="stat">
            <p>Validasi Tertunda</p>
            <h2>5</h2>
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

          {users.map((u, i) => (
            <div className="row" key={i}>
              <span>{u.nama}</span>
              <span>👨‍🌾 {u.peran}</span>
              <span className="active">{u.status}</span>
              <span className="actions">
                👁 Hapus Edit
              </span>
            </div>
          ))}
        </div>

        <p className="footer">
          Terakhir sinkronisasi: 11 Apr 2026, 12:00 WIB
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
