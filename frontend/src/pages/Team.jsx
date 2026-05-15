import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Team() {
  const { t } = useTranslation();
  const [team, setTeam] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name_ar: '', email: '', phone: '', password: '', role: 'user' });

  useEffect(() => {
    fetchTeam();
    fetchRequests();
  }, []);

  const fetchTeam = async () => {
    const res = await axios.get('VITE_API_URL=http://localhost:5000/api/team');
    setTeam(res.data);
  };

  const fetchRequests = async () => {
    const res = await axios.get('VITE_API_URL=http://localhost:5000/api/join-requests');
    setRequests(res.data);
  };

  const handleApprove = async (id) => {
    await axios.post(`VITE_API_URL=http://localhost:5000/team/approve/${id}`);
    fetchTeam();
    fetchRequests();
  };

  const handleReject = async (id) => {
    await axios.delete(`VITE_API_URL=http://localhost:5000/api/join-requests/reject/${id}`);
    fetchRequests();
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post('VITE_API_URL=http://localhost:5000/api/team', { ...newMember, status: 'active' });
      setShowAddModal(false);
      setNewMember({ name_ar: '', email: '', phone: '', password: '', role: 'user' });
      fetchTeam();
    } catch (err) {
      alert('البريد الإلكتروني مستخدم بالفعل!');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>🛡️ {t('team')}</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          + إضافة عضو جديد
        </button>
      </div>

      {/* طلبات الانضمام */}
      {requests.length > 0 && (
        <div style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#92400e', marginBottom: '16px' }}>طلبات الانضمام المعلقة ({requests.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map(req => (
              <div key={req.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{req.name_ar}</p>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>{req.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleApprove(req.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>موافقة ✅</button>
                  <button onClick={() => handleReject(req.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>رفض ❌</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* أعضاء الفريق الحاليين */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: '#1E293B', color: '#fbbf24' }}>
              <th style={{ padding: '16px' }}>الاسم</th>
              <th style={{ padding: '16px' }}>البريد الإلكتروني</th>
              <th style={{ padding: '16px' }}>الهاتف</th>
              <th style={{ padding: '16px' }}>الصلاحية</th>
              <th style={{ padding: '16px' }}>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {team.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{member.name_ar}</td>
                <td style={{ padding: '16px', color: '#2563eb' }}>{member.email}</td>
                <td style={{ padding: '16px', color: '#475569' }}>{member.phone || '-'}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    backgroundColor: member.role === 'admin' ? '#fef3c7' : '#e0e7ff', 
                    color: member.role === 'admin' ? '#92400e' : '#3730a3', 
                    padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' 
                  }}>
                    {member.role === 'admin' ? 'مدير النظام' : 'مستخدم عادي'}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#16a34a', fontWeight: 'bold' }}>نشط</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة إضافة عضو جديد */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '450px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#1E293B' }}>إضافة عضو جديد</h2>
            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="الاسم بالكامل" required value={newMember.name_ar} onChange={(e) => setNewMember({...newMember, name_ar: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="email" placeholder="البريد الإلكتروني" required value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="tel" placeholder="رقم التليفون" value={newMember.phone} onChange={(e) => setNewMember({...newMember, phone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="password" placeholder="كلمة السر" required value={newMember.password} onChange={(e) => setNewMember({...newMember, password: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>الصلاحية:</label>
                <select value={newMember.role} onChange={(e) => setNewMember({...newMember, role: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', backgroundColor: 'white' }}>
                  <option value="user">مستخدم عادي</option>
                  <option value="admin">مدير النظام</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>إضافة</button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}