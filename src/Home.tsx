import { useNavigate } from "react-router-dom";
import "./Home.css";
import "./Home-desktop.css";
import card1 from "./assets/images/card1.jpg";
import landingpage from "./assets/images/Landingpage.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="phone">

      {/* HERO */}
      <div className="hero">
        <img
          src={landingpage}
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

        {/* BUTTON KHUSUS DESKTOP */}
        <button
          className="cta desktop-only"
          onClick={() => navigate("/login")}
        >
          Start Farming <span>›››</span>
        </button>
      </div>

      {/* BOTTOM (MOBILE) */}
      <div className="bottom">

        <div className="cards">

          {/* LEFT CARD */}
          <div className="card yellow tilt-left">
            <span className="label">Panen Cerdas</span>
            <p>Mengoptimalkan hasil panen dengan teknologi</p>
          </div>

          {/* CENTER IMAGE */}
          <div className="img-card center">
            <img src={card1} alt="center" />
          </div>

          {/* RIGHT CARD */}
          <div className="card dark tilt-right">
            <span className="label white">Pasar Tani</span>
            <p>Menghubungkan petani dan pembeli secara langsung</p>
          </div>

        </div>

        {/* BUTTON MOBILE */}
        <button
          className="cta mobile-only"
          onClick={() => navigate("/login")}
        >
          Start Farming <span>›››</span>
        </button>

      </div>
    </div>
  );
}
