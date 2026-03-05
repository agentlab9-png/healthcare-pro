import { NavLink } from 'react-router-dom';
import { Home, Calendar, Pill, FileText, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function PatientLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore();

    const navItems = [
        { icon: Home, label: 'الرئيسية', path: '/patient' },
        { icon: Calendar, label: 'المواعيد', path: '/patient/appointments' },
        { icon: Pill, label: 'الأدوية', path: '/patient/schedule' },
        { icon: FileText, label: 'السجلات', path: '/patient/records' },
        { icon: UserCircle, label: 'حسابي', path: '/patient/profile' },
    ];

    return (
        <div className="flex flex-col h-screen bg-[#EEF4FB] overflow-hidden">
            {/* Header (Desktop) */}
            <header className="hidden md:flex bg-white border-b border-[#C8DDD9] p-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2E7D6B] flex items-center justify-center text-white font-bold">
                        H
                    </div>
                    <h1 className="text-xl font-bold text-[#1C2B2A]">HealthCare Pro</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#4A6360]">{user?.name}</span>
                    <button onClick={logout} className="text-xs text-[#C0392B] underline">خروج</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth p-4 pb-24 md:pb-4">
                {children}
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#C8DDD9] px-2 py-2 flex justify-around items-center md:hidden z-50">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/patient'}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#2E7D6B] text-white shadow-lg' : 'text-[#7A9490]'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? 'scale-110 mb-0.5' : 'mb-0.5'} />
                                <span className="text-[10px] font-black">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
