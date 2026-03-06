import { Card } from '../../components/ui/Card';
import { Calendar, Pill, Activity, ChevronLeft, CalendarPlus, ShoppingCart, FileText, Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store';

export default function PatientDashboard() {
    const { user } = useAuthStore();
    const { appointments, medications } = useDataStore();

    // Get the next confirmed/pending appointment for this patient
    const nextApp = appointments
        .filter(a => a.patientId === (user?.patientId || user?.id) && (a.status === 'مؤكد' || a.status === 'في الانتظار'))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    // Get medications for this patient
    const activeMed = medications[0]; // Just showing the first one as an example
    return (
        <div className="space-y-6 pb-6">
            {/* Status Cards */}
            <section className="space-y-3">
                <h3 className="text-sm font-bold text-[#7A9490] px-1">البطاقات السريعة</h3>

                {/* Next Appointment Card */}
                {nextApp ? (
                    <Card className="p-4 border-l-4 border-l-[#3A7DBF] bg-gradient-to-l from-white to-[#EEF4FB]">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#3A7DBF] shadow-sm flex-shrink-0">
                                <Calendar size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-[#3A7DBF] bg-white px-2 py-0.5 rounded-full">الموعد القادم</span>
                                    <span className="text-xs text-[#7A9490]">{nextApp.status}</span>
                                </div>
                                <h4 className="font-bold text-[#1C2B2A]">{nextApp.doctorName} - {nextApp.type}</h4>
                                <p className="text-sm text-[#4A6360]">{nextApp.date} • {nextApp.time}</p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-4 border border-dashed border-[#C8DDD9] flex items-center justify-center text-[#7A9490] text-sm italic">
                        لا يوجد مواعيد قادمة حالياً
                    </Card>
                )}

                {/* Medication Now Card */}
                {activeMed && (
                    <Card className="p-4 border-l-4 border-l-[#D4820A] bg-gradient-to-l from-white to-[#FEF6E8]">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#D4820A] shadow-sm flex-shrink-0">
                                <Pill size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-[#D4820A] bg-white px-2 py-0.5 rounded-full">دواء الآن</span>
                                </div>
                                <h4 className="font-bold text-[#1C2B2A]">{activeMed.name}</h4>
                                <p className="text-sm text-[#4A6360]">{activeMed.instructions}</p>
                            </div>
                            <button className="h-8 w-8 bg-[#D4820A] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#b56e08] transition-colors">
                                ✓
                            </button>
                        </div>
                    </Card>
                )}

                {/* Last Lab Result */}
                <Card className="p-4 border-l-4 border-l-[#2E7D6B] bg-gradient-to-l from-white to-[#EFF6F4]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2E7D6B] shadow-sm flex-shrink-0">
                            <Activity size={20} />
                        </div>
                        <div className="flex-1 text-sm text-[#4A6360] flex items-center justify-between">
                            <span>تحليل <strong>HbA1c</strong> منذ أسبوعين</span>
                            <button className="text-[#2E7D6B] font-bold text-xs flex items-center gap-1">
                                عرض النتيجة <ChevronLeft size={14} />
                            </button>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Quick Access */}
            <section className="space-y-3">
                <h3 className="text-sm font-bold text-[#7A9490] px-1">الوصول السريع</h3>
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { icon: CalendarPlus, label: 'احجز موعد', color: 'bg-[#EEF4FB] text-[#3A7DBF]', path: '/patient/appointments/book' },
                        { icon: ShoppingCart, label: 'اطلب دواء', color: 'bg-[#EFF6F4] text-[#2E7D6B]', path: '/patient/pharmacy' },
                        { icon: FileText, label: 'سجل طبي', color: 'bg-[#EDE8F5] text-[#7B5EA7]', path: '/patient/records' },
                        { icon: Beaker, label: 'تحاليل', color: 'bg-[#FEF6E8] text-[#D4820A]', path: '/patient/records' },
                    ].map((item, idx) => (
                        <Link key={idx} to={item.path} className="flex flex-col items-center gap-2 group">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-95 ${item.color}`}>
                                <item.icon size={24} />
                            </div>
                            <span className="text-[11px] font-bold text-[#4A6360] text-center">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Daily Tip */}
            <section className="space-y-3">
                <h3 className="text-sm font-bold text-[#7A9490] px-1">النصيحة اليومية</h3>
                <Card className="p-5 bg-gradient-to-br from-[#2E7D6B] to-[#1A5C4F] text-white border-none relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-[#A8D8CE]">
                            <span className="text-xl">💡</span>
                            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">بسبب إصابتك بالسكري</span>
                        </div>
                        <p className="text-sm leading-relaxed font-tajawal">
                            قلل من الكربوهيدرات البيضاء واستبدلها بالحبوب الكاملة للحفاظ على استقرار مستويات السكر في الدم طوال اليوم.
                        </p>
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute top-0 -right-5 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                </Card>
            </section>
        </div>
    );
}
