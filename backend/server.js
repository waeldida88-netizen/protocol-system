const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const prisma = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] } });

io.on("connection", (socket) => {
  console.log("✅ مستخدم متصل:", socket.id);
  socket.on("disconnect", () => console.log("❌ مستخدم فصل:", socket.id));
});

// إنشاء حساب المطور
async function createDevAccount() {
  try {
    const devEmail = 'dev@protocol.com';
    const existingDev = await prisma.user.findUnique({ where: { email: devEmail } });
    if (!existingDev) {
      await prisma.user.create({ data: { name_ar: 'المطور الرئيسي', email: devEmail, password: '123456', phone: '01000000000', role: 'admin', status: 'active' } });
      console.log('🛠️ تم إنشاء حساب المطور الرئيسي بنجاح!');
    }
  } catch (error) { console.error('❌ خطأ:', error); }
}
createDevAccount();

// ===== Login =====
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password || user.status !== 'active') return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    res.json({ id: user.id, name: user.name_ar, email: user.email, role: user.role });
  } catch (error) { res.status(500).json({ error: "Server error" }); }
});

// ===== Leaders APIs =====
app.get('/api/leaders', async (req, res) => { try { res.json(await prisma.leader.findMany()); } catch(e) { res.status(500).json({error: e.message}) } });
app.post('/api/leaders', async (req, res) => { try { res.status(201).json(await prisma.leader.create({ data: req.body })); } catch(e) { res.status(400).json({error: e.message}) } });
app.put('/api/leaders/:id', async (req, res) => { try { res.json(await prisma.leader.update({ where: { id: req.params.id }, data: req.body })); } catch(e) { res.status(400).json({error: e.message}) } });
app.delete('/api/leaders/:id', async (req, res) => { try { res.json(await prisma.leader.delete({ where: { id: req.params.id } })); } catch(e) { res.status(400).json({error: e.message}) } });

// ===== Guests APIs =====
app.get('/api/guests', async (req, res) => { try { res.json(await prisma.guest.findMany()); } catch(e) { res.status(500).json({error: e.message}) } });
app.post('/api/guests', async (req, res) => { try { res.status(201).json(await prisma.guest.create({ data: req.body })); } catch(e) { res.status(400).json({error: e.message}) } });
app.put('/api/guests/:id', async (req, res) => { try { res.json(await prisma.guest.update({ where: { id: req.params.id }, data: req.body })); } catch(e) { res.status(400).json({error: e.message}) } });
app.delete('/api/guests/:id', async (req, res) => { try { res.json(await prisma.guest.delete({ where: { id: req.params.id } })); } catch(e) { res.status(400).json({error: e.message}) } });

// ===== Events APIs =====
app.get('/api/events', async (req, res) => {
  try { res.json(await prisma.event.findMany()); } catch(e) { res.status(500).json({error: e.message}) }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title_ar, venue_ar, date, time, type, backgroundImg, latitude, longitude } = req.body;
    const dataToSave = {
      title_ar,
      venue_ar,
      date: new Date(date),
      time,
      type,
      backgroundImg: backgroundImg && backgroundImg.trim() !== '' ? backgroundImg : null,
      latitude: latitude || null,
      longitude: longitude || null,
    };
    const newEvent = await prisma.event.create({ data: dataToSave });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ error: error.message });
  }
});

// Seating for specific event
app.get('/api/events/:id/seating', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    res.json(event && event.layoutData ? JSON.parse(event.layoutData) : []);
  } catch(e) { res.status(500).json({error: e.message}) }
});

app.put('/api/events/:id/seating', async (req, res) => {
  try {
    res.json(await prisma.event.update({ where: { id: req.params.id }, data: { layoutData: JSON.stringify(req.body) } }));
  } catch(e) { res.status(400).json({error: e.message}) }
});

// ===== Team APIs =====
app.get('/api/team', async (req, res) => { try { res.json(await prisma.user.findMany({ where: { status: 'active' } })); } catch(e) { res.status(500).json({error: e.message}) } });
app.post('/api/team', async (req, res) => { try { res.status(201).json(await prisma.user.create({ data: req.body })); } catch(e) { res.status(400).json({error: e.message}) } });
app.get('/api/join-requests', async (req, res) => { try { res.json(await prisma.user.findMany({ where: { status: 'pending' } })); } catch(e) { res.status(500).json({error: e.message}) } });
app.post('/api/team/approve/:id', async (req, res) => { try { res.json(await prisma.user.update({ where: { id: req.params.id }, data: { status: 'active' } })); } catch(e) { res.status(400).json({error: e.message}) } });
app.delete('/api/join-requests/reject/:id', async (req, res) => { try { res.json(await prisma.user.delete({ where: { id: req.params.id } })); } catch(e) { res.status(400).json({error: e.message}) } });

// ===== Dashboard Stats API =====
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const pendingRequests = await prisma.user.count({ where: { status: 'pending' } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextEvent = await prisma.event.findFirst({
      where: { date: { gte: today } },
      orderBy: { date: 'asc' },
      include: { invitations: true }
    });
    let checkInStats = { total: 0, scanned: 0, percentage: 0 };
    if (nextEvent && nextEvent.invitations.length > 0) {
      const total = nextEvent.invitations.length;
      const scanned = nextEvent.invitations.filter(inv => inv.is_scanned).length;
      checkInStats = { total, scanned, percentage: Math.round((scanned / total) * 100) };
    }
    res.json({ pendingRequests, nextEvent, checkInStats });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ===== Templates APIs =====
app.get('/api/templates', async (req, res) => {
  try { res.json(await prisma.template.findMany()); } catch(e) { res.status(500).json({error: e.message}) }
});

app.post('/api/templates', async (req, res) => {
  try {
    const { name_ar, type, layoutData } = req.body;
    const newTemplate = await prisma.template.create({
      data: { name_ar, type, layoutData: JSON.stringify(layoutData) }
    });
    res.status(201).json(newTemplate);
  } catch(e) { res.status(400).json({error: e.message}) }
});

// ===== Invitations Generation & Scan APIs =====
// توليد الدعوات وحفظها في الداتابيز
app.post('/api/invitations/generate', async (req, res) => {
  try {
    const { event_id, people, custom_text } = req.body;
    const invitations = [];
    for (const p of people) {
      const qrData = JSON.stringify({ event_id, guest_id: p.id, seat: p.seat_info });
      const inv = await prisma.invitation.create({
        data: {
          event_id,
          guest_id: p.id,
          seat_info: p.seat_info || 'غير محدد',
          custom_text: custom_text || '',
          qr_code: qrData
        }
      });
      invitations.push(inv);
    }
    res.status(201).json(invitations);
  } catch (error) { res.status(400).json({ error: error.message }) }
});

// مسح الـ QR Code وتسجيل الحضور
app.put('/api/invitations/scan', async (req, res) => {
  try {
    const { qr_data } = req.body;
    const parsedData = JSON.parse(qr_data);
    const invitation = await prisma.invitation.findFirst({
      where: { guest_id: parsedData.guest_id, event_id: parsedData.event_id }
    });
    if (!invitation) return res.status(404).json({ error: "الدعوة غير موجودة" });
    
    if (invitation.is_scanned) return res.json({ message: "تم تسجيل الدخول مسبقاً!", invitation });
    
    const updated = await prisma.invitation.update({
      where: { id: invitation.id },
      data: { is_scanned: true }
    });
    res.json({ message: "تم تسجيل الدخول بنجاح! ✅", invitation: updated });
  } catch (error) { res.status(400).json({ error: error.message }) }
});

// ===== Server Listen =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log('🚀 Server is running on http://localhost:' + PORT); });