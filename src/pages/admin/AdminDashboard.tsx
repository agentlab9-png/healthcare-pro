import { Users, UserPlus, Activity, Database, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui';
import { useDataStore } from '../../store/dataStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useNavigate } from 'react-router-dom';
import { type Medication } from '../../types';

export default function AdminDashboard() {
    const { patients, doctors, medications, doctorApplications, approveDoctor } = useDataStore();
    const { notify } = useNotificationStore();
    const navigate = useNavigate();

    const lowStockCount = medications.filter((m: Medication) => (m.stock || 0) < 20).length;

    const stats = [
        { label: 'إجمالي المرضى', value: patients.length.toLocaleString(), icon: Users, color: 'text-[#2E7D6B]', bg: 'bg-[#EFF6F4]', trend: '+12% هذا الشهر' },
        { label: 'الأطباء النشطين', value: doctors.length.toLocaleString(), icon: UserPlus, color: 'text-[#3A7DBF]', bg: 'bg-[#EEF4FB]', trend: '+3 هذا الأسبوع' },
        { label: 'نقص في المخزون', value: lowStockCount.toString(), icon: AlertCircle, color: 'text-[#C0392B]', bg: 'bg-[#FDEAE8]', trend: 'تتطلب المراجعة العاجلة' },
        { label: 'إيرادات المنصة', value: '145k', desc: 'ريال', icon: TrendingUp, color: 'text-[#7B5EA7]', bg: 'bg-[#F3EFF9]', trend: '+8% مقارنة بالشهر الماضي' },
    ];

    const handleExportReport = () => {
        const report = `تقرير النظام\n${'='.repeat(40)}\n\nإجمالي المرضى: ${patients.length}\nالأطباء النشطين: ${doctors.length}\nالأدوية في المخزون: ${medications.length}\nأدوية بنقص مخزون: ${lowStockCount}\n\nتاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}`;
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-report-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        notify('تم استخراج تقرير النظام بنجاح', 'success');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#1C2B2A]">نظرة عامة على النظام</h2>
                    <p className="text-[#7A9490] mt-1">مرحباً بك في لوحة تحكم المشرف الرئيسي</p>
                </div>
                <button
                    onClick={handleExportReport}
                    className="px-4 py-2 bg-[#7B5EA7] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#5A3E8A] transition-colors flex items-center gap-2"
                >
                    <Database size={16} /> استخراج تقرير النظام
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={idx} className="p-6 relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-3xl font-black text-[#1C2B2A]">{stat.value}</span>
                                    {stat.desc && <span className="text-sm font-bold text-[#7A9490]">{stat.desc}</span>}
                                </div>
                                <p className="text-sm font-bold text-[#4A6360]">{stat.label}</p>
                                <p className="text-[10px] text-[#7A9490] mt-1 pr-1 border-r-2 border-[#C8DDD9]">{stat.trend}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Doctor Applications */}
                <Card className="p-6 border-l-4 border-l-[#D4820A]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#1C2B2A] text-lg flex items-center gap-2">
                            <UserPlus className="text-[#D4820A]" size={20} /> طلبات انضمام الأطباء
                        </h3>
                        <button
                            onClick={() => navigate('/admin/doctors')}
                            className="text-sm font-bold text-[#7B5EA7] hover:underline"
                        >
                            عرض الكل ({doctorApplications.length + doctors.length})
                        </button>
                    </div>
                    <div className="space-y-4">
                        {doctorApplications.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-[#F8FAF9] rounded-2xl border border-[#C8DDD9]">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-xl border border-[#C8DDD9] flex items-center justify-center text-[#7A9490] font-bold">
                                        {doc.name.split(' ')[1]?.charAt(0) || 'د'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1C2B2A] text-sm">{doc.name}</h4>
                                        <p className="text-xs text-[#4A6360]">{doc.specialty} • خبرة {doc.experience}</p>
                                        <p className="text-[10px] text-[#7A9490] mt-1">{doc.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            approveDoctor(doc.id);
                                            notify(`تم قبول طلب انضمام ${doc.name} بنجاح`, 'success');
                                        }}
                                        className="px-3 py-1.5 bg-[#EFF6F4] text-[#2E7D6B] text-xs font-bold rounded-lg hover:bg-[#2E7D6B] hover:text-white transition-colors"
                                    >
                                        قبول
                                    </button>
                                    <button
                                        onClick={() => notify(`جاري مراجعة طلب ${doc.name}...`, 'info')}
                                        className="px-3 py-1.5 bg-[#FDEAE8] text-[#C0392B] text-xs font-bold rounded-lg hover:bg-[#C0392B] hover:text-white transition-colors"
                                    >
                                        مراجعة
                                    </button>
                                </div>
                            </div>
                        ))}
                        {doctorApplications.length === 0 && (
                            <p className="text-center text-sm text-[#7A9490] py-4">لا توجد طلبات معلقة حالياً</p>
                        )}
                    </div>
                </Card>

                {/* System Alerts */}
                <Card className="p-6 border-l-4 border-l-[#C0392B]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#1C2B2A] text-lg flex items-center gap-2">
                            <AlertCircle className="text-[#C0392B]" size={20} /> تنبيهات النظام الطبية
                        </h3>
                        <button
                            onClick={() => navigate('/admin/pharmacy')}
                            className="text-sm font-bold text-[#7B5EA7] hover:underline"
                        >
                            إدارة المخزون
                        </button>
                    </div>
                    <div className="space-y-4">
                        {medications.filter((m: Medication) => (m.stock || 0) < 10).map((med, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border bg-[#FDEAE8] border-[#f5b7b1]">
                                <div className="mt-0.5 text-[#C0392B]">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1 text-[#C0392B]">
                                        نقص مخزون حاد
                                    </h4>
                                    <p className="text-xs text-[#4A6360] leading-relaxed">دواء "{med.name}" اقترب من النفاد ({med.stock} علبة متبقية).</p>
                                </div>
                            </div>
                        ))}
                        {medications.filter((m: Medication) => (m.stock || 0) >= 10 && (m.stock || 0) < 20).map((med, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border bg-[#F8FAF9] border-[#C8DDD9]">
                                <div className="mt-0.5 text-[#7A9490]">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1 text-[#1C2B2A]">
                                        تنبيه مخزون
                                    </h4>
                                    <p className="text-xs text-[#4A6360] leading-relaxed">يجب إعادة طلب دواء "{med.name}" قريباً.</p>
                                </div>
                            </div>
                        ))}
                        {medications.filter((m: Medication) => (m.stock || 0) < 20).length === 0 && (
                            <p className="text-center text-sm text-[#7A9490] py-4">لا توجد تنبيهات حالياً - المخزون جيد</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
