import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Leaders() {
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newLeader, setNewLeader] = useState({ name_ar: '', job_ar: '', entity_ar: '', phone: '', email: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/leaders')
      .then(response => setLeaders(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddLeader = (e) => {
    e.preventDefault();
    axios.post('http://VITE_API_URL=http://localhost:5000L/api/leaders', newLeader)
      .then(response => {
        setLeaders([...leaders, response.data]);
        setShowModal(false);
        setNewLeader({ name_ar: '', job_ar: '', entity_ar: '', phone: '', email: '' });
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>{t('leaders')}</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          + إضافة قيادة
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: '#1E293B', color: '#fbbf24' }}>
              <th style={{ padding: '16px', fontWeight: 'bold' }}>الاسم</th>
              <th style={{ padding: '16px', fontWeight: 'bold' }}>الوظيفة</th>
              <th style={{ padding: '16px', fontWeight: 'bold' }}>الجهة</th>
              <th style={{ padding: '16px', fontWeight: 'bold' }}>الهاتف</th>
              <th style={{ padding: '16px', fontWeight: 'bold' }}>البريد الإلكتروني</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader) => (
              <tr key={leader.id} style={{ borderBottom: '1px solid #e5e7eb', transition: '0.2s', cursor: 'pointer' }}>
                <td style={{ padding: '16px', fontWeight: '600', color: '#1e293b' }}>{leader.name_ar}</td>
                <td style={{ padding: '16px', color: '#475569' }}>{leader.job_ar}</td>
                <td style={{ padding: '16px', color: '#475569' }}>{leader.entity_ar}</td>
                <td style={{ padding: '16px', color: '#475569', direction: 'ltr', textAlign: 'right' }}>{leader.phone}</td>
                <td style={{ padding: '16px', color: '#2563eb' }}>{leader.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة الإضافة */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#1E293B', textAlign: 'right' }}>إضافة قيادة جديدة</h2>
            <form onSubmit={handleAddLeader} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="الاسم" required value={newLeader.name_ar} onChange={(e) => setNewLeader({...newLeader, name_ar: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="text" placeholder="الوظيفة" required value={newLeader.job_ar} onChange={(e) => setNewLeader({...newLeader, job_ar: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="text" placeholder="الجهة" required value={newLeader.entity_ar} onChange={(e) => setNewLeader({...newLeader, entity_ar: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="text" placeholder="الهاتف" value={newLeader.phone} onChange={(e) => setNewLeader({...newLeader, phone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="email" placeholder="البريد الإلكتروني" value={newLeader.email} onChange={(e) => setNewLeader({...newLeader, email: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}/>
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