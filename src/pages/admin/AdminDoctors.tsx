import { useState } from 'react';
import { Search, Filter, Plus, ShieldCheck, Ban, MoreVertical } from 'lucide-react';
import { Card, Input, Button, Modal } from '../../components/ui';
import { useDataStore } from '../../store/dataStore';
import { useNotificationStore } from '../../store/notificationStore';
import { type Doctor } from '../../types';

interface DoctorForm {
    name: string;
    specialty: string;
    email: string;
    experience: string;
    consultationFee: string;
}

const EMPTY_FORM: DoctorForm = { name: '', specialty: '', email: '', experience: '', consultationFee: '' };

export default function AdminDoctors() {
    const { doctors, updateDoctorStatus, addDoctor } = useDataStore();
    const { notify } = useNotificationStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<DoctorForm>(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    const filtered = searchQuery.trim()
        ? doctors.filter((d: Doctor) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : doctors;

    const handleSubmit = () => {
        if (!form.name.trim() || !form.specialty.trim() || !form.email.trim()) {
            notify('يرجى ملء الاسم والتخصص والبريد الإلكتروني', 'error');
            return;
        }
        setSubmitting(true);
        const newDoctor: Doctor = {
            id: `DOC-${Date.now()}`,
            name: form.name.trim(),
            specialty: form.specialty.trim(),
            email: form.email.trim(),
            experience: form.experience.trim(),
            consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined,
            role: 'doctor',
            rating: 0,
            reviewsCount: 0,
            status: 'active',
        };
        addDoctor(newDoctor);
        notify(`تمت إضافة ${newDoctor.name} بنجاح`, 'success');
        setForm(EMPTY_FORM);
        setShowModal(false);
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1C2B2A]">إدارة الكادر الطبي</h2>
                <Button className="bg-[#3A7DBF] text-white gap-2" onClick={() => setShowModal(true)}>
                    <Plus size={16} /> إضافة طبيب يدوياً
                </Button>
            </div>

            <div className="flex gap-3">
                <Input
                    placeholder="ابحث بالاسم أو التخصص..."
                    icon={<Search size={20} />}
                    className="max-w-md bg-white border-[#C8DDD9]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" className="w-12 px-0 bg-white border-[#C8DDD9]">
                    <Filter size={20} className="text-[#3A7DBF]" />
                </Button>
            </div>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map((doc: Doctor) => (
                        <Card key={doc.id} className="p-4 flex items-center justify-between border-r-4 border-r-[#3A7DBF] hover:border-[#4A9E8A] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#EEF4FB] text-[#3A7DBF] rounded-xl flex items-center justify-center font-bold text-lg">
                                    {doc.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-[#1C2B2A] text-lg">{doc.name}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${doc.status === 'active' ? 'bg-[#EFF6F4] text-[#2E7D6B]' : 'bg-[#FDEAE8] text-[#C0392B]'}`}>
                                            {doc.status === 'active' ? 'نشط' : 'موقوف'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-[#4A6360] flex items-center gap-2 mt-1">
                                        <span>{doc.specialty}</span>
                                        <span className="w-1 h-1 bg-[#C8DDD9] rounded-full"></span>
                                        <span className="font-mono text-xs">{doc.id}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {doc.status === 'active' ? (
                                    <button
                                        onClick={() => { updateDoctorStatus(doc.id, 'inactive'); notify(`تم إيقاف حساب ${doc.name}`, 'warning'); }}
                                        className="h-8 px-3 bg-[#FDEAE8] text-[#C0392B] rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#C0392B] hover:text-white transition"
                                    >
                                        <Ban size={14} /> إيقاف
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { updateDoctorStatus(doc.id, 'active'); notify(`تم تفعيل حساب ${doc.name}`, 'success'); }}
                                        className="h-8 px-3 bg-[#EFF6F4] text-[#2E7D6B] rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#2E7D6B] hover:text-white transition"
                                    >
                                        <ShieldCheck size={14} /> تفعيل
                                    </button>
                                )}
                                <button className="w-8 h-8 flex items-center justify-center text-[#7A9490] hover:text-[#1C2B2A] rounded-lg hover:bg-[#F8FAF9]">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="border border-dashed border-[#C8DDD9] rounded-2xl p-8 text-center">
                    <p className="text-[#7A9490] text-sm">{searchQuery ? 'لا توجد نتائج مطابقة' : 'لا يوجد أطباء مسجلون'}</p>
                </div>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إضافة طبيب جديد">
                <div className="space-y-4">
                    <Input label="الاسم الكامل *" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="د. محمد أحمد" />
                    <Input label="التخصص *" value={form.specialty} onChange={(e) => setForm(f => ({ ...f, specialty: e.target.value }))} placeholder="طب باطني، أطفال..." />
                    <Input label="البريد الإلكتروني *" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="dr@healthcare.com" />
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="سنوات الخبرة" value={form.experience} onChange={(e) => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="مثال: 10 سنوات" />
                        <Input label="رسوم الاستشارة (ريال)" type="number" value={form.consultationFee} onChange={(e) => setForm(f => ({ ...f, consultationFee: e.target.value }))} placeholder="200" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>إلغاء</Button>
                        <Button className="flex-1 bg-[#3A7DBF] hover:bg-[#2c6198]" loading={submitting} onClick={handleSubmit}>إضافة الطبيب</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
