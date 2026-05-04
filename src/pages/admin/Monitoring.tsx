import React from "react";
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

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => {
  return (
    <div className="stat">
      <div className="stat-title">{title}</div>
      <h2>
        {value} {subtitle && <span>{subtitle}</span>}
      </h2>
    </div>
  );
};

// ✅ DATA DUMMY
const data = [
  { name: "Jan", panen: 40, distribusi: 30 },
  { name: "Feb", panen: 60, distribusi: 50 },
  { name: "Mar", panen: 80, distribusi: 70 },
  { name: "Apr", panen: 100, distribusi: 90 },
];

const MonitoringPage: React.FC = () => {
  return (
    <div className="page">
      {/* HEADER */}
      <div className="header">
        <div>
          <h2>Hallo, Admin</h2>
          <div className="date">Minggu, 11 April 2026</div>
        </div>
        <div className="profile">👤</div>
      </div>

      {/* TITLE */}
      <div className="title">Monitoring Dashboard & Analitik</div>

      {/* CARD */}
      <div className="card">
        <h3>Analitik Transaksi & Panen Sirkular</h3>

        {/* STATS */}
        <div className="stats">
          <StatCard title="Total Panen" value="20.4" subtitle="Ton" />
          <StatCard title="Transaksi" value="220" />
          <StatCard title="Recovery" value="1.5" subtitle="Ton" />
        </div>

        {/* ✅ CHART */}
        <div className="chart-box">
          <h4>Tren Panen & Distribusi</h4>

          <LineChart
            width={720}
            height={300}
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="panen"
              stroke="#556B2F"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="distribusi"
              stroke="#8B0000"
              strokeWidth={2}
            />
          </LineChart>
        </div>

        {/* FOOTER */}
        <div className="footer">
          Terakhir sinkronisasi: 11 Apr 2026, 12:00 WIB
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