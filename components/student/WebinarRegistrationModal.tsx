import React from 'react';
import { Modal } from '../shared/Modal';
import { LiveSession } from '../../types';

interface WebinarRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    session: LiveSession | null;
}

export const WebinarRegistrationModal: React.FC<WebinarRegistrationModalProps> = ({ isOpen, onClose, onSubmit, session }) => {
    if (!isOpen || !session) return null;

    const isPaid = session.price && session.price > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Registration" size="lg">
            <div className="space-y-4">
                <p className="text-slate-600">You are about to register for the following live session:</p>
                <div className="p-4 bg-slate-50 border rounded-lg">
                    <h3 className="font-bold text-lg text-slate-800">{session.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{session.dateTime.toLocaleString()}</p>
                </div>
                {isPaid && (
                    <div className="text-center">
                        <p className="text-slate-600">The cost for this session is:</p>
                        <p className="text-3xl font-bold text-indigo-600">${session.price.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 mt-2">(This is a simulated payment for demonstration purposes)</p>
                    </div>
                )}
                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                    <button 
                        type="button" 
                        onClick={onSubmit} 
                        className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg"
                    >
                        {isPaid ? 'Pay & Register' : 'Confirm Registration'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
