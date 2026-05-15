import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leaders from './pages/Leaders';
import Guests from './pages/Guests';
import Events from './pages/Events';
import Seating from './pages/Seating';
import Invitations from './pages/Invitations';
import Team from './pages/Team';
import Chat from './pages/Chat';

function AppLayout() {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // لو مفيش مستخدم مسجل دخوله، ارجعه لصفحة الـ Login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', width: 'calc(100% - 280px)' }}>
        
        {/* شريط أعلى الصفحة فيه اسم المستخدم وزر تسجيل الخروج */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: 'white', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ color: '#64748b', fontSize: '14px' }}>مرحباً، </span>
            <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{currentUser.name}</span>
            <span style={{ backgroundColor: currentUser.role === 'admin' ? '#fef3c7' : '#e0e7ff', color: currentUser.role === 'admin' ? '#92400e' : '#3730a3', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', marginRight: '10px' }}>
              {currentUser.role === 'admin' ? 'مدير النظام' : 'مستخدم'}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            style={{ backgroundColor: '#dc2626', color: 'white', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
          >
            تسجيل الخروج 🔓
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leaders" element={<Leaders />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/events" element={<Events />} />
          <Route path="/seating/:eventId" element={<Seating />} />
          <Route path="/invitations" element={<Invitations />} />
          <Route path="/team" element={<Team />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <Router>
      <div className="relative">
        <button 
          onClick={toggleLanguage}
          className="fixed top-4 left-4 z-50 bg-amber-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-amber-600 transition"
        >
          {t('switch_lang')}
        </button>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;