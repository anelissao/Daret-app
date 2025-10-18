import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, isLoading, disabled, ...props }, ref) => {
    const variants = {
        primary: 'bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25 border border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/5',
        outline: 'bg-transparent border border-input hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground border-transparent',
        link: 'text-primary underline-offset-4 hover:underline border-transparent shadow-none',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-xl'
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-12 rounded-lg px-8 text-lg',
        icon: 'h-10 w-10',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
