import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ReliabilityGauge = ({ score }) => {
    const [currentScore, setCurrentScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setCurrentScore(score), 500);
        return () => clearTimeout(timer);
    }, [score]);

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (currentScore / 100) * circumference;

    let color = 'text-emerald-500';
    if (score < 50) color = 'text-red-500';
    if (score >= 50 && score < 80) color = 'text-yellow-500';

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-white/10"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-bold ${color}`}>{currentScore}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Reliability</span>
            </div>
        </div>
    );
};

export default ReliabilityGauge;
