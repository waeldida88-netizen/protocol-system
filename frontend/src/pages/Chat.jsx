import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';

// الاتصال بالسيرفر
const socket = io('VITE_API_URL=http://localhost:5000');

export default function Chat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // استقبال الرسائل
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = { text: newMessage, sender: 'أنت', type: 'text', time: new Date().toLocaleTimeString('ar-EG') };
      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMessage('');
    }
  };

  // تسجيل رسالة صوتية
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const voiceMessage = { sender: 'أنت', type: 'voice', audioUrl, time: new Date().toLocaleTimeString('ar-EG') };
        
        socket.emit('send_message', voiceMessage); // إرسال الرابط للآخرين (للتجربة)
        setMessages((prev) => [...prev, voiceMessage]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('يجب السماح بالوصول إلى الميكروفون لتسجيل رسالة صوتية');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '75vh', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#1E293B', color: '#fbbf24', padding: '15px', fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
        💬 محادثات الفريق
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ alignSelf: msg.sender === 'أنت' ? 'flex-end' : 'flex-start', backgroundColor: msg.sender === 'أنت' ? '#dbeafe' : '#e2e8f0', padding: '10px 15px', borderRadius: '12px', maxWidth: '60%' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '12px', color: '#1e293b' }}>{msg.sender} - <span style={{ fontWeight: 'normal', color: '#64748b' }}>{msg.time}</span></p>
            
            {msg.type === 'text' && <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>{msg.text}</p>}
            
            {msg.type === 'voice' && (
              <audio controls src={msg.audioUrl} style={{ marginTop: '8px', width: '200px' }}></audio>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ padding: '15px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
          placeholder="اكتب رسالتك..."
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
        
        {/* زر تسجيل صوتي */}
        {isRecording ? (
          <button onClick={stopRecording} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            إيقاف ⏹️
          </button>
        ) : (
          <button onClick={startRecording} style={{ backgroundColor: '#6b7280', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '20px' }}>
            🎤
          </button>
        )}

        <button onClick={sendMessage} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          إرسال
        </button>
      </div>
    </div>
  );
}