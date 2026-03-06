import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, Modal, Input, Button } from '../../components/ui';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { type Patient, type Medication } from '../../types';

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

function buildWeekDays() {
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 2 + i);
        return {
            date: d,
            dayName: DAY_NAMES[d.getDay()],
            dateNum: d.getDate(),
            isToday: d.toDateString() === today.toDateString(),
        };
    });
}

export default function MedicationSchedulePage() {
    const { medications, addMedication } = useDataStore();
    const { user } = useAuthStore();
    const { notify } = useNotificationStore();
    const [taken, setTaken] = useState<Record<string, boolean>>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [medForm, setMedForm] = useState({ name: '', dosage: '', instructions: '' });

    const today = new Date();
    const weekDays = buildWeekDays();
    const todayLabel = `${DAY_NAMES[today.getDay()]}، ${today.getDate()} ${MONTHS_AR[today.getMonth()]}`;

    // Use patient's own medications if available, fallback to pharmacy meds
    const patient = user as Patient | null;
    const patientMeds = patient?.medications?.length ? patient.medications : medications;

    const toggleMed = (id: string) => {
        setTaken(prev => {
            const newState = { ...prev, [id]: !prev[id] };
            if (newState[id]) {
                const med = patientMeds.find(m => m.id === id);
                if (med) notify(`تم تسجيل تناول ${med.name}`, 'success');
            }
            return newState;
        });
    };

    const handleAddMedication = () => {
        if (!medForm.name.trim()) {
            notify('يرجى إدخال اسم الدواء', 'error');
            return;
        }
        const newMed: Medication = {
            id: `MED-${Date.now()}`,
            name: medForm.name.trim(),
            dosage: medForm.dosage.trim(),
            instructions: medForm.instructions.trim(),
        };
        addMedication(newMed);
        notify(`تمت إضافة ${newMed.name} للجدول`, 'success');
        setMedForm({ name: '', dosage: '', instructions: '' });
        setShowAddModal(false);
    };

    const schedule = [
        { time: 'الصباح (08:00 ص)', meds: patientMeds.slice(0, Math.ceil(patientMeds.length / 2)) },
        { time: 'المساء (10:00 م)', meds: patientMeds.slice(Math.ceil(patientMeds.length / 2)) },
    ];

    return (
        <div className="space-y-6 pb-6 w-full">
            <div className="flex justify-between items-center px-1">
                <div>
                    <h2 className="text-xl font-bold text-[#1C2B2A]">جدول الأدوية</h2>
                    <p className="text-xs text-[#7A9490]">{todayLabel}</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-10 h-10 bg-[#2E7D6B] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#2E7D6B]/30"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Week Calendar */}
            <div className="flex justify-between bg-white px-4 py-3 rounded-2xl border border-[#C8DDD9]">
                {weekDays.map((day, i) => (
                    <div key={i} className={`flex flex-col items-center gap-1 ${day.isToday ? 'text-[#2E7D6B]' : 'text-[#7A9490]'}`}>
                        <span className="text-[10px] font-bold">{day.dayName}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${day.isToday ? 'bg-[#2E7D6B] text-white shadow-md' : 'bg-[#F8FAF9]'}`}>
                            {day.dateNum}
                        </div>
                        {i < weekDays.findIndex(d => d.isToday) && (
                            <div className="w-1 h-1 rounded-full bg-[#3A7DBF] mt-0.5"></div>
                        )}
                    </div>
                ))}
            </div>

            {patientMeds.length === 0 ? (
                <div className="border border-dashed border-[#C8DDD9] rounded-2xl p-8 text-center">
                    <p className="text-[#7A9490] text-sm">لا توجد أدوية مجدولة حالياً</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {schedule.map((slot, idx) => (
                        slot.meds.length > 0 && (
                            <div key={idx} className="space-y-3">
                                <h3 className="text-sm font-bold text-[#4A6360] flex items-center gap-2 px-1">
                                    <Clock size={16} className="text-[#D4820A]" /> {slot.time}
                                </h3>
                                <div className="space-y-3 relative">
                                    <div className="absolute right-6 top-6 bottom-6 w-0.5 bg-[#E0F2EE] z-0"></div>
                                    {slot.meds.map((med) => {
                                        const isTaken = taken[med.id];
                                        return (
                                            <Card
                                                key={med.id}
                                                className={`relative z-10 p-4 pl-4 pr-16 border-none shadow-sm transition-all cursor-pointer ${isTaken ? 'bg-[#EFF6F4]/50' : 'bg-white'}`}
                                                onClick={() => toggleMed(med.id)}
                                            >
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isTaken ? 'bg-[#2E7D6B] text-white' : 'bg-[#F8FAF9] text-[#C8DDD9] border-2 border-[#C8DDD9]'}`}>
                                                        {isTaken ? <CheckCircle2 size={24} /> : <Circle size={20} />}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold transition-colors text-sm ${isTaken ? 'text-[#7A9490] line-through' : 'text-[#1C2B2A]'}`}>
                                                        {med.name}
                                                    </h4>
                                                    <p className={`text-xs mt-1 transition-colors ${isTaken ? 'text-[#C8DDD9]' : 'text-[#4A6360]'}`}>
                                                        {med.dosage ? `${med.dosage} — ` : ''}{med.instructions}
                                                    </p>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Add Medication Modal */}
            <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setMedForm({ name: '', dosage: '', instructions: '' }); }} title="إضافة دواء للجدول">
                <div className="space-y-4">
                    <Input
                        label="اسم الدواء *"
                        value={medForm.name}
                        onChange={(e) => setMedForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="مثال: باراسيتامول"
                    />
                    <Input
                        label="الجرعة"
                        value={medForm.dosage}
                        onChange={(e) => setMedForm(f => ({ ...f, dosage: e.target.value }))}
                        placeholder="مثال: 500mg"
                    />
                    <Input
                        label="تعليمات الاستخدام"
                        value={medForm.instructions}
                        onChange={(e) => setMedForm(f => ({ ...f, instructions: e.target.value }))}
                        placeholder="مثال: حبة بعد الأكل"
                    />
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => { setShowAddModal(false); setMedForm({ name: '', dosage: '', instructions: '' }); }}>إلغاء</Button>
                        <Button className="flex-1" onClick={handleAddMedication}>إضافة</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
