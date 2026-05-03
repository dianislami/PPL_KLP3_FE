import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './pages/admin/Monitoring';
import { AuthProvider } from './context/AuthContext';
import Monitoring from './pages/admin/Monitoring';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Monitoring />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
