import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full">
                {label && <label className="block text-sm font-bold text-[#4A6360]">{label}</label>}
                <div className="relative">
                    {icon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9490]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full rounded-xl border border-[#C8DDD9] bg-white px-4 py-2 text-sm text-[#1C2B2A] transition-colors focus:border-[#2E7D6B] focus:outline-none focus:ring-1 focus:ring-[#2E7D6B]",
                            icon && "pr-10",
                            error && "border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-[#C0392B]">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';
