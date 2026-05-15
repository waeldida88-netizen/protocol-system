import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Events() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title_ar: '', venue_ar: '', date: '', time: '', type: 'rows', backgroundImg: '' });

  useEffect(() => {
    axios.get('VITE_API_URL=http://localhost:5000/api/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddEvent = (e) => {
    e.preventDefault();
    axios.post('VITE_API_URL=http://localhost:5000/api/events', newEvent)
      .then(response => {
        setEvents([...events, response.data]);
        setShowModal(false);
        setNewEvent({ title_ar: '', venue_ar: '', date: '', time: '', type: 'rows', backgroundImg: '' });
      })
      .catch(error => console.error(error));
  };

  const getEventTypeText = (type) => {
    if (type === 'round_tables') return 'طاولات مستديرة';
    if (type === 'stage') return 'مسرح وكراسي';
    return 'صفوف كراسي';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>{t('events')}</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          + إنشاء فاعلية
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {events.map((event) => (
          <div key={event.id} style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', overflow: 'hidden', transition: '0.3s', cursor: 'pointer' }}>
            <div style={{ height: '180px', backgroundImage: `url(${event.backgroundImg || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800'})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
              <h3 style={{ position: 'absolute', bottom: '15px', right: '15px', color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{event.title_ar}</h3>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#475569' }}>📍 {event.venue_ar}</p>
              <p style={{ margin: '0 0 10px 0', color: '#475569' }}>📅 {new Date(event.date).toLocaleDateString('ar-EG')} | ⏰ {event.time}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                  {getEventTypeText(event.type)}
                </span>
                <a href={`/seating/${event.id}`} style={{ color: '#d97706', fontWeight: 'bold', textDecoration: 'none' }}>
  إدارة الجلوس 🪑
</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة الإضافة */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#1E293B' }}>إنشاء فاعلية</h2>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="اسم الفاعلية" required value={newEvent.title_ar} onChange={(e) => setNewEvent({...newEvent, title_ar: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <input type="text" placeholder="المكان (فندق/قاعة)" required value={newEvent.venue_ar} onChange={(e) => setNewEvent({...newEvent, venue_ar: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="date" required value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} style={{ flex: 1, padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}/>
                <input type="time" required value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} style={{ flex: 1, padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}/>
              </div>
              <select value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', backgroundColor: 'white' }}>
                <option value="rows">صفوف كراسي</option>
                <option value="round_tables">طاولات مستديرة</option>
                <option value="stage">مسرح وأمامه كراسي</option>
              </select>
              <input type="url" placeholder="رابط صورة الخلفية (اختياري)" value={newEvent.backgroundImg} onChange={(e) => setNewEvent({...newEvent, backgroundImg: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}/>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>إنشاء</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}