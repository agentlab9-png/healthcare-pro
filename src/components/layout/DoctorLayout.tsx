import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '../../store';

export function DoctorLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore();

    const navItems = [
        { icon: LayoutDashboard, label: 'الرئيسية', path: '/doctor' },
        { icon: CalendarDays, label: 'مواعيدي', path: '/doctor/appointments' },
        { icon: Users, label: 'المرضى', path: '/doctor/patients' },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAF9]">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-l border-[#C8DDD9]">
                <div className="p-6 border-b border-[#C8DDD9]">
                    <h1 className="text-2xl font-black text-[#2E7D6B]">Health<span className="text-[#3A7DBF]">Pro</span></h1>
                    <p className="text-xs text-[#7A9490] mt-1 font-bold">بوابة الطبيب</p>
                </div>

                <div className="p-4 flex items-center gap-3 border-b border-[#C8DDD9] bg-[#EEF4FB]/50">
                    <div className="w-10 h-10 rounded-xl bg-[#3A7DBF] text-white flex items-center justify-center font-bold">
                        {user?.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1C2B2A]">{user?.name || 'د. طبيب'}</p>
                        <p className="text-xs text-[#4A6360]">استشاري</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/doctor'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-[#3A7DBF] text-white shadow-md' : 'text-[#4A6360] hover:bg-[#EEF4FB] hover:text-[#3A7DBF]'}`
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#C8DDD9]">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[#C0392B] hover:bg-[#FDEAE8] rounded-xl font-bold transition-colors"
                    >
                        <LogOut size={20} />
                        تسجيل الخروج
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-[#C8DDD9] p-4 flex justify-between items-center z-10">
                    <div className="md:hidden">
                        <h1 className="text-xl font-black text-[#2E7D6B]">Health<span className="text-[#3A7DBF]">Pro</span></h1>
                    </div>
                    <div className="hidden md:block">
                        <h2 className="text-xl font-bold text-[#1C2B2A]">لوحة تحكم الطبيب</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-[#F8FAF9] flex items-center justify-center text-[#4A6360] hover:bg-[#EEF4FB] hover:text-[#3A7DBF] transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#C0392B] rounded-full border-2 border-white"></span>
                        </button>
                        <button onClick={logout} className="md:hidden text-xs text-[#C0392B] font-bold">
                            خروج
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#C8DDD9] px-6 py-2 z-50">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/doctor'}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-[#3A7DBF]' : 'text-[#7A9490]'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#EEF4FB]' : ''}`}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}
