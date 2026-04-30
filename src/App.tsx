import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardPetani from "./pages/petani/DashboardPetani";
import TambahPanen from "./pages/petani/TambahPanen";
import RiwayatPanen from "./pages/petani/RiwayatPanen";
import ProfilPetani from "./pages/petani/ProfilPetani";
import InputKebutuhan from "./pages/pedagang/InputKebutuhan";
import DaftarPanen from "./pages/pedagang/DaftarPanen";
import PemulihanPanen from "./pages/petani/PemulihanPanen";
import StatusPengiriman from "./pages/petani/StatusPengiriman";
import DetailArtikel from "./pages/petani/DetailArtikel";
import Chat from "./pages/petani/Chat";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard-petani" element={<DashboardPetani />} />
      <Route path="/tambah-panen" element={<TambahPanen />} />
      <Route path="/pemulihan-panen" element={<PemulihanPanen />} />
      <Route path="/riwayat-panen" element={<RiwayatPanen />} />
      <Route path="/profil-petani" element={<ProfilPetani />} />
      <Route path="/status-pengiriman" element={<StatusPengiriman />} />
      <Route path="/input-kebutuhan" element={<InputKebutuhan />} />
      <Route path="/daftar-panen" element={<DaftarPanen />} /> 
      <Route path="/detail-artikel/:id" element={<DetailArtikel />} />
      <Route path="/chat/:nama?" element={<Chat />} />
    </Routes>
  );
}
