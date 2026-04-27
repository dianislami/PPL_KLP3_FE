import { useState } from 'react';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function BottomNav({ activeTab = 'home', onTabChange }: BottomNavProps) {
  const [active, setActive] = useState(activeTab);

  const handleTabChange = (tab: string) => {
    setActive(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const navItems = [
    { id: 'home', label: 'Beranda', icon: '🏠' },
    { id: 'add', label: 'Tambah', icon: '➕' },
    { id: 'community', label: 'Komunitas', icon: '👥' },
    { id: 'history', label: 'Riwayat', icon: '🕐' },
    { id: 'profile', label: 'Profil', icon: '✅' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black rounded-t-3xl px-4 py-3 flex justify-around items-center shadow-2xl">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleTabChange(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
            active === item.id
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className={`text-xs font-semibold ${active === item.id ? 'block' : 'hidden'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
