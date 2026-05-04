import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardPetani from "./pages/petani/DashboardPetani";
import TambahPanen from "./pages/petani/TambahPanen";
import RiwayatPanen from "./pages/petani/RiwayatPanen";
import PemulihanPanen from "./pages/petani/PemulihanPanen";
import DetailPanen from "./pages/petani/DetailPanen";
import StatusPengiriman from "./pages/petani/StatusPengiriman";
import DetailArtikel from "./pages/petani/DetailArtikel";
import Chat from "./pages/petani/Chat";
import ProfilPetani from "./pages/petani/ProfilPetani";
import DashboardPedagang from "./pages/pedagang/DashboardPedagang";
import ProfilPedagang from "./pages/pedagang/ProfilPedagang";
import InputKebutuhan from "./pages/pedagang/InputKebutuhan";
import DaftarPanen from "./pages/pedagang/DaftarPanen";
import HasilMatching from "./pages/pedagang/HasilMatching";
import RiwayatPedagang from "./pages/pedagang/RiwayatPedagang";
import StatusPengirimanPedagang from "./pages/pedagang/StatusPengirimanPedagang";
import DetailProduk from "./pages/pedagang/DetailProduk";
import UbahKataSandi from "./pages/petani/UbahKataSandi";
import PanduanKualitas from "./pages/petani/PanduanKualitas";

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
      <Route path="/detail-panen/:id" element={<DetailPanen />} />
      <Route path="/profil-petani" element={<ProfilPetani />} />
      <Route path="/ubah-kata-sandi" element={<UbahKataSandi />} />
      <Route path="/status-pengiriman/:id" element={<StatusPengiriman />} />
      <Route path="/dashboard-pedagang" element={<DashboardPedagang />} />
      <Route path="/profil-pedagang" element={<ProfilPedagang />} />
      <Route path="/input-kebutuhan" element={<InputKebutuhan />} />
      <Route path="/riwayat-pedagang" element={<RiwayatPedagang />} />
      <Route path="/hasil-panen" element={<DaftarPanen />} />
      <Route path="/daftar-panen" element={<DaftarPanen />} />
      <Route path="/detail-produk/:id" element={<DetailProduk />} />
      <Route path="/detail-artikel/:id" element={<DetailArtikel />} />
      <Route path="/chat/:nama?" element={<Chat />} />
      <Route path="/hasil-matching/:id" element={<HasilMatching />} />
      <Route
        path="/status-pengiriman-pedagang/:id"
        element={<StatusPengirimanPedagang />}
      />
      <Route path="/panduan-kualitas" element={<PanduanKualitas />} />
    </Routes>
  );
}
