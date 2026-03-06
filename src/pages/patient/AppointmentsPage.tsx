import { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Star } from 'lucide-react';
import { Card, Input, Button } from '../../components/ui';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { type Appointment, type Doctor } from '../../types';

export default function AppointmentsPage() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'book'>('upcoming');

    return (
        <div className="space-y-6 pb-6 w-full">
            <h2 className="text-xl font-bold text-[#1C2B2A] px-1">المواعيد</h2>

            {/* Custom Tabs */}
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-[#C8DDD9]">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'upcoming' ? 'bg-[#2E7D6B] text-white shadow-md' : 'text-[#7A9490]'}`}
                >
                    مواعيدي القادمة
                </button>
                <button
                    onClick={() => setActiveTab('book')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'book' ? 'bg-[#2E7D6B] text-white shadow-md' : 'text-[#7A9490]'}`}
                >
                    حجز موعد جديد
                </button>
            </div>

            {activeTab === 'upcoming' && <UpcomingAppointments />}
            {activeTab === 'book' && <BookAppointment onBooked={() => setActiveTab('upcoming')} />}

        </div>
    );
}

function UpcomingAppointments() {
    const { user } = useAuthStore();
    const { appointments, cancelAppointment } = useDataStore();
    const { notify } = useNotificationStore();

    const myAppointments = appointments.filter(a => a.patientId === (user?.patientId || user?.id) && a.status !== 'ملغي');

    return (
        <div className="space-y-4 mt-6">
            {myAppointments.length > 0 ? (
                myAppointments.map((app) => (
                    <Card key={app.id} className="p-4 border-l-4 border-l-[#3A7DBF] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#EEF4FB] to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${app.status === 'مؤكد' ? 'text-[#2E7D6B] bg-[#EFF6F4] border-[#C8DDD9]' :
                                app.status === 'في الانتظار' ? 'text-[#D4820A] bg-[#FEF6E8] border-[#FBD9A0]' :
                                    'text-[#7A9490] bg-[#F8FAF9] border-[#C8DDD9]'
                                }`}>
                                {app.status === 'مؤكد' ? `موعد مؤكد (${app.type})` : `موعد ${app.status} (${app.type})`}
                            </span>
                            <span className="text-xs text-[#7A9490] font-medium">#{app.id}</span>
                        </div>

                        <div className="flex gap-4 mb-4 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-[#F8FAF9] flex items-center justify-center border border-[#C8DDD9] text-[#2E7D6B] font-bold text-lg">
                                {app.doctorName?.charAt(0) || 'D'}
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1C2B2A] text-base">{app.doctorName}</h4>
                                <div className="flex items-center gap-1 text-xs text-[#7A9490] mt-1">
                                    <MapPin size={12} />
                                    <span>مستشفى الشفاء - العيادة 4</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#F8FAF9] rounded-xl p-3 flex justify-between items-center mb-4 relative z-10 border border-[#EFF6F4]">
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-[#7A9490] mb-0.5">التاريخ</p>
                                <p className="text-sm font-bold text-[#1C2B2A]">{app.date}</p>
                            </div>
                            <div className="w-[1px] h-8 bg-[#C8DDD9]"></div>
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-[#7A9490] mb-0.5">الوقت</p>
                                <p className="text-sm font-bold text-[#1C2B2A]">{app.time}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 relative z-10">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-[#C0392B] text-[#C0392B] hover:bg-[#FDEAE8]"
                                onClick={() => {
                                    cancelAppointment(app.id);
                                    notify('تم إلغاء الموعد', 'info');
                                }}
                            >
                                إلغاء الموعد
                            </Button>
                            <Button variant="secondary" size="sm" className="flex-1">إعادة جدولة</Button>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="border border-dashed border-[#C8DDD9] rounded-2xl p-8 text-center bg-[#F8FAF9]/50">
                    <div className="w-12 h-12 bg-[#EFF6F4] text-[#2E7D6B] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar size={24} />
                    </div>
                    <p className="text-[#4A6360] font-medium text-sm">لا توجد مواعيد أخرى قادمة</p>
                </div>
            )}
        </div>
    );
}

const SPECIALTIES = ['الكل', 'باطنية', 'أطفال', 'أسنان', 'عيون', 'عظام', 'جلدية'];

const TIME_SLOTS = ['08:00 ص', '09:00 ص', '10:00 ص', '11:00 ص', '12:00 م', '01:00 م', '02:00 م', '03:00 م'];

