import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  from: 'me' | 'them';
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    from: 'me',
    time: '10:21',
  },
  {
    id: 2,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    from: 'them',
    time: '10:22',
  },
  {
    id: 3,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    from: 'me',
    time: '10:23',
  },
  {
    id: 4,
    text: 'Lorem ipsum dolor',
    from: 'them',
    time: '10:24',
  },
];

export default function Chat() {
  const navigate = useNavigate();
  const { nama } = useParams<{ nama?: string }>();
  const contactName = nama
    ? decodeURIComponent(nama)
    : 'CV. Hasil Bumi Sejahtera';

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const now = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: trimmed, from: 'me', time: now() },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">

      {/* Header */}
      <div
        className="relative flex-shrink-0 bg-[#7a8c2e] text-white pt-12 pb-8 px-5 flex flex-col items-center"
        style={{ borderRadius: '0 0 50% 50% / 0 0 40px 40px' }}
      >
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
        >
          <span className="text-white font-bold text-lg leading-none">‹</span>
        </button>

        {/* Name */}
        <h1 className="text-xl font-bold text-center mt-1">{contactName}</h1>
        <div className="w-32 h-px bg-white/50 mt-2" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 pb-28">
        {messages.map(msg =>
          msg.from === 'me' ? (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[78%]">
                <div className="bg-[#5a6e1a] text-white text-sm font-medium px-4 py-3 rounded-2xl rounded-tr-sm leading-relaxed shadow-sm">
                  {msg.text}
                </div>
                <p className="text-[10px] text-gray-400 text-right mt-1 pr-1">{msg.time}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[78%]">
                <div className="bg-[#d8e8a0] text-gray-800 text-sm font-semibold px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed shadow-sm">
                  {msg.text}
                </div>
                <p className="text-[10px] text-gray-400 mt-1 pl-1">{msg.time}</p>
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm px-4 py-4 flex items-center gap-3 border-t border-gray-100">
        {/* Attachment */}
        <button className="w-12 h-12 rounded-full bg-[#7a8c2e] flex items-center justify-center flex-shrink-0 shadow-md active:scale-95 transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Text input */}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan Anda disini..."
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a8c2e]/40 transition-all"
        />

        {/* Send */}
        <button
          onClick={handleSend}
          className="w-12 h-12 rounded-full bg-[#7a8c2e] flex items-center justify-center flex-shrink-0 shadow-md active:scale-95 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}