import React from 'react';
import { Modal } from './Modal';
import { LiveSession, User } from '../../types';
import { UserCircleIcon } from '../icons/Icons';

interface WebinarAttendeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: LiveSession | null;
    users: User[];
}

export const WebinarAttendeesModal: React.FC<WebinarAttendeesModalProps> = ({ isOpen, onClose, session, users }) => {
    if (!isOpen || !session) return null;

    const attendees = users.filter(user => session.attendeeIds.includes(user.id));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Attendees for "${session.title}"`} size="md">
            <div className="max-h-[60vh] overflow-y-auto">
                {attendees.length > 0 ? (
                    <ul className="divide-y divide-slate-200">
                        {attendees.map(attendee => (
                            <li key={attendee.id} className="py-3 flex items-center space-x-4">
                                <UserCircleIcon className="w-8 h-8 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{attendee.name}</p>
                                    <p className="text-xs text-slate-500">{attendee.email}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-slate-500">No one has registered for this session yet.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