function BookAppointment({ onBooked }: { onBooked: () => void }) {
    const { doctors, addAppointment } = useDataStore();
    const { user } = useAuthStore();
    const { notify } = useNotificationStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('الكل');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const minDate = new Date().toISOString().split('T')[0];

    const filteredDoctors = doctors.filter((doc: Doctor) => {
        const matchesSearch = searchQuery.trim() === '' ||
            doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'الكل' ||
            doc.specialty.includes(activeCategory);
        return matchesSearch && matchesCategory;
    });

    const handleBook = () => {
        if (!selectedDoctor) return;
        if (!selectedDate) {
            notify('يرجى اختيار تاريخ الموعد', 'error');
            return;
        }
        if (!selectedTime) {
            notify('يرجى اختيار وقت الموعد', 'error');
            return;
        }

        const newApp: Appointment = {
            id: `APP-${Date.now()}`,
            patientId: user?.patientId || user?.id || '',
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            patientName: user?.name,
            date: selectedDate,
            time: selectedTime,
            type: 'حضوري',
            status: 'في الانتظار',
        };
        addAppointment(newApp);
        notify('تم حجز الموعد بنجاح', 'success');
        onBooked();
    };

    if (selectedDoctor) {
        return (
            <div className="space-y-5 mt-6">
                <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-sm text-[#3A7DBF] font-bold flex items-center gap-1 hover:underline"
                >
                    ← العودة لقائمة الأطباء
                </button>

                <Card className="p-5 space-y-4">
                    <div className="flex gap-3 items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#EEF4FB] text-[#3A7DBF] flex items-center justify-center font-bold text-xl border border-[#C8DDD9]">
                            {selectedDoctor.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1C2B2A] text-lg">{selectedDoctor.name}</h4>
                            <p className="text-sm text-[#7A9490]">{selectedDoctor.specialty}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-[#4A6360] block mb-2">اختر التاريخ</label>
                        <input
                            type="date"
                            min={minDate}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full border border-[#C8DDD9] rounded-xl px-4 py-2.5 text-sm text-[#1C2B2A] focus:outline-none focus:border-[#2E7D6B]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-[#4A6360] block mb-2">اختر الوقت</label>
                        <div className="grid grid-cols-4 gap-2">
                            {TIME_SLOTS.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedTime(slot)}
                                    className={`py-2 text-xs font-bold rounded-xl border transition-colors ${selectedTime === slot
                                        ? 'bg-[#2E7D6B] text-white border-[#2E7D6B]'
                                        : 'bg-white text-[#4A6360] border-[#C8DDD9] hover:border-[#2E7D6B]'
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button className="w-full" onClick={handleBook}>
                        تأكيد الحجز
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-5 mt-6">
            <div className="flex gap-2">
                <Input
                    placeholder="ابحث عن طبيب أو تخصص..."
                    icon={<Search size={20} />}
                    className="flex-1 bg-white border-[#C8DDD9]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="secondary" className="w-12 px-0 bg-white border border-[#C8DDD9]">
                    <Filter size={20} className="text-[#2E7D6B]" />
                </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                {SPECIALTIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${activeCategory === cat ? 'bg-[#2E7D6B] text-white border-[#2E7D6B]' : 'bg-white text-[#4A6360] border-[#C8DDD9] hover:border-[#4A9E8A]'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredDoctors.length > 0 ? filteredDoctors.map((doc: Doctor) => (
                    <Card key={doc.id} className="p-4 flex flex-col gap-3 group hover:shadow-md hover:border-[#4A9E8A] transition-all cursor-pointer">
                        <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-[#EEF4FB] text-[#3A7DBF] flex items-center justify-center font-bold text-xl border border-[#C8DDD9] flex-shrink-0">
                                {doc.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-[#1C2B2A]">{doc.name}</h4>
                                    <div className="flex items-center gap-1 text-[#D4820A] bg-[#FEF6E8] px-1.5 py-0.5 rounded text-[10px] font-bold">
                                        <Star size={10} fill="currentColor" /> {doc.rating}
                                    </div>
                                </div>
                                <p className="text-xs text-[#7A9490]">{doc.specialty}</p>
                                <div className="mt-2 text-xs flex items-center gap-4 text-[#4A6360]">
                                    <span className="flex items-center gap-1 bg-[#F8FAF9] px-2 py-1 rounded-md">💰 {doc.consultationFee || 200} ريال</span>
                                    <span className="flex items-center gap-1 bg-[#F8FAF9] px-2 py-1 rounded-md">💬 {doc.reviewsCount} تقييم</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-[#C8DDD9] pt-3 flex items-center justify-between">
                            <div className="text-[10px] text-[#7A9490] flex items-center gap-1">
                                <Calendar size={12} />
                                أقرب موعد متاح: <strong className="text-[#2E7D6B]">غداً 10:00 ص</strong>
                            </div>
                            <Button size="sm" className="h-7 text-xs px-3 py-0" onClick={() => setSelectedDoctor(doc)}>حجز موعد</Button>
                        </div>
                    </Card>
                )) : (
                    <div className="border border-dashed border-[#C8DDD9] rounded-2xl p-8 text-center">
                        <p className="text-[#7A9490] text-sm">لا توجد نتائج مطابقة للبحث</p>
                    </div>
                )}
            </div>
        </div>
    );
}
