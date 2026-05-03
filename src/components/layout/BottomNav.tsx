import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface BottomNavProps {
  role?: 'petani' | 'pedagang';
}

export default function BottomNav({ role = 'petani' }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const petaniNavItems = [
    { id: 'home', label: 'Beranda', icon: 'mdi:home', path: '/dashboard-petani' },
    { id: 'add', label: 'Tambah', icon: 'mdi:plus-circle', path: '/tambah-panen' },
    { id: 'recovery', label: 'Pemulihan', icon: 'mdi:leaf', path: '/pemulihan-panen' },
    { id: 'history', label: 'Riwayat', icon: 'mdi:history', path: '/riwayat-panen' },
    { id: 'profile', label: 'Profil', icon: 'mdi:account', path: '/profil-petani' },
  ];

  const pedagangNavItems = [
    { id: 'home', label: 'Beranda', icon: 'mdi:home', path: '/dashboard-pedagang' },
    { id: 'kebutuhan', label: 'Kebutuhan', icon: 'mdi:cart-plus', path: '/input-kebutuhan' },
    { id: 'hasil', label: 'Hasil Panen', icon: 'mdi:clipboard-list-outline', path: '/hasil-panen' },
    { id: 'riwayat', label: 'Riwayat', icon: 'mdi:history', path: '/riwayat-pedagang' },
    { id: 'profile', label: 'Profil', icon: 'mdi:account', path: '/profil-pedagang' },
  ];

  const navItems = role === 'petani' ? petaniNavItems : pedagangNavItems;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-1 left-1 right-1 z-50 bg-black rounded-full px-2 py-2 flex justify-between items-center shadow-2xl pointer-events-auto">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item.path)}
          className={`flex flex-col items-center gap-[0.01rem] transition-colors duration-200 ${
            isActive(item.path)
              ? 'text-white bg-[#7a8c2e] rounded-3xl px-5 py-1'
              : 'text-gray-400 bg-gray-700 rounded-full p-3 hover:text-white'
          }`}
        >
          <Icon icon={item.icon} width="24" height="24" />
          <span className={`text-xs font-semibold ${isActive(item.path) ? 'block' : 'hidden'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
