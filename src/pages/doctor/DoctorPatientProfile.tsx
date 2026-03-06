import { useState } from 'react';
import { FileText, Plus, Save, Phone, Video, ArrowRight } from 'lucide-react';
import { Card, Button, Modal, Input } from '../../components/ui';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore, type MedicalRecord } from '../../store/dataStore';
import { useAuthStore } from '../../store';
import { useNotificationStore } from '../../store/notificationStore';
import { type Medication } from '../../types';

export default function DoctorPatientProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { patients, records, addRecord, addMedication } = useDataStore();
    const { notify } = useNotificationStore();
    const [noteText, setNoteText] = useState('');
    const [saving, setSaving] = useState(false);
    const [showAddMedModal, setShowAddMedModal] = useState(false);
    const [medForm, setMedForm] = useState({ name: '', dosage: '', instructions: '' });

    const patient = patients.find(p => p.id === id);

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-[#7A9490] text-lg">لم يتم العثور على المريض</p>
                <Button onClick={() => navigate('/doctor/patients')}>
                    <ArrowRight size={16} /> العودة للقائمة
                </Button>
            </div>
        );
    }

    const patientRecords = records.filter(r => r.patientId === id);

    // Use patient's own medications if available
    const patientMedications: Medication[] = patient.medications || [];

    // Handle chronicConditions as either string[] or JSON string
    const chronicConditions: string[] = Array.isArray(patient.chronicConditions)
        ? patient.chronicConditions
        : (typeof patient.chronicConditions === 'string' && patient.chronicConditions)
            ? (() => { try { return JSON.parse(patient.chronicConditions as unknown as string); } catch { return []; } })()
            : [];

    const handleSaveNote = async () => {
        if (!noteText.trim()) {
            notify('يرجى كتابة ملاحظة قبل الحفظ', 'error');
            return;
        }
        setSaving(true);
        const record: MedicalRecord = {
            id: `REC-${Date.now()}`,
            patientId: id || '',
            doctorId: user?.id || '',
            doctorName: user?.name || '',
            date: new Date().toISOString().split('T')[0],
            title: 'ملاحظة طبية',
            type: 'report',
            content: noteText,
        };
        addRecord(record);
        notify('تم حفظ الملاحظة الطبية بنجاح', 'success');
        setNoteText('');
        setSaving(false);
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

        // Also add a record for this prescription
        const record: MedicalRecord = {
            id: `REC-${Date.now()}`,
            patientId: id || '',
            doctorId: user?.id || '',
            doctorName: user?.name || '',
            date: new Date().toISOString().split('T')[0],
            title: `وصف دواء: ${newMed.name}`,
            type: 'report',
            content: `تم وصف ${newMed.name} ${newMed.dosage ? `بجرعة ${newMed.dosage}` : ''} ${newMed.instructions ? `- ${newMed.instructions}` : ''}`,
        };
        addRecord(record);

        notify(`تم وصف ${newMed.name} بنجاح`, 'success');
        setMedForm({ name: '', dosage: '', instructions: '' });
        setShowAddMedModal(false);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Back Button */}
            <button
                onClick={() => navigate('/doctor/patients')}
                className="flex items-center gap-2 text-sm text-[#3A7DBF] font-bold hover:underline"
            >
                <ArrowRight size={16} /> العودة لقائمة المرضى
            </button>

            {/* Patient Header */}
            <Card className="p-6 bg-gradient-to-br from-[#2E7D6B] to-[#1A5C4F] text-white border-none shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/30">
                                {patient.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{patient.name}</h2>
                                <p className="text-white/70">رقم الملف: {patient.mrn || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => notify('جاري الاتصال بالمريض...', 'info')}
                                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <Phone size={20} />
                            </button>
                            <button
                                onClick={() => notify('جاري بدء مكالمة الفيديو...', 'info')}
                                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <Video size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                        <div className="text-center">
                            <p className="text-white/60 text-xs">العمر</p>
                            <p className="font-bold">{patient.age ? `${patient.age} عام` : 'N/A'}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-white/60 text-xs">فصيلة الدم</p>
                            <p className="font-bold">{patient.bloodType || 'N/A'}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-white/60 text-xs">الحالة</p>
                            <p className="font-bold">مستقر</p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Clinical Note */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-[#1C2B2A] flex items-center gap-2">
                                <FileText size={20} className="text-[#2E7D6B]" /> إضافة ملاحظة طبية
                            </h3>
                            <Button size="sm" className="gap-2" loading={saving} onClick={handleSaveNote}>
                                <Save size={16} /> حفظ
                            </Button>
                        </div>
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full h-40 p-4 bg-[#F8FAF9] border border-[#C8DDD9] rounded-2xl focus:ring-2 focus:ring-[#2E7D6B] focus:border-transparent outline-none transition-all text-sm resize-none"
                            placeholder="اكتب ملاحظات التشخيص والعلاج هنا..."
                        />
                    </Card>

                    {/* Medical Records History */}
                    <Card className="p-0 overflow-hidden border-[#C8DDD9]">
                        <div className="p-4 bg-[#F8FAF9] border-b border-[#C8DDD9] flex justify-between items-center">
                            <h3 className="font-bold text-[#1C2B2A]">السجل الطبي التاريخي ({patientRecords.length})</h3>
                        </div>
                        <div className="divide-y divide-[#C8DDD9]">
                            {patientRecords.length > 0 ? patientRecords.map((rec: MedicalRecord, idx: number) => (
                                <div key={idx} className="p-4 hover:bg-[#F8FAF9] transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-[#1C2B2A] text-sm group-hover:text-[#2E7D6B] transition-colors">{rec.title}</h4>
                                        <span className="text-[10px] text-[#7A9490]">{rec.date}</span>
                                    </div>
                                    <p className="text-xs text-[#4A6360] line-clamp-2 leading-relaxed">{rec.content}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-[10px] bg-[#EEF4FB] text-[#3A7DBF] px-2 py-0.5 rounded-full font-bold">بواسطة: {rec.doctorName}</span>
                                        <span className="text-[10px] bg-[#EFF6F4] text-[#2E7D6B] px-2 py-0.5 rounded-full font-bold">{rec.type === 'report' ? 'تقرير طبي' : 'تحليل مخبري'}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-sm text-[#7A9490] py-8">لا توجد سجلات طبية بعد</p>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Chronic Conditions */}
                    {chronicConditions.length > 0 && (
                        <Card className="p-5">
                            <h3 className="font-bold text-[#1C2B2A] mb-4">التشخيص الحالي</h3>
                            <div className="flex flex-wrap gap-2">
                                {chronicConditions.map((cond: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-[#FDEAE8] text-[#C0392B] rounded-full text-xs font-bold">{cond}</span>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Allergies */}
                    {patient.allergies && patient.allergies.length > 0 && (
                        <Card className="p-5">
                            <h3 className="font-bold text-[#1C2B2A] mb-4">الحساسيات</h3>
                            <div className="flex flex-wrap gap-2">
                                {patient.allergies.map((a, i) => (
                                    <span key={i} className="px-3 py-1 bg-[#FEF6E8] text-[#D4820A] rounded-full text-xs font-bold">{a}</span>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Medications */}
                    <Card className="p-5">
                        <h3 className="font-bold text-[#1C2B2A] mb-4">الأدوية الحالية</h3>
                        <div className="space-y-3">
                            {patientMedications.length > 0 ? patientMedications.map((med: Medication, idx: number) => (
                                <div key={idx} className="bg-[#F8FAF9] p-3 rounded-xl border border-[#C8DDD9]">
                                    <h4 className="font-bold text-sm text-[#1C2B2A]">{med.name}</h4>
                                    <p className="text-[10px] text-[#7A9490] mt-1">{med.dosage} — {med.instructions}</p>
                                </div>
                            )) : (
                                <p className="text-xs text-[#7A9490] text-center py-2">لا توجد أدوية مسجلة</p>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            className="w-full mt-4 gap-2 border-[#2E7D6B] text-[#2E7D6B]"
                            onClick={() => setShowAddMedModal(true)}
                        >
                            <Plus size={16} /> إضافة دواء
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Add Medication Modal */}
            <Modal isOpen={showAddMedModal} onClose={() => { setShowAddMedModal(false); setMedForm({ name: '', dosage: '', instructions: '' }); }} title="وصف دواء للمريض">
                <div className="space-y-4">
                    <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#C8DDD9]">
                        <p className="text-sm font-bold text-[#1C2B2A]">المريض: {patient.name}</p>
                    </div>
                    <Input
                        label="اسم الدواء *"
                        value={medForm.name}
                        onChange={(e) => setMedForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="مثال: أموكسيسيلين"
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
                        placeholder="مثال: حبة ثلاث مرات يومياً بعد الأكل"
                    />
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => { setShowAddMedModal(false); setMedForm({ name: '', dosage: '', instructions: '' }); }}>إلغاء</Button>
                        <Button className="flex-1" onClick={handleAddMedication}>وصف الدواء</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
