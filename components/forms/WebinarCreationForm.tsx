import React, { useState } from 'react';
import { User, UserRole, NewLiveSession } from '../../types';

interface LiveSessionCreationFormProps {
    currentUser: User;
    instructors: User[];
    onSubmit: (sessionData: NewLiveSession) => void;
    onCancel: () => void;
}

export const WebinarCreationForm: React.FC<LiveSessionCreationFormProps> = ({ currentUser, instructors, onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [instructorId, setInstructorId] = useState(currentUser.role === UserRole.Instructor ? currentUser.id : '');
    const [price, setPrice] = useState<number | string>('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !dateTime || !instructorId) {
            alert('Please fill out all fields.');
            return;
        }
        onSubmit({ title, description, dateTime, instructorId, price: Number(price) || undefined });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="webinar-title" className="block mb-2 text-sm font-medium text-slate-700">Live Session Title</label>
                <input 
                    id="webinar-title" 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full p-2 border rounded-md" 
                    required 
                />
            </div>
             <div>
                <label htmlFor="webinar-description" className="block mb-2 text-sm font-medium text-slate-700">Description</label>
                <textarea 
                    id="webinar-description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={3} 
                    className="w-full p-2 border rounded-md" 
                    required 
                />
            </div>
             <div>
                <label htmlFor="webinar-datetime" className="block mb-2 text-sm font-medium text-slate-700">Date and Time</label>
                <input 
                    id="webinar-datetime"
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full p-2 border rounded-md" 
                    required
                />
            </div>
             <div>
                <label htmlFor="webinar-price" className="block mb-2 text-sm font-medium text-slate-700">Price ($) - leave empty for free</label>
                <input
                    id="webinar-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., 19.99"
                    step="0.01"
                    min="0"
                />
            </div>
            {currentUser.role === UserRole.Admin && (
                <div>
                    <label htmlFor="instructor-select" className="block mb-2 text-sm font-medium text-slate-700">Instructor</label>
                    <select 
                        id="instructor-select" 
                        value={instructorId} 
                        onChange={e => setInstructorId(e.target.value)} 
                        required 
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="" disabled>Select an instructor</option>
                        {instructors.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                    </select>
                </div>
            )}
            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg">Schedule Session</button>
            </div>
        </form>
    );
};