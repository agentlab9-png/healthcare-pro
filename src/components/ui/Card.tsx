import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-[#C8DDD9] bg-white shadow-sm transition-shadow hover:shadow-md",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
