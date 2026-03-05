import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-[#1C2B2A]/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className={cn("bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden pointer-events-auto", className)}>
                            {title && (
                                <div className="flex items-center justify-between p-4 border-b border-[#C8DDD9]">
                                    <h3 className="text-lg font-bold text-[#1C2B2A]">{title}</h3>
                                    <button onClick={onClose} className="text-[#7A9490] hover:text-[#1C2B2A] transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                            <div className="p-4">{children}</div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
