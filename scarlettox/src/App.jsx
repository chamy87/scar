import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Header, Footer } from './site/Shell.jsx';
import { HomeScreen } from './pages/HomeScreen.jsx';
import { LearnScreen } from './pages/LearnScreen.jsx';
import { DonateScreen } from './pages/DonateScreen.jsx';

const PATHS = { home: '/', learn: '/learn', donate: '/donate' };

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname === '/learn' ? 'learn' : location.pathname === '/donate' ? 'donate' : 'home';
  const nav = (p) => { navigate(PATHS[p] || '/'); window.scrollTo({ top: 0 }); };
  return (
    <>
      <Header page={page} onNav={nav} />
      <Routes>
        <Route path="/" element={<HomeScreen onNav={nav} />} />
        <Route path="/learn" element={<LearnScreen onNav={nav} />} />
        <Route path="/donate" element={<DonateScreen onNav={nav} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer onNav={nav} />
    </>
  );
}
