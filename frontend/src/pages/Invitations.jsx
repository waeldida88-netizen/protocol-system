import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Invitations() {
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState([]);
  const [guests, setGuests] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    axios.get('import.meta.env.VITE_API_URL/api/leaders').then(res => setLeaders(res.data));
    axios.get('import.meta.env.VITE_API_URL/api/guests').then(res => setGuests(res.data));
  }, []);

  const generateInvitations = () => {
    const allPeople = [...leaders, ...guests];
    if (allPeople.length === 0) {
      alert("لا يوجد قيادات أو حضور لإنشاء دعوات لهم! اذهب وأضف أسماء أولاً.");
      return;
    }
    const generated = allPeople.map((person, index) => ({
      id: person.id,
      name: person.name_ar,
      job: person.job_ar || 'بدون وظيفة',
      entity: person.entity_ar || 'بدون جهة',
      seat: `ط-${Math.floor(index / 8) + 1} / ك-${(index % 8) + 1}`,
      qrData: JSON.stringify({ id: person.id, name: person.name_ar, seat: `ط-${Math.floor(index / 8) + 1}` })
    }));
    setInvitations(generated);
  };

  const handleSend = (name) => {
    alert(`جاري إرسال الدعوات عبر ${name} لجميع الحضور!`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>✉️ {t('invitations')}</h1>
        <button 
          onClick={generateInvitations}
          style={{ backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          ✨ توليد الدعوات للجميع
        </button>
      </div>

      {invitations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', color: '#64748b', fontSize: '18px' }}>
          لا توجد دعوات حالياً. تأكد من إضافة القيادات والحضور أولاً، ثم اضغط على "توليد الدعوات".
        </div>
      )}

      {invitations.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button onClick={() => handleSend('البريد الإلكتروني')} style={{ backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>📧 إرسال جماعي إيميل</button>
          <button onClick={() => handleSend('الواتساب')} style={{ backgroundColor: '#16a34a', color: 'white', fontWeight: 'bold', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>📱 إرسال جماعي واتساب</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        
        {invitations.map((inv) => {
          // توليد رابط الـ QR Code كصورة مجانية 100% ومضمونة
          const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(inv.qrData)}`;

          return (
            <div key={inv.id} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              border: '4px solid #fbbf24',
              overflow: 'hidden'
            }}>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', textAlign: 'center' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '70px', height: '70px', margin: '0 auto 10px auto', borderRadius: '50%', border: '2px solid #fbbf24', objectFit: 'contain', display: 'block' }} />
                <h3 style={{ color: '#fbbf24', margin: 0, fontSize: '12px' }}>جمهورية مصر العربية</h3>
                <h2 style={{ color: 'white', margin: '5px 0 0 0', fontSize: '14px' }}>الإدارة العامة للعلاقات العامة والمراسم</h2>
              </div>

              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>يسرنا دعوة سيادتكم لحضور</p>
                <h2 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 15px 0' }}>حفل تكريم الأمهات المثاليات</h2>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '14px', color: '#374151', marginBottom: '15px' }}>
                  <span>📅 الأحد 21 مارس</span>
                  <span>⏰ 6:00 مساءً</span>
                </div>
                <p style={{ color: '#374151', fontSize: '14px', marginBottom: '20px' }}>📍 فندق هيلتون رمسيس</p>

                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '15px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>المدعو</p>
                  <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{inv.name}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 10px 0' }}>{inv.job} - {inv.entity}</p>
                  <p style={{ fontSize: '16px', color: '#b45309', fontWeight: 'bold' }}>مكان الجلوس: {inv.seat}</p>
                </div>

                {/* الـ QR Code كصورة عادية */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={qrImageUrl} 
                    alt="QR Code" 
                    style={{ width: '100px', height: '100px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '5px', backgroundColor: 'white' }} 
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '10px', display: 'flex', justifyContent: 'center', gap: '15px', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={() => alert(`إرسال إيميل لـ ${inv.name}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', fontWeight: 'bold' }}>📧 إيميل</button>
                <button onClick={() => alert(`إرسال واتساب لـ ${inv.name}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontWeight: 'bold' }}>واتساب</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}