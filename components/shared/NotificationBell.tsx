

import React, { useState, useEffect, useRef } from 'react';
import { Notification, User } from '../../types';
import { AcademicCapIcon, CalendarDaysIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon } from '../icons/Icons';

interface NotificationBellProps {
    currentUser: User;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    setCurrentPage: (page: string) => void;
}

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    switch (type) {
        case 'course':
        case 'certificate':
            return <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-full"><AcademicCapIcon className="w-5 h-5 text-indigo-500" /></div>;
        case 'session':
            return <div className="w-8 h-8 flex items-center justify-center bg-teal-100 rounded-full"><CalendarDaysIcon className="w-5 h-5 text-teal-500" /></div>;
        case 'announcement':
            return <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full"><ChatBubbleLeftRightIcon className="w-5 h-5 text-amber-500" /></div>;
        case 'system':
        default:
            return <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full"><Cog6ToothIcon className="w-5 h-5 text-slate-500" /></div>;
    }
};


export const NotificationBell: React.FC<NotificationBellProps> = ({ currentUser, notifications, setNotifications, setCurrentPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    
    const userNotifications = notifications.filter(n => n.recipientId === currentUser.id).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
    const unreadCount = userNotifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) { // When opening and there are unread notifications
            setTimeout(() => {
                setNotifications(
                    notifications.map(n => n.recipientId === currentUser.id ? { ...n, read: true } : n)
                );
            }, 2000); // Mark as read after a delay
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (notification.link) {
            setCurrentPage(notification.link);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button onClick={handleToggle} className="relative p-1 rounded-full text-white hover:bg-white/20">
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in origin-top-right">
                    <div className="p-3 border-b">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {userNotifications.length > 0 ? (
                            userNotifications.map(n => (
                                <button
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    disabled={!n.link}
                                    className={`w-full text-left p-3 border-b last:border-b-0 transition-colors ${!n.link ? 'cursor-default' : 'hover:bg-slate-50'} ${!n.read ? 'bg-indigo-50' : ''}`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <NotificationIcon type={n.type} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-700">{n.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 p-4 text-center">No new notifications.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};