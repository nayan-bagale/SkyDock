import { Cloud } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CloudProps {
    size?: number;
    position?: { top: string; left: string };
    delay?: number;
    duration?: number;
    opacity?: number;
}

const CloudComponent: React.FC<CloudProps> = ({
    size = 40,
    position = { top: '20%', left: '20%' },
    delay = 0,
    duration = 20,
    opacity = 0.7,
}) => {
    const [pos, setPos] = useState(position);

    useEffect(() => {
        const animation = setTimeout(() => {
            setPos({
                top: position.top,
                left: '110%',
            });
        }, delay * 1000);

        return () => clearTimeout(animation);
    }, [delay, position.top]);

    return (
        <div
            className="absolute transition-all ease-linear"
            style={{
                top: pos.top,
                left: pos.left,
                opacity,
                transitionDuration: `${duration}s`,
                transitionDelay: `${delay}s`,
            }}
        >
            <Cloud size={size} className="text-white/60" />
        </div>
    );
};

const CloudAnimation: React.FC = () => {
    const clouds = [
        { size: 64, position: { top: '10%', left: '-10%' }, delay: 0, duration: 25, opacity: 0.3 },
        { size: 48, position: { top: '35%', left: '-10%' }, delay: 5, duration: 30, opacity: 0.5 },
        { size: 32, position: { top: '65%', left: '-10%' }, delay: 2, duration: 22, opacity: 0.4 },
        { size: 56, position: { top: '80%', left: '-10%' }, delay: 8, duration: 28, opacity: 0.3 },
        { size: 40, position: { top: '25%', left: '-10%' }, delay: 12, duration: 26, opacity: 0.6 },
        { size: 72, position: { top: '50%', left: '-10%' }, delay: 15, duration: 32, opacity: 0.2 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {clouds.map((cloud, index) => (
                <CloudComponent
                    key={index}
                    size={cloud.size}
                    position={cloud.position}
                    delay={cloud.delay}
                    duration={cloud.duration}
                    opacity={cloud.opacity}
                />
            ))}
        </div>
    );
};

export default CloudAnimation;