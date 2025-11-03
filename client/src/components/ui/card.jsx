import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Card = React.forwardRef(({ className, glass = true, hover = false, whileHover, ...props }, ref) => {
    const Component = hover ? motion.div : 'div';

    return (
        <Component
            ref={ref}
            className={cn(
                "rounded-xl border bg-card text-card-foreground shadow-sm",
                glass && "glass-card",
                hover && "hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300",
                className
            )}
            {...(hover ? { whileHover: whileHover ?? { y: -5 } } : {})}
            {...props}
        />
    );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight gradient-text", className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
