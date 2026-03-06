import { useState } from 'react';
import { FileText, Beaker, FilePlus, ChevronLeft, Download } from 'lucide-react';
import { Card } from '../../components/ui';
import { useDataStore, type MedicalRecord } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';

export default function RecordsPage() {
    const { records } = useDataStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'reports' | 'labs'>('reports');

    const myRecords = records.filter(r => r.patientId === (user?.patientId || user?.id));
    const reports = myRecords.filter(r => r.type === 'report');
    const labs = myRecords.filter(r => r.type === 'lab');

    return (
        <div className="space-y-6 pb-6 w-full">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-[#1C2B2A]">السجل الطبي</h2>
                <button className="h-8 px-3 bg-[#EEF4FB] text-[#3A7DBF] rounded-lg font-bold text-xs flex items-center gap-1">
                    <FilePlus size={14} /> رفع مستند
                </button>
            </div>

            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-[#C8DDD9]">
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'reports' ? 'bg-[#2E7D6B] text-white shadow-md' : 'text-[#7A9490]'}`}
                >
                    التقارير الطبية ({reports.length})
                </button>
                <button
                    onClick={() => setActiveTab('labs')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'labs' ? 'bg-[#2E7D6B] text-white shadow-md' : 'text-[#7A9490]'}`}
                >
                    التحاليل والفحوصات ({labs.length})
                </button>
            </div>

            {activeTab === 'reports' ? (
                <div className="space-y-3">
                    {reports.length > 0 ? reports.map((rep: MedicalRecord, idx: number) => (
                        <Card key={idx} className="p-4 flex items-center gap-4 group cursor-pointer hover:border-[#4A9E8A]">
                            <div className="w-12 h-12 bg-[#EEF4FB] text-[#3A7DBF] rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1C2B2A] text-sm">{rep.title}</h4>
                                <p className="text-xs text-[#4A6360] mt-0.5">{rep.doctorName} • {rep.date}</p>
                                <p className="text-[10px] text-[#7A9490] mt-1 line-clamp-1">{rep.content}</p>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-[#F8FAF9] text-[#2E7D6B] flex items-center justify-center group-hover:bg-[#EFF6F4]">
                                <Download size={16} />
                            </button>
                        </Card>
                    )) : (
                        <div className="border border-dashed border-[#C8DDD9] rounded-2xl p-8 text-center">
                            <p className="text-[#7A9490] text-sm">لا توجد تقارير طبية بعد</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {labs.length > 0 ? labs.map((lab: MedicalRecord, idx: number) => (
                        <Card key={idx} className="p-4 flex items-center gap-4 group cursor-pointer hover:border-[#4A9E8A]">
                            <div className="w-12 h-12 bg-[#F3EFF9] text-[#7B5EA7] rounded-xl flex items-center justify-center flex-shrink-0">
                                <Beaker size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-[#1C2B2A] text-sm">{lab.title}</h4>
                                    {lab.status && (
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${lab.color || 'bg-[#EFF6F4] text-[#2E7D6B]'}`}>
                                            {lab.status}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-[#4A6360] mt-1">{lab.doctorName} • {lab.date}</p>
                            </div>
                            <ChevronLeft size={20} className="text-[#C8DDD9] group-hover:text-[#2E7D6B] transition-colors" />
                        </Card>
                    )) : (
                        <div className="border border-dashed border-[#C8DDD9] rounded-2xl p-8 text-center">
                            <p className="text-[#7A9490] text-sm">لا توجد تحاليل بعد</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
