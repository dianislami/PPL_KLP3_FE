import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="phone">

      {/* HERO */}
      <div className="hero">
        <img
          src="/src/assets/Landingpage.jpg"
          className="hero-img"
          alt="hero"
        />
        <div className="overlay" />

        <div className="hero-content">
          <p className="brand">SmartHarvest</p>
          <h1 className="title">
            Better Health <br /> Higher Yield
          </h1>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="bottom">

        <div className="cards">

          {/* LEFT CARD */}
          <div className="card yellow tilt-left">
            <span className="label">Panen Cerdas</span>
            <p>Mengoptimalkan hasil panen dengan teknologi</p>
          </div>

          {/* CENTER IMAGE */}
          <div className="img-card center">
            <img src="/src/assets/card1.jpg" alt="center" />
          </div>

          {/* RIGHT CARD */}
          <div className="card dark tilt-right">
            <span className="label white">Pasar Tani</span>
            <p>Menghubungkan petani dan pembeli secara langsung</p>
          </div>

        </div>

        {/* BUTTON NAVIGATE */}
        <button
          className="cta"
          onClick={() => navigate("/login")}
        >
          Start Farming <span>›››</span>
        </button>

      </div>
    </div>
  );
}
