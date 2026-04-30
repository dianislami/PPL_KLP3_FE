import BottomNav from '../../components/layout/BottomNav';

export default function ProfilPetani() {
  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold">Profil</h1>
            <p className="text-sm opacity-90">Data Petani Anda</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-xl">
            👨‍🌾
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24 flex flex-col overflow-y-auto bg-white rounded-t-3xl mt-4">
        {/* Placeholder untuk konten profil */}
        <div className="mt-8 text-center text-gray-400">
          <p className="text-lg">Halaman Profil</p>
          <p className="text-sm">Konten profil akan ditambahkan segera...</p>
        </div>
      </div>

      <BottomNav role="petani" />
    </div>
  );
}
