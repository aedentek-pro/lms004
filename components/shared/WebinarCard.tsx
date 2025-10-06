
import React from 'react';
import { LiveSession, User, UserRole } from '../../types';
import { Card } from './Card';
import { VideoCameraIcon, UserGroupIcon, WhatsAppIcon } from '../icons/Icons';

interface LiveSessionCardProps {
    session: LiveSession;
    instructor: User | undefined;
    onJoin: (session: LiveSession) => void;
    onRegister: (session: LiveSession) => void;
    onViewAttendees?: (session: LiveSession) => void;
    onViewRecording?: (session: LiveSession) => void;
    onShare?: (session: LiveSession) => void;
    isRegistered: boolean;
    currentUserRole: UserRole;
}

export const WebinarCard: React.FC<LiveSessionCardProps> = ({ session, instructor, onJoin, onRegister, onViewAttendees, onViewRecording, onShare, isRegistered, currentUserRole }) => {
    const isPaid = session.price && session.price > 0;
    const canManage = currentUserRole === UserRole.Admin || currentUserRole === UserRole.Instructor;
    
    const sessionEndTime = new Date(new Date(session.dateTime).getTime() + 60 * 60 * 1000); // Assume 1 hour duration
    const isPast = new Date() > sessionEndTime;
    const canJoin = new Date() >= new Date(new Date(session.dateTime).getTime() - 15 * 60 * 1000) && !isPast;


    const renderPriceBadge = () => {
        const text = isPaid ? `$${session.price!.toFixed(2)}` : 'Free';
        const colorClasses = isPaid 
            ? 'bg-indigo-100 text-indigo-800 border-indigo-200' 
            : 'bg-green-100 text-green-800 border-green-200';

        return (
            <div className={`absolute top-4 right-4 px-3 py-1 text-sm font-bold rounded-full border ${colorClasses}`}>
                {text}
            </div>
        );
    };
    
    const renderActionButtons = () => {
        if (isPast && session.recordingUrl && (isRegistered || canManage) && onViewRecording) {
            return (
                <button
                    onClick={() => onViewRecording(session)}
                    className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                    <VideoCameraIcon className="w-4 h-4 mr-2"/>
                    View Recording
                </button>
            );
        }

        if (isRegistered) {
            if (canJoin) {
                return (
                     <button
                        onClick={() => onJoin(session)}
                        className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <VideoCameraIcon className="w-4 h-4 mr-2"/>
                        Join Session
                    </button>
                );
            }
             return (
                 <button
                    disabled
                    className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-400 rounded-md cursor-not-allowed"
                >
                    Registered
                </button>
            );
        }

        if (isPast) {
             return <p className="text-sm text-slate-500 font-medium">Session Ended</p>;
        }
        
        return (
            <button
                onClick={() => onRegister(session)}
                className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
                {isPaid ? `Register for $${session.price!.toFixed(2)}` : 'Register for Free'}
            </button>
        );
    }

    return (
        <Card className="flex flex-col justify-between h-full">
            <div className="p-5 flex-grow relative">
                {renderPriceBadge()}
                <h3 className="text-xl font-bold text-slate-800 mb-2 pr-20">{session.title}</h3>
                <p className="text-slate-600 text-sm mb-4 flex-grow">{session.description}</p>
                <p className="text-sm text-slate-500">
                    Host: <span className="font-medium text-indigo-600">{instructor?.name || 'Unknown'}</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">
                    Date: <span className="font-medium text-slate-700">{session.dateTime.toLocaleString()}</span>
                </p>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {!isPast && onShare && (
                        <button 
                            onClick={() => onShare(session)}
                            className="flex items-center justify-center p-2 text-sm font-semibold text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                            title="Share on WhatsApp"
                        >
                            <WhatsAppIcon className="w-5 h-5"/>
                        </button>
                    )}
                     {canManage && onViewAttendees && (
                        <button 
                            onClick={() => onViewAttendees(session)}
                            className="flex items-center justify-center p-2 text-sm font-semibold text-slate-600 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
                            title="View Attendees"
                        >
                            <UserGroupIcon className="w-5 h-5"/>
                        </button>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    {renderActionButtons()}
                </div>
            </div>
        </Card>
    );
};
