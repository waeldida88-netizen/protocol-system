import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Guests() {
  const { t } = useTranslation();
  const [guests, setGuests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ name_ar: '', job_ar: '', entity_ar: '', phone: '', email: '' });

  useEffect(() => {
    axios.get('VITE_API_URL=http://localhost:5000/api/guests')
      .then(response => setGuests(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddGuest = (e) => {
    e.preventDefault();
    axios.post('VITE_API_URL=http://localhost:5000/api/guests', newGuest)
      .then(response => {
        setGuests([...guests, response.data]);
        setShowModal(false);
        setNewGuest({ name_ar: '', job_ar: '', entity_ar: '', phone: '', email: '' });
      })
      .catch(error => console.error(error));
  };

  const getRsvpStyle = (rsvp) => {
    if (rsvp === 'confirmed') return { backgroundColor: '#dcfce7', color: '#166534' };
    if (rsvp === 'declined') return { backgroundColor: '#fee2e2', color: '#991b1b' };
    return { backgroundColor: '#fef9c3', color: '#854d0e' };
  };

  const getRsvpText = (rsvp) => {
    if (rsvp === 'confirmed') return 'تم التأكيد';
    if (rsvp === 'declined') return 'اعتذر';
    return 'قيد الانتظار';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>{t('guests')}</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          + إضافة مدعو
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: '#1E293B', color: '#fbbf24' }}>
              <th style={{ padding: '16px' }}>الاسم</th>
              <th style={{ padding: '16px' }}>الوظيفة</th>
              <th style={{ padding: '16px' }}>الجهة</th>
              <th style={{ padding: '16px' }}>الهاتف</th>
              <th style={{ padding: '16px' }}>البريد الإلكتروني</th>
              <th style={{ padding: '16px' }}>حالة الدعوة</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', fontWeight: '600' }}>{guest.name_ar}</td>
                <td style={{ padding: '16px', color: '#475569' }}>{guest.job_ar}</td>
                <td style={{ padding: '16px', color: '#475569' }}>{guest.entity_ar}</td>
                <td style={{ padding: '16px', color: '#475569' }}>{guest.phone}</td>
                <td style={{ padding: '16px', color: '#2563eb' }}>{guest.email}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', ...getRsvpStyle(guest.rsvp_status) }}>
                    {getRsvpText(guest.rsvp_status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة الإضافة */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '450px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#1E293B' }}>إضافة مدعو جديد</h2>
            <form onSubmit={handleAddGuest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="الاسم" required value={newGuest.name_ar} onChange={(e) => setNewGuest({...newGuest, name_ar: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="text" placeholder="الوظيفة" required value={newGuest.job_ar} onChange={(e) => setNewGuest({...newGuest, job_ar: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="text" placeholder="الجهة" required value={newGuest.entity_ar} onChange={(e) => setNewGuest({...newGuest, entity_ar: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="text" placeholder="الهاتف" value={newGuest.phone} onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="email" placeholder="البريد الإلكتروني" value={newGuest.email} onChange={(e) => setNewGuest({...newGuest, email: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>حفظ</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}