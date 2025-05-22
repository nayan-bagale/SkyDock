import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 120, className = '' }) => {
    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <img
                src="/skydock-logo-resized.png"
                alt="SkyDock Logo"
                className="w-full h-full object-contain"
            />
        </div>
    );
};

export default Logo;