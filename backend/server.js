const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const prisma = require('./db'); // استدعاء Prisma

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log("✅ مستخدم متصل:", socket.id);
  socket.on("disconnect", () => console.log("❌ مستخدم فصل:", socket.id));
});

// ==========================================
//    إنشاء حساب المطور الافتراضي تلقائياً
// ==========================================
async function createDevAccount() {
  try {
    const devEmail = 'dev@protocol.com';
    const existingDev = await prisma.user.findUnique({ where: { email: devEmail } });
    
    if (!existingDev) {
      await prisma.user.create({
        data: {
          name_ar: 'المطور الرئيسي',
          email: devEmail,
          password: '123456',
          phone: '01000000000',
          role: 'admin',
          status: 'active'
        }
      });
      console.log('🛠️ تم إنشاء حساب المطور الرئيسي بنجاح!');
    }
  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب المطور:', error);
  }
}
createDevAccount();

// ==========================================
//         API لتسجيل الدخول
// ==========================================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password || user.status !== 'active') {
      return res.status(401).json({ error: "البريد الإلكتروني أو كلمة السر غير صحيحة، أو الحساب غير مفعل" });
    }
    res.json({ 
      id: user.id, 
      name: user.name_ar, 
      email: user.email, 
      role: user.role 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
//         APIs للقيادات (Leaders)
// ==========================================
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await prisma.leader.findMany();
    res.json(leaders);
  } catch (error) { res.status(500).json({ error: "Failed to fetch leaders" }); }
});

app.post('/api/leaders', async (req, res) => {
  try {
    const newLeader = await prisma.leader.create({ data: req.body });
    res.status(201).json(newLeader);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

// ==========================================
//         APIs للحضور (Guests)
// ==========================================
app.get('/api/guests', async (req, res) => {
  try {
    const guests = await prisma.guest.findMany();
    res.json(guests);
  } catch (error) { res.status(500).json({ error: "Failed to fetch guests" }); }
});

app.post('/api/guests', async (req, res) => {
  try {
    const newGuest = await prisma.guest.create({ data: req.body });
    res.status(201).json(newGuest);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

// ==========================================
//         APIs للفاعليات (Events)
// ==========================================
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) { res.status(500).json({ error: "Failed to fetch events" }); }
});

app.post('/api/events', async (req, res) => {
  try {
    const newEvent = await prisma.event.create({ data: req.body });
    res.status(201).json(newEvent);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

// ==========================================
//         APIs للفريق (Team & Requests)
// ==========================================
app.get('/api/team', async (req, res) => {
  try {
    const team = await prisma.user.findMany({ where: { status: 'active' } });
    res.json(team);
  } catch (error) { res.status(500).json({ error: "Failed to fetch team" }); }
});

app.post('/api/team', async (req, res) => {
  try {
    const newMember = await prisma.user.create({ data: req.body });
    res.status(201).json(newMember);
  } catch (error) { res.status(400).json({ error: "البريد الإلكتروني مستخدم بالفعل أو خطأ في البيانات" }); }
});

app.get('/api/join-requests', async (req, res) => {
  try {
    const requests = await prisma.user.findMany({ where: { status: 'pending' } });
    res.json(requests);
  } catch (error) { res.status(500).json({ error: "Failed to fetch requests" }); }
});

app.post('/api/team/approve/:id', async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: 'active' }
    });
    res.json(updatedUser);
  } catch (error) { res.status(400).json({ error: "User not found" }); }
});

app.delete('/api/join-requests/reject/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "Rejected successfully" });
  } catch (error) { res.status(400).json({ error: "User not found" }); }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});