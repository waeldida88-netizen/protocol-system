import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Seating() {
  const { t } = useTranslation();
  const [elements, setElements] = useState([]); // المصفوفة الجديدة اللي بتشمل كل حاجة
  const [leaders, setLeaders] = useState([]);
  const [guests, setGuests] = useState([]);
  const [assigningSeat, setAssigningSeat] = useState(null);
  
  const [dragInfo, setDragInfo] = useState(null); // لتتبع السحب والإفلات
  const canvasRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leaders').then(res => setLeaders(res.data));
    axios.get('http://localhost:5000/api/guests').then(res => setGuests(res.data));
  }, []);

  // دوال إضافة العناصر
  const addRoundTable = () => {
    const newTable = {
      id: Date.now().toString(),
      type: 'round_table',
      x: 150, y: 150,
      seats: Array(8).fill(null)
    };
    setElements([...elements, newTable]);
  };

  const addChairRow = () => {
    const newRow = {
      id: Date.now().toString(),
      type: 'chair_row',
      x: 100, y: 100,
      seats: Array(5).fill(null)
    };
    setElements([...elements, newRow]);
  };

  const addStage = () => {
    const newStage = {
      id: Date.now().toString(),
      type: 'stage',
      x: 200, y: 50,
      seats: [] // المسرح ليس به كراسي
    };
    setElements([...elements, newStage]);
  };

  // دوال السحب والإفلات (Drag & Drop)
  const handleMouseDown = (e, id) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;
    // حساب المسافة بين نقرة الماوس وبداية العنصر
    const offsetX = e.clientX - element.x;
    const offsetY = e.clientY - element.y;
    setDragInfo({ id, offsetX, offsetY });
  };

  const handleMouseMove = (e) => {
    if (!dragInfo) return;
    const newX = e.clientX - dragInfo.offsetX;
    const newY = e.clientY - dragInfo.offsetY;
    
    setElements(elements.map(el => 
      el.id === dragInfo.id ? { ...el, x: newX, y: newY } : el
    ));
  };

  const handleMouseUp = () => {
    setDragInfo(null); // إيقاف السحب
  };

  // دالة تعيين الشخص
  const openAssignModal = (elementId, seatIndex) => {
    setAssigningSeat({ elementId, seatIndex });
  };

  const assignPerson = (person) => {
    setElements(elements.map(el => {
      if (el.id === assigningSeat.elementId) {
        const updatedSeats = [...el.seats];
        updatedSeats[assigningSeat.seatIndex] = person;
        return { ...el, seats: updatedSeats };
      }
      return el;
    }));
    setAssigningSeat(null);
  };

  const clearSeat = (elementId, seatIndex) => {
    setElements(elements.map(el => {
      if (el.id === elementId) {
        const updatedSeats = [...el.seats];
        updatedSeats[seatIndex] = null;
        return { ...el, seats: updatedSeats };
      }
      return el;
    }));
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>{t('seating')}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={addRoundTable} style={{ backgroundColor: '#1e293b', color: 'white', fontWeight: 'bold', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ طاولة مستديرة</button>
          <button onClick={addChairRow} style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ صف كراسي</button>
          <button onClick={addStage} style={{ backgroundColor: '#64748b', color: 'white', fontWeight: 'bold', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ مسرح</button>
        </div>
      </div>

      {/* منطقة الرسم (Canvas) */}
      <div 
        ref={canvasRef}
        style={{ backgroundColor: '#f1f5f9', border: '4px dashed #cbd5e1', borderRadius: '16px', height: '70vh', position: 'relative', overflow: 'hidden', cursor: dragInfo ? 'grabbing' : 'default' }}
      >
        {elements.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '24px', fontWeight: 'bold' }}>
            القاعة فارغة، أضف عناصر للبدء
          </div>
        )}

        {/* رسم العناصر */}
        {elements.map((el) => (
          <div 
            key={el.id} 
            style={{ position: 'absolute', left: `${el.x}px`, top: `${el.y}px`, cursor: 'grab' }}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
          >
            
            {/* 1. طاولة مستديرة */}
            {el.type === 'round_table' && (
              <div style={{ position: 'relative', width: '280px', height: '280px' }}>
                <div style={{ position: 'absolute', top: '90px', left: '90px', width: '100px', height: '100px', backgroundColor: '#78350f', borderRadius: '50%', border: '4px solid #451a03', boxShadow: '0 10px 15px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', zIndex: 1 }}>
                  طاولة
                </div>
                {el.seats.map((seat, index) => {
                  const angle = (index / el.seats.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = 110;
                  const x = Math.cos(angle) * radius + 140;
                  const y = Math.sin(angle) * radius + 140;
                  return (
                    <div 
                      key={index}
                      onClick={(e) => { e.stopPropagation(); seat ? clearSeat(el.id, index) : openAssignModal(el.id, index) }}
                      style={{
                        position: 'absolute', width: '40px', height: '40px', borderRadius: '50%',
                        left: `${x - 20}px`, top: `${y - 20}px`,
                        backgroundColor: seat ? '#f59e0b' : '#e5e7eb',
                        border: `3px solid ${seat ? '#b45309' : '#9ca3af'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', zIndex: 10, fontSize: '10px', fontWeight: 'bold', color: seat ? 'white' : 'black'
                      }}
                    >
                      {seat ? seat.name_ar.split(' ')[0] : (index + 1)}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. صف كراسي */}
            {el.type === 'chair_row' && (
              <div style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '10px' }}>
                {el.seats.map((seat, index) => (
                  <div 
                    key={index}
                    onClick={(e) => { e.stopPropagation(); seat ? clearSeat(el.id, index) : openAssignModal(el.id, index) }}
                    style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      backgroundColor: seat ? '#f59e0b' : '#e5e7eb',
                      border: `3px solid ${seat ? '#b45309' : '#9ca3af'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: '10px', fontWeight: 'bold', color: seat ? 'white' : 'black'
                    }}
                  >
                    {seat ? seat.name_ar.split(' ')[0] : (index + 1)}
                  </div>
                ))}
              </div>
            )}

            {/* 3. مسرح */}
            {el.type === 'stage' && (
              <div style={{
                width: '400px', height: '80px',
                backgroundColor: '#1e293b', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fbbf24', fontSize: '24px', fontWeight: 'bold',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)', border: '3px solid #fbbf24'
              }}>
                المسرح
              </div>
            )}
          </div>
        ))}
      </div>

      {/* نافذة تعيين شخص */}
      {assigningSeat && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B' }}>اختر شخصاً للكرسي</h2>
              <button onClick={() => setAssigningSeat(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af' }}>&times;</button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 'bold', color: '#b45309', marginBottom: '8px', borderBottom: '1px solid #fde68a', paddingBottom: '4px' }}>👑 قيادات الوزارة</h3>
              {leaders.map(leader => (
                <button key={leader.id} onClick={() => assignPerson(leader)} style={{ width: '100%', textAlign: 'right', padding: '10px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', cursor: 'pointer', marginBottom: '5px' }}>
                  {leader.name_ar} ({leader.job_ar})
                </button>
              ))}
            </div>
            <div>
              <h3 style={{ fontWeight: 'bold', color: '#1d4ed8', marginBottom: '8px', borderBottom: '1px solid #bfdbfe', paddingBottom: '4px' }}>👥 الحضور</h3>
              {guests.map(guest => (
                <button key={guest.id} onClick={() => assignPerson(guest)} style={{ width: '100%', textAlign: 'right', padding: '10px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', cursor: 'pointer', marginBottom: '5px' }}>
                  {guest.name_ar} ({guest.job_ar})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}