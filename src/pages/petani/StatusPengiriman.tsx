import { Icon } from '@iconify/react';

type StepStatus = 'done' | 'active' | 'pending';

interface Step {
  id: number;
  status: StepStatus;
  title: string;
  desc: string | React.ReactNode;
}

const ICONS = {
  delivery: 'mdi:truck-fast-outline',
  map: 'mdi:map-outline',
  chat: 'mdi:chat'
};

const steps: Step[] = [
  {
    id: 1,
    status: 'done',
    title: 'Diambil',
    desc: 'Dari Atong, Kec. Montasik, Kabupaten Aceh Besar, Aceh, 11:30 WIB',
  },
  {
    id: 2,
    status: 'active',
    title: 'Dalam Perjalanan',
    desc: 'custom', // handled separately
  },
  {
    id: 3,
    status: 'pending',
    title: 'Tiba di Gudang',
    desc: 'Pusat Logistik, Banda Aceh, Est. 14:00 WIB',
  },
  {
    id: 4,
    status: 'pending',
    title: 'Diterima',
    desc: 'Pedagang: CV.Hasil Bumi Sejahtera\nAlamat: Jl. Teuku Umar No. 10, Banda Aceh',
  },
];

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <div className="w-12 h-12 rounded-full bg-[#5a7a1a] flex items-center justify-center flex-shrink-0 z-10">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 11.5L9 16.5L18 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div className="w-12 h-12 rounded-full bg-[#c8d87a] border-4 border-[#e8f0b0] flex items-center justify-center flex-shrink-0 z-10">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v6l4 2" stroke="#5a7a1a" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="10" r="8" stroke="#5a7a1a" strokeWidth="2" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center flex-shrink-0 z-10">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 4v6l4 2" stroke="#aaa" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="10" r="8" stroke="#aaa" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default function StatusPengiriman() {

  return (
    <div className="w-full min-h-screen bg-[#7a8c2e] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-6 pb-5 text-white flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold">Hallo, Farmers</h1>
            <p className="text-sm opacity-80">Kamis, 30 April 2026</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#9aaa3f] border-2 border-white/30 flex items-center justify-center text-xl">
            👨‍🌾
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-md p-3 grid grid-cols-3 gap-2 z-10 relative -mb-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Hasil Kumulatif</p>
          <p className="text-xs font-bold text-gray-800">35.4 Ton</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-[10px] text-gray-400">Lahan Aktif</p>
          <p className="text-xs font-bold text-gray-800">12 Hektar</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Prediksi Pasar</p>
          <p className="text-xs font-bold text-[#7a8c2e]">Stabil ↗</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 pt-6 overflow-y-auto pb-32 px-5">

        {/* Title */}
        <p className="text-base font-bold text-gray-900 mb-6">
          Status Pengiriman <span className="text-[#5a7a1a]">#TKR-AGR-0411</span>
        </p>

        {/* Timeline */}
        <div className="relative flex flex-col gap-0">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const isActive = step.status === 'active';
            const isDone = step.status === 'done';

            return (
              <div key={step.id} className="flex gap-4 relative">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <StepIcon status={step.status} />
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 my-1 ${
                        isDone ? 'bg-[#5a7a1a]' : 'border-l-2 border-dashed border-gray-300 w-0'
                      }`}
                      style={{ minHeight: 32 }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-6 ${isLast ? 'pb-2' : ''}`}>
                  {isActive ? (
                    <div className="bg-[#f0f5e0] rounded-2xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 text-base">{step.title}</p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            Menuju Gudang Pusat,<br />Banda Aceh
                          </p>
                        </div>
                        <Icon icon={ICONS.map} className="text-4xl text-[#7a8c2e]" />
                      </div>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#d8e8a0]">
                        <Icon icon={ICONS.delivery} className="text-4xl text-[#7a8c2e]" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Pickup - BL 1234 APT</p>
                          <p className="text-xs text-gray-500">Driver: Budi Sudarsono</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <p
                        className={`font-bold text-base ${
                          isDone ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p
                        className={`text-sm mt-0.5 whitespace-pre-line ${
                          isDone ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {step.desc as string}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 pb-6 pt-3 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => { window.location.href = '/chat/:nama?' }}
          className="flex-1 bg-[#6a8a1e] text-white font-semibold text-sm py-4 rounded-full flex items-center justify-center gap-2"
        >
          <Icon icon={ICONS.chat} className="text-2xl" />
          Hubungi Penjual
        </button>
      </div>
    </div>
  );
}