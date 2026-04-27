import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Kata sandi tidak cocok!');
      return;
    }
    console.log('Register:', { userType, name, email, password });
    
    if (userType === 'petani') {
      navigate('/dashboard-petani');
    } else if (userType === 'pedagang') {
      navigate('/dashboard-pedagang');
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <div className="relative w-full h-72 overflow-hidden bg-gray-200">
        <img 
          src="src/assets/images/login.png" 
          alt="Smart Harvest" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>

        {/* Back Button */}
        <button className="absolute top-12 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center z-20 shadow-lg hover:bg-white transition-all active:scale-95">
          <span className="text-lg">←</span>
        </button>
      </div>

      {/* Wave Divider */}
      <div className="w-full h-12 bg-white relative -mb-1">
        <svg className="w-full h-full" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,40C672,37,768,43,864,45.3C960,48,1056,48,1104,48L1152,48L1200,48L1200,60L1152,60C1104,60,1008,60,912,60C816,60,720,60,624,60C528,60,432,60,336,60C240,60,144,60,96,60L0,60Z" fill="#f8fafc"></path>
        </svg>
      </div>

      {/* Content Section */}
      <div className="flex-1 px-6 py-10 flex flex-col overflow-y-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#6b8a3a] text-center mb-1">
          Daftar Akun<br />Baru
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">Buat akun Anda sekarang</p>

        {/* User Type Selection */}
        <div className="flex gap-4 mb-8 justify-center">
          <button 
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl transition-all transform ${
              userType === 'pedagang' 
                ? 'bg-[#a3a551] text-white shadow-lg scale-105' 
                : 'bg-[#e8efd6] text-[#6b8a3a] hover:bg-[#dde8c5] shadow-sm'
            }`}
            onClick={() => setUserType('pedagang')}
          >
            <span className="text-2xl">🏪</span>
            <span className="text-sm font-semibold">Pedagang</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl transition-all transform ${
              userType === 'petani' 
                ? 'bg-[#a3a551] text-white shadow-lg scale-105' 
                : 'bg-[#e8efd6] text-[#6b8a3a] hover:bg-[#dde8c5] shadow-sm'
            }`}
            onClick={() => setUserType('petani')}
          >
            <span className="text-2xl">🚜</span>
            <span className="text-sm font-semibold">Petani</span>
          </button>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-8">
          {/* Name Input */}
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-gray-400">👤</span>
            <input
              type="text"
              placeholder="Masukkan Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 pl-14 bg-[#e8efd6] rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a3a551] focus:bg-white transition-all shadow-sm"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-gray-400">✉️</span>
            <input
              type="email"
              placeholder="Masukkan Email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 pl-14 bg-[#e8efd6] rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a3a551] focus:bg-white transition-all shadow-sm"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-gray-400">🔒</span>
            <input
              type="password"
              placeholder="Masukkan Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 pl-14 bg-[#e8efd6] rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a3a551] focus:bg-white transition-all shadow-sm"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-gray-400">🔐</span>
            <input
              type="password"
              placeholder="Ulangi Kata Sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 pl-14 bg-[#e8efd6] rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a3a551] focus:bg-white transition-all shadow-sm"
              required
            />
          </div>

          {/* Register Button */}
          <button 
            type="submit" 
            className="w-full bg-[#a3a551] hover:bg-[#929548] text-white font-bold py-3 px-6 rounded-2xl text-base transition-all active:scale-95 shadow-md hover:shadow-lg mt-4"
          >
            Daftar
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mb-8">
          Sudah Punya Akun? <a href="/login" className="text-[#a3a551] font-bold hover:text-[#929548] transition-colors">Masuk Sekarang</a>
        </p>

        {/* Social Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-0.5 bg-gray-300"></div>
          <span className="text-xs text-gray-500 font-medium px-2">ATAU DAFTAR DENGAN</span>
          <div className="flex-1 h-0.5 bg-gray-300"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-6 mb-6">
          <button type="button" className="w-16 h-16 rounded-full border-2 border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="w-8 h-8" />
          </button>
          <button type="button" className="w-16 h-16 rounded-full border-2 border-gray-300 bg-white hover:bg-red-50 hover:border-red-400 transition-all shadow-sm flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/2702/2702602.png" alt="Google" className="w-8 h-8" />
          </button>
          <button type="button" className="w-16 h-16 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-100 hover:border-black transition-all shadow-sm flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/2702/2702051.png" alt="Apple" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
