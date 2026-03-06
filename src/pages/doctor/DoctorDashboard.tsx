import { Users, Calendar, TrendingUp, Star, MoreVertical } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store';

export default function DoctorDashboard() {
    const { user } = useAuthStore();
    const { appointments } = useDataStore();

    // Filter appointments for the current doctor
    const myAppointments = appointments.filter(a => a.doctorId === (user?.doctorId || user?.id) && a.status !== 'ملغي');
    const todayStr = new Date().toISOString().split('T')[0];
    const todayApps = myAppointments.filter(a => a.date === todayStr);

    const stats = [
        { label: 'مرضى اليوم', value: todayApps.length.toString(), icon: Users, color: 'text-[#3A7DBF]', bg: 'bg-[#EEF4FB]' },
        { label: 'مواعيد الأسبوع', value: myAppointments.length.toString(), icon: Calendar, color: 'text-[#2E7D6B]', bg: 'bg-[#EFF6F4]' },
        { label: 'الدخل اليومي', value: (todayApps.length * 200).toLocaleString(), desc: 'ريال', icon: TrendingUp, color: 'text-[#7B5EA7]', bg: 'bg-[#F3EFF9]' },
        { label: 'التقييم العام', value: '4.8', desc: 'من 5', icon: Star, color: 'text-[#D4820A]', bg: 'bg-[#FEF6E8]' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#1C2B2A]">لوحة التحكم</h2>
                    <p className="text-[#7A9490] mt-1">مرحباً {user?.name}، إليك ملخص اليوم</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-[#C8DDD9] text-[#4A6360] font-bold text-sm rounded-xl shadow-sm hover:bg-[#F8FAF9] transition-colors">
                        إعدادات الدوام
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={idx} className="p-6 relative overflow-hidden group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-bold text-[#7A9490] mb-2">{stat.label}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-[#1C2B2A]">{stat.value}</span>
                                        {stat.desc && <span className="text-sm font-bold text-[#7A9490]">{stat.desc}</span>}
                                    </div>
                                </div>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Next Appointments */}
                <Card className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#1C2B2A] text-lg">المواعيد القادمة اليوم</h3>
                        <button className="text-sm font-bold text-[#3A7DBF] hover:underline">عرض الكل</button>
                    </div>
                    <div className="space-y-4">
                        {todayApps.length > 0 ? todayApps.map((app) => (
                            <div key={app.id} className="flex items-center justify-between p-4 bg-[#F8FAF9] rounded-2xl border border-[#C8DDD9]">
                                <div className="flex items-center gap-4">
                                    <div className="text-center w-16 px-3 py-1 bg-white border border-[#C8DDD9] rounded-lg">
                                        <span className="text-[10px] text-[#7A9490] block">الوقت</span>
                                        <span className="text-sm font-bold text-[#3A7DBF]">{app.time.split(' ')[0]}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1C2B2A]">{app.patientName || 'مريض جديد'}</h4>
                                        <p className="text-xs text-[#4A6360]">{app.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${app.status === 'في الانتظار' ? 'bg-[#FEF6E8] text-[#D4820A]' : 'bg-[#EFF6F4] text-[#2E7D6B]'}`}>
                                        {app.status}
                                    </span>
                                    <button className="text-[#C8DDD9] hover:text-[#3A7DBF]"><MoreVertical size={20} /></button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-[#7A9490] text-sm py-8">لا يوجد مواعيد مقررة لليوم</p>
                        )}
                    </div>
                </Card>

                {/* Latest Reviews */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#1C2B2A] text-lg">آخر التقييمات</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'مريض سري', rate: 5, date: 'اليوم', text: 'طبيبة ممتازة جداً ومستمعة جيدة للمريض.' },
                            { name: 'مريض سري', rate: 4, date: 'أمس', text: 'العلاج فعال والشرح وافي، لكن الانتظار طال قليلاً.' },
                        ].map((rev, idx) => (
                            <div key={idx} className="pb-4 border-b border-[#C8DDD9] last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-1 text-[#D4820A]">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={14} fill={i < rev.rate ? 'currentColor' : 'none'} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-[#7A9490] font-bold">{rev.date}</span>
                                </div>
                                <p className="text-sm text-[#4A6360] leading-snug">{rev.text}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
