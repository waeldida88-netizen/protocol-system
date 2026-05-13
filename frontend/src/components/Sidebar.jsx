import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: t('dashboard'), icon: '📊' },
    { path: '/leaders', label: t('leaders'), icon: '👔' },
    { path: '/events', label: t('events'), icon: '🎉' },
    { path: '/guests', label: t('guests'), icon: '📋' },
    { path: '/seating', label: t('seating'), icon: '🪑' },
    { path: '/invitations', label: t('invitations'), icon: '✉️' },
    { path: '/team', label: t('team'), icon: '🛡️' },
    { path: '/chat', label: t('chat'), icon: '💬' },
  ];

  return (
    <div style={{
      width: '280px',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '5px 0 15px rgba(0,0,0,0.1)'
    }}>
      {/* اللوجو والاسم */}
      <div style={{
        padding: '30px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '10px'
      }}>
        <img 
          src="/logo.png" 
          alt="Ministry Logo" 
          style={{ 
            width: '90px', 
            height: '90px', 
            borderRadius: '50%', 
            margin: '0 auto 15px auto',
            border: '3px solid #fbbf24',
            backgroundColor: 'white',
            padding: '5px',
            objectFit: 'contain',
            display: 'block'
          }} 
        />
        <h2 style={{ 
          fontSize: '14px', 
          fontWeight: '700', 
          color: '#fbbf24',
          margin: 0,
          lineHeight: '1.6'
        }}>
          الإدارة العامة للمراسم<br/>والعلاقات العامة
        </h2>
      </div>

      {/* القائمة - تم تعديل المحاذاة هنا */}
      <nav style={{ flex: 1, padding: '10px 15px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{
                display: 'flex',
                flexDirection: 'row', // الأيقونة بجوار النص وليس تحته
                alignItems: 'center',
                justifyContent: 'flex-start', // البدء من اليمين في RTL
                gap: '12px',
                padding: '12px 15px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
                borderRight: isActive ? '4px solid #fbbf24' : '4px solid transparent',
                fontWeight: isActive ? '700' : '500',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '20px', width: '30px', textAlign: 'center' }}>{item.icon}</span>
              <span style={{ fontSize: '15px' }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div style={{
        padding: '20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '12px',
        color: '#64748b'
      }}>
        V 1.0.0 <br/> Min. of Solidarity
      </div>
    </div>
  );
}