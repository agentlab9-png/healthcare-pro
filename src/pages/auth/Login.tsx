import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button, Card, Input } from '../../components/ui';
import { useState } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { API_URL } from '../../config';

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const { notify } = useNotificationStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                login(data);
                notify('تم تسجيل الدخول بنجاح', 'success');
                navigate(`/${data.user.role}`);
            } else {
                notify(data.error || 'فشل تسجيل الدخول', 'error');
            }
        } catch {
            notify('خطأ في الاتصال بالخادم', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#EEF4FB] to-[#EFF6F4]">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#2E7D6B] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl font-bold">H</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#1C2B2A] mb-2">HealthCare Pro</h1>
                    <p className="text-[#7A9490]">تسجيل الدخول إلى حسابك</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <Input
                            label="البريد الإلكتروني"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@healthcare.com"
                            required
                        />
                    </div>
                    <div>
                        <Input
                            label="كلمة المرور"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#2E7D6B] text-white hover:bg-[#246355]"
                        loading={loading}
                    >
                        تسجيل الدخول
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#E8F0EE] text-center">
                    <p className="text-sm text-[#7A9490]">
                        بيانات تجريبية: <br />
                        admin@healthcare.com / password123
                    </p>
                </div>
            </Card>
        </div>
    );
}
