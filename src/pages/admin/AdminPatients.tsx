import { useState } from 'react';
import { Search, Filter, MoreVertical, FileText } from 'lucide-react';
import { Card, Input, Button } from '../../components/ui';
import { useDataStore } from '../../store/dataStore';
import { useNavigate } from 'react-router-dom';
import { type Patient } from '../../types';

export default function AdminPatients() {
    const { patients, appointments } = useDataStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = searchQuery.trim()
        ? patients.filter((p: Patient) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.mrn || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        : patients;

    const getLastVisit = (patientId: string): string => {
        const lastApp = appointments
            .filter(a => a.patientId === patientId && (a.status === 'مكتمل' || a.status === 'مؤكد'))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return lastApp ? lastApp.date : '—';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#1C2B2A]">إدارة المرضى</h2>
                    <p className="text-[#7A9490] mt-1">متابعة سجلات المرضى والبيانات الحيوية</p>
                </div>
            </div>

            <div className="flex gap-3">
                <Input
                    placeholder="ابحث عن مريض بالاسم أو رقم الملف..."
                    icon={<Search size={20} />}
                    className="max-w-md bg-white border-[#C8DDD9]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" className="w-12 px-0 bg-white border-[#C8DDD9]">
                    <Filter size={20} className="text-[#2E7D6B]" />
                </Button>
            </div>

            <Card className="overflow-hidden border-[#C8DDD9]">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-[#F8FAF9] border-b border-[#C8DDD9]">
                                <th className="p-4 text-sm font-bold text-[#4A6360]">اسم المريض</th>
                                <th className="p-4 text-sm font-bold text-[#4A6360]">رقم الملف</th>
                                <th className="p-4 text-sm font-bold text-[#4A6360]">آخر زيارة</th>
                                <th className="p-4 text-sm font-bold text-[#4A6360]">الحالة</th>
                                <th className="p-4 text-sm font-bold text-[#4A6360]">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#C8DDD9]">
                            {filtered.length > 0 ? filtered.map((pat: Patient) => (
                                <tr key={pat.id} className="hover:bg-[#EFF6F4]/40 transition-colors">
                                    <td className="p-4 font-bold text-[#1C2B2A]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#E0F2EE] text-[#1A5C4F] rounded-full flex items-center justify-center font-bold text-xs">
                                                {pat.name.charAt(0)}
                                            </div>
                                            {pat.name}
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-[#7A9490]">{pat.mrn || 'N/A'}</td>
                                    <td className="p-4 text-[#4A6360]">{getLastVisit(pat.id)}</td>
                                    <td className="p-4">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#EFF6F4] text-[#2E7D6B]">مستقر</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/patients/${pat.id}`)}
                                                className="p-1.5 text-[#2E7D6B] hover:bg-[#EFF6F4] rounded-lg transition-colors"
                                            >
                                                <FileText size={16} />
                                            </button>
                                            <button className="p-1.5 text-[#7A9490] hover:bg-[#F8FAF9] rounded-lg transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-[#7A9490] text-sm">
                                        {searchQuery ? 'لا توجد نتائج مطابقة' : 'لا يوجد مرضى مسجلون'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
