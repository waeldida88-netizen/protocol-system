import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Seating() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [elements, setElements] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [guests, setGuests] = useState([]);
  const [assigningSeat, setAssigningSeat] = useState(null);
  const [dragInfo, setDragInfo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leaders').then(res => setLeaders(res.data));
    axios.get('http://localhost:5000/api/guests').then(res => setGuests(res.data));
    axios.get('http://localhost:5000/api/templates').then(res => setTemplates(res.data));
    
    if (eventId) {
      axios.get('http://localhost:5000/api/events/' + eventId + '/seating')
        .then(res => { if (res.data.length > 0) setElements(res.data); });
    }
  }, [eventId]);

  const saveLayout = async () => {
    setIsSaving(true);
    try {
      await axios.put('http://localhost:5000/api/events/' + eventId + '/seating', elements);
      alert('تم حفظ ترتيب القاعة بنجاح! 💾');
    } catch (err) { alert('خطأ في الحفظ'); }
    setIsSaving(false);
  };

  const loadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const loadedElements = JSON.parse(template.layoutData).map((el, index) => ({
        ...el,
        // تم إصلاح السطر هنا: إضافة () لـ Date.now، وإكمال الشرط الثلاثي، وإضافة index لضمان عدم تكرار الـ ID
        id: el.type === 'chair' ? 'c' + Date.now() + index : 't' + Date.now() + index
      }));
      setElements(loadedElements);
    }
  };

  // ... باقي الكود الخاص بك يكتب هنا ...

  return (
    <div>
      {/* الـ JSX الخاص بك */}
    </div>
  );
}