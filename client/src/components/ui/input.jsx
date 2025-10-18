import React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, icon: Icon, error, ...props }, ref) => {
    return (
        <div className="relative group">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Icon className="h-4 w-4" />
                </div>
            )}
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-input bg-card/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                    Icon && "pl-10",
                    error && "border-destructive focus-visible:ring-destructive",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export { Input };
