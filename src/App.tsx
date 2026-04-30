import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardPetani from "./pages/petani/DashboardPetani";
import TambahPanen from "./pages/petani/TambahPanen";
import RiwayatPanen from "./pages/petani/RiwayatPanen";
import InputKebutuhan from "./pages/pedagang/InputKebutuhan";
import DaftarPanen from "./pages/pedagang/DaftarPanen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard-petani" element={<DashboardPetani />} />
      <Route path="/tambah-panen" element={<TambahPanen />} />
      <Route path="/riwayat-panen" element={<RiwayatPanen />} />
      <Route path="/input-kebutuhan" element={<InputKebutuhan />} />
      <Route path="/daftar-panen" element={<DaftarPanen />} /> 
    </Routes>
  );
}
