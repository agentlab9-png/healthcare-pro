import { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, Input, Button, Modal } from '../../components/ui';
import { useDataStore } from '../../store/dataStore';
import { useNotificationStore } from '../../store/notificationStore';
import { type Medication } from '../../types';

interface MedForm {
    name: string;
    dosage: string;
    instructions: string;
    price: string;
    stock: string;
    requiresPrescription: boolean;
}

const EMPTY_FORM: MedForm = { name: '', dosage: '', instructions: '', price: '', stock: '', requiresPrescription: false };

export default function AdminInventory() {
    const { medications, deleteMedication, addMedication, updateMedication } = useDataStore();
    const { notify } = useNotificationStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingMed, setEditingMed] = useState<Medication | null>(null);
    const [form, setForm] = useState<MedForm>(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    const filtered = searchQuery.trim()
        ? medications.filter((m: Medication) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : medications;

    const openAddModal = () => {
        setEditingMed(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEditModal = (med: Medication) => {
        setEditingMed(med);
        setForm({
            name: med.name,
            dosage: med.dosage,
            instructions: med.instructions,
            price: med.price?.toString() || '',
            stock: med.stock?.toString() || '',
            requiresPrescription: med.requiresPrescription || false,
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.instructions.trim()) {
            notify('يرجى ملء الاسم والتعليمات على الأقل', 'error');
            return;
        }
        setSubmitting(true);

        if (editingMed) {
            const updates: Partial<Medication> = {
                name: form.name.trim(),
                dosage: form.dosage.trim(),
                instructions: form.instructions.trim(),
                price: form.price ? Number(form.price) : undefined,
                stock: form.stock ? Number(form.stock) : 0,
                requiresPrescription: form.requiresPrescription,
            };
            updateMedication(editingMed.id, updates);
            notify(`تم تحديث ${form.name.trim()} بنجاح`, 'success');
        } else {
            const newMed: Medication = {
                id: `MED-${Date.now()}`,
                name: form.name.trim(),
                dosage: form.dosage.trim(),
                instructions: form.instructions.trim(),
                price: form.price ? Number(form.price) : undefined,
                stock: form.stock ? Number(form.stock) : 0,
                requiresPrescription: form.requiresPrescription,
            };
            addMedication(newMed);
            notify(`تمت إضافة ${newMed.name} بنجاح`, 'success');
        }

        setForm(EMPTY_FORM);
        setEditingMed(null);
        setShowModal(false);
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#1C2B2A]">المخزون الدوائي</h2>
                    <p className="text-[#7A9490] mt-1">إدارة الأدوية المتوفرة والطلبيات</p>
                </div>
                <Button className="bg-[#7B5EA7] text-white gap-2" onClick={openAddModal}>
                    <Plus size={16} /> إضافة دواء جديد
                </Button>
            </div>

            <div className="flex gap-3">
                <Input
                    placeholder="ابحث عن دواء..."
                    icon={<Search size={20} />}
                    className="max-w-md bg-white border-[#C8DDD9]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" className="w-12 px-0 bg-white border-[#C8DDD9]">
                    <Filter size={20} className="text-[#7B5EA7]" />
                </Button>
            </div>

            <Card className="overflow-hidden border-[#C8DDD9]">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-[#F8FAF9] border-b border-[#C8DDD9]">
                                <th className="p-4 text-sm font-bold text-[#4A6360]">اسم الدواء</th>
                                <th className="p-4 text-sm font-bold text-[#4A6360]">التصنيف</th>
                                <th className="p-4 text-sm font-bold text-[#4A6360]">السعر</th>
                                <th className="p-4 text-sm font-bold text-[#4A6360]">المخزون</th>
                                <th className="p-4 text-sm font-bold text-[#4A6360]">الحالة</th>
                                <th className="p-4 text-sm font-bold text-[#4A6360]">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#C8DDD9]">
                            {filtered.length > 0 ? filtered.map((med: Medication) => {
                                const status = (med.stock ?? 0) > 10 ? 'متوفر' : (med.stock ?? 0) > 0 ? 'نقص مخزون' : 'نفد';
                                return (
                                    <tr key={med.id} className="hover:bg-[#F3EFF9]/40 transition-colors">
                                        <td className="p-4 font-bold text-[#1C2B2A]">{med.name}</td>
                                        <td className="p-4 text-[#4A6360]">{med.requiresPrescription ? 'بوصفة' : 'بدون وصفة'}</td>
                                        <td className="p-4 text-[#4A6360]">{med.price != null ? `${med.price} ريال` : '—'}</td>
                                        <td className="p-4 font-bold text-[#1C2B2A]">{med.stock ?? 0} علبة</td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${status === 'متوفر' ? 'bg-[#EFF6F4] text-[#2E7D6B]' : status === 'نقص مخزون' ? 'bg-[#FEF6E8] text-[#D4820A]' : 'bg-[#FDEAE8] text-[#C0392B]'}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(med)}
                                                    className="p-1.5 text-[#3A7DBF] hover:bg-[#EEF4FB] rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { deleteMedication(med.id); notify(`تم حذف ${med.name}`, 'info'); }}
                                                    className="p-1.5 text-[#C0392B] hover:bg-[#FDEAE8] rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#7A9490] text-sm">
                                        {searchQuery ? 'لا توجد نتائج مطابقة' : 'لا توجد أدوية مسجلة'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingMed(null); setForm(EMPTY_FORM); }} title={editingMed ? 'تعديل الدواء' : 'إضافة دواء جديد'}>
                <div className="space-y-4">
                    <Input label="اسم الدواء *" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="مثال: أموكسيسيلين" />
                    <Input label="الجرعة" value={form.dosage} onChange={(e) => setForm(f => ({ ...f, dosage: e.target.value }))} placeholder="مثال: 500mg" />
                    <Input label="تعليمات الاستخدام *" value={form.instructions} onChange={(e) => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder="مثال: حبة ثلاث مرات يومياً" />
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="السعر (ريال)" type="number" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
                        <Input label="الكمية في المخزون" type="number" value={form.stock} onChange={(e) => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.requiresPrescription} onChange={(e) => setForm(f => ({ ...f, requiresPrescription: e.target.checked }))} className="w-4 h-4 accent-[#2E7D6B]" />
                        <span className="text-sm font-bold text-[#4A6360]">يتطلب وصفة طبية</span>
                    </label>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => { setShowModal(false); setEditingMed(null); setForm(EMPTY_FORM); }}>إلغاء</Button>
                        <Button className="flex-1" loading={submitting} onClick={handleSubmit}>{editingMed ? 'حفظ التعديلات' : 'إضافة الدواء'}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
