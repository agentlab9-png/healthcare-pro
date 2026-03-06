import { useState } from 'react';
import { Search, Filter, ShoppingCart, Upload, Info, X, Trash2 } from 'lucide-react';
import { Card, Input, Button, Modal } from '../../components/ui';
import { useDataStore } from '../../store/dataStore';
import { useNotificationStore } from '../../store/notificationStore';
import { type Medication } from '../../types';
import { notifyPharmacyOrder } from '../../lib/telegram';
import { useAuthStore } from '../../store/authStore';

interface CartItem { med: Medication; count: number; }

const CATEGORIES = ['الكل', 'مسكنات', 'مضادات', 'فيتامينات', 'عناية بالبشرة', 'معدات طبية'];

export default function PharmacyPage() {
    const { medications } = useDataStore();
    const { user } = useAuthStore();
    const { notify } = useNotificationStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('الكل');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);

    const cartCount = cart.reduce((sum, i) => sum + i.count, 0);
    const cartTotal = cart.reduce((sum, i) => sum + (i.med.price || 0) * i.count, 0);

    const filtered = medications.filter((med: Medication) => {
        const matchesSearch = searchQuery.trim() === '' ||
            med.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'الكل' ||
            med.instructions.toLowerCase().includes(activeCategory.toLowerCase()) ||
            med.name.toLowerCase().includes(activeCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    const addToCart = (med: Medication) => {
        setCart(prev => {
            const existing = prev.find(i => i.med.id === med.id);
            if (existing) return prev.map(i => i.med.id === med.id ? { ...i, count: i.count + 1 } : i);
            return [...prev, { med, count: 1 }];
        });
        notify(`تمت إضافة ${med.name} للعربة`, 'success');
    };

    const removeFromCart = (medId: string) => {
        setCart(prev => prev.filter(i => i.med.id !== medId));
    };

    const handleOrder = () => {
        notifyPharmacyOrder({
            patientName: user?.name || '',
            items: cart.map(i => ({ name: i.med.name, count: i.count, price: i.med.price || 0 })),
            total: cartTotal,
        });
        notify('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً', 'success');
        setCart([]);
        setShowCart(false);
    };

    return (
        <div className="space-y-6 pb-6 w-full relative">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-[#1C2B2A]">الصيدلية</h2>
                <button
                    onClick={() => setShowCart(true)}
                    className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#C8DDD9] text-[#2E7D6B]"
                >
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C0392B] text-white text-[10px] font-bold flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Upload Prescription */}
            <Card className="p-4 bg-gradient-to-r from-[#2E7D6B] to-[#4A9E8A] text-white border-none flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-base mb-1">لديك وصفة طبية؟</h3>
                    <p className="text-xs text-[#C8DDD9]">ارفع الوصفة وسنقوم بتجهيزها لك فحصاً وتوصيلاً.</p>
                </div>
                <label className="h-10 px-4 bg-white text-[#2E7D6B] rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer hover:bg-[#F8FAF9] transition-colors">
                    <Upload size={16} /> رفع
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                notify(`تم رفع الوصفة "${file.name}" بنجاح. سيتم مراجعتها وتجهيز الطلب`, 'success');
                            }
                            e.target.value = '';
                        }}
                    />
                </label>
            </Card>

            {/* Search */}
            <div className="flex gap-2">
                <Input
                    placeholder="ابحث عن دواء..."
                    icon={<Search size={20} />}
                    className="flex-1 bg-white border-[#C8DDD9]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="secondary" className="w-12 px-0 bg-white border border-[#C8DDD9]">
                    <Filter size={20} className="text-[#2E7D6B]" />
                </Button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${activeCategory === cat ? 'bg-[#2E7D6B] text-white border-[#2E7D6B]' : 'bg-white text-[#4A6360] border-[#C8DDD9] hover:border-[#4A9E8A]'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Medicine Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {filtered.map((med: Medication) => {
                        const hasStock = (med.stock || 0) > 0;
                        const inCart = cart.find(i => i.med.id === med.id)?.count || 0;
                        return (
                            <Card key={med.id} className="p-3 flex flex-col justify-between group hover:border-[#4A9E8A] transition-all relative overflow-hidden">
                                {med.requiresPrescription && (
                                    <span className="absolute top-2 right-2 bg-[#FEF6E8] text-[#D4820A] px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5 z-10">
                                        <Info size={10} /> وصفة طبية
                                    </span>
                                )}
                                {inCart > 0 && (
                                    <span className="absolute top-2 left-2 bg-[#2E7D6B] text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center z-10">
                                        {inCart}
                                    </span>
                                )}
                                <div className="aspect-square bg-[#F8FAF9] rounded-xl mb-3 flex items-center justify-center p-4">
                                    <img src="/vite.svg" alt={med.name} className="w-12 h-12 opacity-50 grayscale" />
                                </div>
                                <h4 className="font-bold text-[#1C2B2A] text-xs leading-tight mb-1">{med.name}</h4>
                                <p className="text-[10px] text-[#7A9490] line-clamp-2 mb-2">{med.instructions}</p>
                                <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#C8DDD9]">
                                    <span className="font-bold text-[#2E7D6B] text-sm">{med.price} ر.س</span>
                                    {hasStock ? (
                                        <button
                                            onClick={() => addToCart(med)}
                                            className="w-7 h-7 bg-[#EEF4FB] text-[#3A7DBF] rounded-lg flex items-center justify-center hover:bg-[#3A7DBF] hover:text-white transition-colors"
                                        >
                                            <ShoppingCart size={14} />
                                        </button>
                                    ) : (
                                        <span className="text-[9px] text-[#C0392B] font-bold bg-[#FDEAE8] px-1.5 py-0.5 rounded">غير متوفر</span>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="border border-dashed border-[#C8DDD9] rounded-2xl p-8 text-center">
                    <p className="text-[#7A9490] text-sm">لا توجد نتائج مطابقة</p>
                </div>
            )}

            {/* Cart Modal */}
            <Modal isOpen={showCart} onClose={() => setShowCart(false)} title="عربة التسوق">
                <div className="space-y-4">
                    {cart.length === 0 ? (
                        <p className="text-center text-[#7A9490] py-6 text-sm">العربة فارغة</p>
                    ) : (
                        <>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.med.id} className="flex items-center justify-between p-3 bg-[#F8FAF9] rounded-xl border border-[#C8DDD9]">
                                        <div>
                                            <h4 className="font-bold text-sm text-[#1C2B2A]">{item.med.name}</h4>
                                            <p className="text-xs text-[#7A9490]">{item.count} × {item.med.price} ر.س</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[#2E7D6B] text-sm">{(item.med.price || 0) * item.count} ر.س</span>
                                            <button onClick={() => removeFromCart(item.med.id)} className="text-[#C0392B] hover:bg-[#FDEAE8] p-1 rounded">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#EFF6F4] rounded-xl font-bold">
                                <span className="text-[#4A6360]">الإجمالي</span>
                                <span className="text-[#2E7D6B] text-lg">{cartTotal} ر.س</span>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => { setCart([]); }}>
                                    <X size={16} /> مسح الكل
                                </Button>
                                <Button className="flex-1" onClick={handleOrder}>
                                    تأكيد الطلب
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}
