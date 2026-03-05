import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Package, FileText, Settings, LogOut, Search, Bell } from 'lucide-react';
import { useAuthStore } from '../../store';

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore();

    const navItems = [
        { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/admin' },
        { icon: Package, label: 'صيدلية ومخزون', path: '/admin/pharmacy' },
        { icon: UserPlus, label: 'الأطباء', path: '/admin/doctors' },
        { icon: Users, label: 'المرضى', path: '/admin/patients' },
        { icon: FileText, label: 'التقارير', path: '/admin/reports' },
        { icon: Settings, label: 'الإعدادات', path: '/admin/settings' },
    ];

    return (
        <div className="flex h-screen bg-[#F3EFF9]">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-l border-[#C8DDD9]">
                <div className="p-6 border-b border-[#C8DDD9]">
                    <h1 className="text-2xl font-black text-[#2E7D6B]">SOP<span className="text-[#3A7DBF]">Pro</span></h1>
                    <p className="text-xs text-[#7B5EA7] mt-1 font-bold">بوابة الإدارة</p>
                </div>

                <div className="p-4 flex items-center gap-3 border-b border-[#C8DDD9] bg-[#F3EFF9]/50">
                    <div className="w-10 h-10 rounded-xl bg-[#7B5EA7] text-white flex items-center justify-center font-bold">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1C2B2A]">{user?.name || 'مدير النظام'}</p>
                        <p className="text-xs text-[#4A6360]">صلاحيات كاملة</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all
                ${isActive ? 'bg-[#7B5EA7] text-white shadow-md' : 'text-[#4A6360] hover:bg-[#F3EFF9] hover:text-[#7B5EA7]'}
              `}
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
                {/* Header */}
                <header className="bg-white border-b border-[#C8DDD9] p-4 flex justify-between items-center z-10">
                    <div className="md:hidden">
                        <h1 className="text-xl font-black text-[#2E7D6B] mb-0">SOP<span className="text-[#3A7DBF]">Pro</span></h1>
                    </div>
                    <div className="hidden md:block">
                        {/* Desktop header content */}
                        <h2 className="text-xl font-bold text-[#1C2B2A]">نظام الإدارة الشامل</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-[#F3EFF9] flex items-center justify-center text-[#7B5EA7] hover:bg-[#E2D4F0] transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#D4820A] rounded-full border-2 border-white"></span>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-[#F8FAF9] flex items-center justify-center text-[#4A6360] hover:bg-[#EEF4FB] hover:text-[#3A7DBF] transition-colors md:hidden">
                            <Search size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#C8DDD9] px-6 py-2 pb-safe z-50">
                <div className="flex justify-between items-center">
                    {navItems.slice(0, 4).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) => `
                flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                ${isActive ? 'text-[#7B5EA7]' : 'text-[#7A9490]'}
              `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#F3EFF9]' : 'bg-transparent'}`}>
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
