import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

type MotionButtonProps = ButtonProps & HTMLMotionProps<"button">;

export const Button = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading = false, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed",
                    {
                        "bg-[#2E7D6B] text-white hover:bg-[#1A5C4F] focus:ring-[#2E7D6B]": variant === 'primary',
                        "bg-[#EEF4FB] text-[#3A7DBF] hover:bg-[#C5E1F7] focus:ring-[#3A7DBF]": variant === 'secondary',
                        "border-2 border-[#C8DDD9] text-[#1C2B2A] hover:border-[#2E7D6B] focus:ring-[#2E7D6B] bg-transparent": variant === 'outline',
                        "bg-transparent text-[#4A6360] hover:bg-[#F8FAF9] focus:ring-[#2E7D6B]": variant === 'ghost',
                        "bg-[#C0392B] text-white hover:bg-[#a93226] focus:ring-[#C0392B]": variant === 'danger',
                        "h-8 px-3 text-xs": size === 'sm',
                        "h-10 px-4 text-sm": size === 'md',
                        "h-12 px-6 text-base": size === 'lg',
                    },
                    className
                )}
                disabled={loading || props.disabled}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = 'Button';
