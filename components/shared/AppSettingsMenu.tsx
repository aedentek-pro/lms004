import React, { useRef, useEffect } from 'react';

interface AppSettingsMenuProps {
    onPositionChange: (position: string) => void;
    currentPosition: string;
    onClose: () => void;
}

export const AppSettingsMenu: React.FC<AppSettingsMenuProps> = ({ onPositionChange, currentPosition, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    const positions = {
        'Bottom Right': 'bottom-6 right-6',
        'Bottom Left': 'bottom-6 left-6',
        'Top Right': 'top-6 right-6',
        'Top Left': 'top-6 left-6',
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div ref={menuRef} className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-fade-in origin-top-right">
            <div className="p-3 border-b">
                <h3 className="font-semibold text-sm text-slate-800">App Settings</h3>
            </div>
            <div className="p-2">
                <p className="text-xs text-slate-500 px-2 mb-1">WhatsApp Button Position</p>
                {Object.entries(positions).map(([name, className]) => (
                     <button 
                        key={name}
                        onClick={() => onPositionChange(className)}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-md ${currentPosition === className ? 'bg-indigo-100 text-indigo-800' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>
    );
};