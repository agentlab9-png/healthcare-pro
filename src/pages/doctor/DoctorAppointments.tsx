import { useState } from 'react';
import { Filter, Search, FileEdit, Video } from 'lucide-react';
import { Card, Input, Button } from '../../components/ui';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store';
import { useNotificationStore } from '../../store/notificationStore';
import { useNavigate } from 'react-router-dom';

export default function DoctorAppointments() {
    const { user } = useAuthStore();
    const { appointments, updateAppointmentStatus } = useDataStore();
    const { notify } = useNotificationStore();
    const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const myAppointments = appointments.filter(a => a.doctorId === user?.id && a.status !== 'ملغي');
    const todayStr = new Date().toISOString().split('T')[0];
    const tabFiltered = activeTab === 'today'
        ? myAppointments.filter(a => a.date === todayStr)
        : myAppointments;

    const filteredApps = searchQuery.trim()
        ? tabFiltered.filter(a =>
            (a.patientName || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        : tabFiltered;

    const startConsultation = (appId: string, patientId: string) => {
        updateAppointmentStatus(appId, 'مؤكد');
        notify('تم بدء الكشف الطبي', 'success');
        navigate(`/doctor/patients/${patientId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#1C2B2A]">إدارة المواعيد</h2>
                </div>
                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-[#C8DDD9] w-64">
                    <button
                        onClick={() => setActiveTab('today')}
                        className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'today' ? 'bg-[#3A7DBF] text-white shadow-md' : 'text-[#7A9490]'}`}
                    >
                        مواعيد اليوم
                    </button>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'upcoming' ? 'bg-[#3A7DBF] text-white shadow-md' : 'text-[#7A9490]'}`}
                    >
                        الجدول الكامل
                    </button>
                </div>
            </div>

            <div className="flex gap-3">
                <Input
                    placeholder="ابحث عن مريض..."
                    icon={<Search size={20} />}
                    className="max-w-md bg-white border-[#C8DDD9]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" className="w-12 px-0 bg-white">
                    <Filter size={20} className="text-[#3A7DBF]" />
                </Button>
            </div>

            <div className="space-y-4">
                {filteredApps.length > 0 ? filteredApps.map((app) => (
                    <Card key={app.id} className="p-4 flex items-center justify-between border-l-4 border-l-[#3A7DBF] hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-6">
                            <div className="text-center w-20">
                                <span className="text-sm font-black text-[#1C2B2A] block">{app.time.split(' ')[0]}</span>
                                <span className="text-[10px] text-[#7A9490] font-bold">{app.time.split(' ')[1]}</span>
                            </div>

                            <div className="w-[1px] h-12 bg-[#C8DDD9]"></div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-[#1C2B2A] text-lg">{app.patientName || 'مريض جديد'}</h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.type === 'حضوري' ? 'bg-[#E0F2EE] text-[#1A5C4F]' : 'bg-[#E0EEFA] text-[#1E5A8E]'}`}>
                                        {app.type}
                                    </span>
                                </div>
                                <p className="text-sm text-[#4A6360]">الشكوى: {app.reason || 'متابعة دورية'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {app.type === 'استشارة فيديو' && (
                                <Button size="sm" className="bg-[#E0EEFA] text-[#3A7DBF] hover:bg-[#C5E1F7] gap-2" onClick={() => { notify('جاري بدء مكالمة الفيديو مع المريض...', 'info'); }}>
                                    <Video size={16} /> دخول للاجتماع
                                </Button>
                            )}
                            <Button
                                size="sm"
                                className="bg-[#3A7DBF] hover:bg-[#2c6198] text-white gap-2"
                                onClick={() => startConsultation(app.id, app.patientId)}
                            >
                                <FileEdit size={16} /> بدء الكشف
                            </Button>
                        </div>
                    </Card>
                )) : (
                    <p className="text-center text-[#7A9490] py-12 italic bg-white rounded-2xl border border-dashed border-[#C8DDD9]">
                        {searchQuery ? 'لا توجد نتائج للبحث' : 'لا يوجد مواعيد مقررة حالياً'}
                    </p>
                )}
            </div>
        </div>
    );
}
