const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- Telegram Notification ---
async function sendTelegram(message) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;
    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
        });
    } catch (err) {
        console.error('Telegram notification failed:', err.message);
    }
}

// --- Middleware ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied: No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Access denied: Invalid token' });
        req.user = user;
        next();
    });
}

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { doctor: true, patient: true }
        });

        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                doctorId: user.doctor?.id,
                patientId: user.patient?.id
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Doctors ---
app.get('/api/doctors', async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            include: { user: true }
        });
        res.json(doctors.map(d => ({
            id: d.id,
            name: d.user.name,
            email: d.user.email,
            role: d.user.role,
            specialty: d.specialty,
            experience: d.experience,
            rating: d.rating,
            reviewsCount: d.reviewsCount,
            consultationFee: d.consultationFee,
            status: d.status
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Medications ---
app.get('/api/medications', async (req, res) => {
    try {
        const meds = await prisma.medication.findMany();
        res.json(meds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/medications', async (req, res) => {
    try {
        const med = await prisma.medication.create({
            data: req.body
        });
        res.json(med);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/medications/:id', authenticateToken, async (req, res) => {
    try {
        const med = await prisma.medication.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(med);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/medications/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.medication.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Doctors (write) ---
app.post('/api/doctors', authenticateToken, async (req, res) => {
    const { name, email, specialty, experience, consultationFee } = req.body;
    const bcryptLib = require('bcryptjs');
    try {
        const hashedPassword = await bcryptLib.hash('password123', 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'doctor',
                doctor: {
                    create: {
                        specialty,
                        experience: experience || null,
                        consultationFee: consultationFee ? Number(consultationFee) : null,
                        status: 'active'
                    }
                }
            },
            include: { doctor: true }
        });
        res.json({
            id: user.doctor.id,
            name: user.name,
            email: user.email,
            role: 'doctor',
            specialty: user.doctor.specialty,
            experience: user.doctor.experience,
            rating: user.doctor.rating,
            reviewsCount: user.doctor.reviewsCount,
            consultationFee: user.doctor.consultationFee,
            status: user.doctor.status
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/doctors/:id/status', authenticateToken, async (req, res) => {
    try {
        const doctor = await prisma.doctor.update({
            where: { id: req.params.id },
            data: { status: req.body.status }
        });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Appointments ---
app.get('/api/appointments', async (req, res) => {
    try {
        const apps = await prisma.appointment.findMany({
            include: { doctor: { include: { user: true } }, patient: { include: { user: true } } }
        });
        res.json(apps.map(a => ({
            ...a,
            doctorName: a.doctor.user.name,
            patientName: a.patient.user.name
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
    const { patientId, doctorId, date, time, type, reason, notes } = req.body;
    try {
        const app = await prisma.appointment.create({
            data: { patientId, doctorId, date, time, type, reason, notes },
            include: { doctor: { include: { user: true } }, patient: { include: { user: true } } }
        });

        // Send Telegram notification
        const patientName = app.patient?.user?.name || 'مريض';
        const doctorName = app.doctor?.user?.name || 'طبيب';
        await sendTelegram(
            `🏥 <b>حجز موعد جديد</b>\n` +
            `👤 المريض: ${patientName}\n` +
            `👨‍⚕️ الطبيب: ${doctorName}\n` +
            `📅 التاريخ: ${date} — ${time}\n` +
            `🔖 النوع: ${type}` +
            (reason ? `\n📝 السبب: ${reason}` : '')
        );

        res.json({ ...app, doctorName, patientName });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/appointments/:id', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const app = await prisma.appointment.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.json(app);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Patients ---
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await prisma.patient.findMany({
            include: { user: true }
        });
        res.json(patients.map(p => ({
            ...p,
            name: p.user.name,
            email: p.user.email,
            chronicConditions: p.chronicConditions ? JSON.parse(p.chronicConditions) : [],
            allergies: p.allergies ? JSON.parse(p.allergies) : []
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Records ---
app.get('/api/records', async (req, res) => {
    try {
        const records = await prisma.medicalRecord.findMany({
            include: { doctor: { include: { user: true } } }
        });
        res.json(records.map(r => ({
            ...r,
            doctorName: r.doctor.user.name
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/records', authenticateToken, async (req, res) => {
    const { patientId, doctorId, date, title, type, content, status, color } = req.body;
    try {
        const record = await prisma.medicalRecord.create({
            data: { patientId, doctorId, date, title, type, content, status, color }
        });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Pharmacy Orders ---
app.post('/api/pharmacy/order', authenticateToken, async (req, res) => {
    const { items, total, patientName } = req.body;
    try {
        const itemsList = items.map(i => `• ${i.name} × ${i.count} = ${i.total} ر.س`).join('\n');
        await sendTelegram(
            `💊 <b>طلب صيدلية جديد</b>\n` +
            `👤 المريض: ${patientName || 'غير محدد'}\n` +
            `───────────────\n` +
            `${itemsList}\n` +
            `───────────────\n` +
            `💰 الإجمالي: ${total} ر.س`
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Health Check ---
app.get('/health', (req, res) => {
    res.json({ status: 'server is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
