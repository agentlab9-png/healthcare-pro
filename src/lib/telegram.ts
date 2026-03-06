const TELEGRAM_BOT_TOKEN = '8469681412:AAEgDrqbl8KME795bvenVDPjv1wxDJyDICM';
const TELEGRAM_CHAT_ID = '-54881024';

async function sendTelegramMessage(text: string): Promise<boolean> {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
                parse_mode: 'HTML',
            }),
        });
        const data = await res.json();
        return data.ok;
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
        return false;
    }
}

export function notifyAppointmentBooked(params: {
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    type: string;
}) {
    const message = `🏥 <b>حجز موعد جديد</b>\n\n👤 المريض: ${params.patientName}\n👨‍⚕️ الطبيب: ${params.doctorName}\n📅 التاريخ: ${params.date}\n🕐 الوقت: ${params.time}\n📋 النوع: ${params.type}\n\n✅ تم الحجز بنجاح`;
    sendTelegramMessage(message);
}

export function notifyPharmacyOrder(params: {
    patientName: string;
    items: { name: string; count: number; price: number }[];
    total: number;
}) {
    const itemsList = params.items
        .map(item => `  • ${item.name} × ${item.count} = ${item.price * item.count} ر.س`)
        .join('\n');
    const message = `💊 <b>طلب صيدلية جديد</b>\n\n👤 المريض: ${params.patientName}\n\n🛒 الأصناف:\n${itemsList}\n\n💰 الإجمالي: ${params.total} ر.س\n\n✅ تم إرسال الطلب بنجاح`;
    sendTelegramMessage(message);
}
