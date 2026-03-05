import { LogOut, User, Mail, Droplets, HeartPulse, AlertTriangle } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { type Patient } from '../../types';

export default function PatientProfile() {
    const { user, logout } = useAuthStore();
    const patient = user as Patient | null;

    const infoItems = [
        { label: 'الاسم الكامل', value: patient?.name, icon: User },
        { label: 'البريد الإلكتروني', value: patient?.email, icon: Mail },
        { label: 'فصيلة الدم', value: patient?.bloodType || 'غير محدد', icon: Droplets },
        { label: 'العمر', value: patient?.age ? `${patient.age} عام` : 'غير محدد', icon: HeartPulse },
    ];

    return (
        <div className="space-y-6 pb-6">
            {/* Avatar Header */}
            <Card className="p-6 bg-gradient-to-br from-[#2E7D6B] to-[#1A5C4F] text-white border-none">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold border border-white/30">
                        {patient?.name?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{patient?.name}</h2>
                        <p className="text-white/70 text-sm mt-1">رقم الملف: {patient?.mrn || 'غير محدد'}</p>
                        <span className="inline-block mt-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                            مريض نشط
                        </span>
                    </div>
                </div>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
                {infoItems.map((item) => (
                    <Card key={item.label} className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <item.icon size={16} className="text-[#2E7D6B]" />
                            <p className="text-xs text-[#7A9490] font-bold">{item.label}</p>
                        </div>
                        <p className="font-bold text-[#1C2B2A] text-sm">{item.value || 'غير محدد'}</p>
                    </Card>
                ))}
            </div>

            {/* Allergies */}
            {patient?.allergies && patient.allergies.length > 0 && (
                <Card className="p-5">
                    <h3 className="font-bold text-[#1C2B2A] mb-3 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-[#D4820A]" /> الحساسيات
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((a, i) => (
                            <span key={i} className="px-3 py-1 bg-[#FEF6E8] text-[#D4820A] rounded-full text-xs font-bold">{a}</span>
                        ))}
                    </div>
                </Card>
            )}

            {/* Chronic Conditions */}
            {patient?.chronicConditions && patient.chronicConditions.length > 0 && (
                <Card className="p-5">
                    <h3 className="font-bold text-[#1C2B2A] mb-3 flex items-center gap-2">
                        <HeartPulse size={18} className="text-[#C0392B]" /> الأمراض المزمنة
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {patient.chronicConditions.map((c, i) => (
                            <span key={i} className="px-3 py-1 bg-[#FDEAE8] text-[#C0392B] rounded-full text-xs font-bold">{c}</span>
                        ))}
                    </div>
                </Card>
            )}

            {/* Logout */}
            <Button variant="danger" className="w-full gap-2" onClick={logout}>
                <LogOut size={18} /> تسجيل الخروج
            </Button>
        </div>
    );
}
