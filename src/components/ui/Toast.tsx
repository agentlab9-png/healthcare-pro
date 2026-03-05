import { CheckCircle2, AlertCircle, X, Info, AlertTriangle } from 'lucide-react';
import { useNotificationStore, type NotificationType } from '../../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';

const icons: Record<NotificationType, React.ReactNode> = {
    success: <CheckCircle2 className="text-[#2E7D6B]" size={18} />,
    error: <AlertCircle className="text-[#C0392B]" size={18} />,
    info: <Info className="text-[#3A7DBF]" size={18} />,
    warning: <AlertTriangle className="text-[#D4820A]" size={18} />,
};

const bgColors: Record<NotificationType, string> = {
    success: 'bg-[#EFF6F4] border-[#d1e7e0]',
    error: 'bg-[#FDEAE8] border-[#f5b7b1]',
    info: 'bg-[#EEF4FB] border-[#bdccdc]',
    warning: 'bg-[#FEF6E8] border-[#faebce]',
};

export const ToastContainer = () => {
    const { notifications, dismiss } = useNotificationStore();

    return (
        <div className="fixed top-4 left-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none items-center">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-sm w-full backdrop-blur-md ${bgColors[n.type]}`}
                    >
                        <div className="flex-shrink-0">{icons[n.type]}</div>
                        <p className="text-xs font-bold text-[#1C2B2A] flex-1">{n.message}</p>
                        <button
                            onClick={() => dismiss(n.id)}
                            className="text-[#7A9490] hover:text-[#1C2B2A] transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
