import { useState } from 'react';
import { Search, FileText, Calendar } from 'lucide-react';
import { Card, Input } from '../../components/ui';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { type Patient } from '../../types';

export default function DoctorPatientsList() {
    const { user } = useAuthStore();
    const { appointments, patients } = useDataStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Get unique patient IDs that have appointments with this doctor
    const myPatientIds = [...new Set(
        appointments
            .filter(a => a.doctorId === user?.id)
            .map(a => a.patientId)
    )];

    const myPatients = patients.filter(p => myPatientIds.includes(p.id));

    const filtered = searchQuery.trim()
        ? myPatients.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.mrn || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        : myPatients;

    const getLastAppointment = (patientId: string) => {
        return appointments
            .filter(a => a.patientId === patientId && a.doctorId === user?.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#1C2B2A]">مرضاي</h2>
                <p className="text-[#7A9490] mt-1">قائمة المرضى الذين راجعوك</p>
            </div>

            <Input
                placeholder="ابحث بالاسم أو رقم الملف..."
                icon={<Search size={20} />}
                className="max-w-md bg-white border-[#C8DDD9]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map((pat: Patient) => {
                        const lastApp = getLastAppointment(pat.id);
                        return (
                            <Card
                                key={pat.id}
                                className="p-4 flex items-center justify-between hover:border-[#3A7DBF] cursor-pointer transition-all"
                                onClick={() => navigate(`/doctor/patients/${pat.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#EEF4FB] text-[#3A7DBF] flex items-center justify-center font-bold text-lg">
                                        {pat.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1C2B2A]">{pat.name}</h4>
                                        <p className="text-xs text-[#7A9490]">رقم الملف: {pat.mrn || 'N/A'}</p>
                                        {pat.chronicConditions && pat.chronicConditions.length > 0 && (
                                            <div className="flex gap-1 mt-1">
                                                {pat.chronicConditions.slice(0, 2).map((c, i) => (
                                                    <span key={i} className="text-[9px] bg-[#FDEAE8] text-[#C0392B] px-1.5 py-0.5 rounded-full font-bold">{c}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-left flex flex-col items-end gap-2">
                                    {lastApp && (
                                        <div className="flex items-center gap-1 text-xs text-[#7A9490]">
                                            <Calendar size={12} />
                                            <span>{lastApp.date}</span>
                                        </div>
                                    )}
                                    <button className="flex items-center gap-1 text-xs text-[#3A7DBF] font-bold hover:underline">
                                        <FileText size={14} /> عرض الملف
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="border border-dashed border-[#C8DDD9] rounded-2xl p-12 text-center">
                    <p className="text-[#7A9490] text-sm">
                        {searchQuery ? 'لا توجد نتائج مطابقة' : 'لا يوجد مرضى مسجلون بعد'}
                    </p>
                </div>
            )}
        </div>
    );
}
