import React, { useRef, useEffect } from 'react';
import { User } from '../../types';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '../icons/Icons';

interface UserProfileMenuProps {
    user: User;
    onLogout: () => void;
    onClose: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ user, onLogout, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

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
        <div ref={menuRef} className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in origin-top-right">
            <div className="p-3 border-b flex items-center space-x-3">
                <UserCircleIcon className="w-10 h-10 text-gray-400"/>
                <div>
                    <p className="font-semibold text-sm text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                </div>
            </div>
            <div className="p-2">
                 <button 
                    onClick={onLogout}
                    className={`w-full flex items-center text-left text-sm px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100`}
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2"/>
                    Logout
                </button>
            </div>
        </div>
    );
};
