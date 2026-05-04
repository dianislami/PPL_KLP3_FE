import React, { useEffect, useState } from "react";
import "./Monitoring.css";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { panenAPI } from "../../services/api";




const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const MonitoringPage: React.FC = () => {
  const [panen, setPanen] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPanen = async () => {
      try {
        const res = await panenAPI.getAll();
        setPanen(res.data);
      } catch (err) {
        setError("Gagal mengambil data panen");
      } finally {
        setLoading(false);
      }
    };
    fetchPanen();
  }, []);

  // Hitung statistik
  const totalPanen = panen.reduce((sum, p) => sum + (p.jumlah || 0), 0);
  // Dummy: total transaksi = jumlah data panen
  const totalTransaksi = panen.length;
  // Dummy: recovery = jumlah panen dengan kualitas mengandung 'grade c' atau 'rusak'
  const totalRecovery = panen.filter(p => /grade c|rusak/i.test(p.kualitas || "")).reduce((sum, p) => sum + (p.jumlah || 0), 0);

  // Data chart bulanan
  const chartData = months.map((m, idx) => {
    const monthPanen = panen.filter(p => {
      const tgl = new Date(p.tanggal);
      return tgl.getMonth() === idx;
    });
    return {
      name: m,
      panen: monthPanen.reduce((sum, p) => sum + (p.jumlah || 0), 0),
      distribusi: monthPanen.length, // dummy: jumlah distribusi = jumlah panen
    };
  });

  return (
    <div className="page">
      {loading && <div>Loading...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      {/* HEADER */}
      <div className="header">
        <div>
          <h2>Hallo, Admin</h2>
          <div className="date">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      {/* TITLE */}
      <div className="title" style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Monitoring Dashboard & Analitik</div>

      {/* CARD */}
      <div className="card">
        <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Analitik Transaksi & Panen Sirkular</h4>

        {/* STATS */}
        <div className="stats">
          <div className="stat">
            <p style={{ fontSize: 15, fontWeight: 600 }}>Total Panen</p>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{totalPanen.toFixed(1)} <span style={{fontSize:13, fontWeight:400}}>Ton</span></h2>
          </div>
          <div className="stat">
            <p style={{ fontSize: 15, fontWeight: 600 }}>Transaksi</p>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{totalTransaksi}</h2>
          </div>
          <div className="stat">
            <p style={{ fontSize: 15, fontWeight: 600 }}>Recovery</p>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{totalRecovery.toFixed(1)} <span style={{fontSize:13, fontWeight:400}}>Ton</span></h2>
          </div>
        </div>

        {/* CHART */}
        <div className="chart-box">
          <LineChart
            width={720}
            height={300}
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #ccc', borderRadius: 8 }}
              formatter={(value: any, name: any) => [`${value}`, name === 'panen' ? 'Panen (Ton)' : 'Distribusi']}
            />
            <Line
              type="monotone"
              dataKey="panen"
              stroke="#556B2F"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="distribusi"
              stroke="#8B0000"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>

        {/* FOOTER */}
        <div className="footer">
          Terakhir sinkronisasi: {new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <Link to="/monitoring" className="nav-btn active">
          Monitoring
        </Link>
        <Link to="/kelola-pengguna" className="nav-btn">
          Pengguna
        </Link>
      </div>
    </div>
  );
};

export default MonitoringPage;