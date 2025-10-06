import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';

interface UserEditFormProps {
    user: User | null;
    onSubmit: (userData: {name: string, role: UserRole, id?: string}) => void;
    onCancel: () => void;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ user, onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Student);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setRole(user.role);
        } else {
            setName('');
            setRole(UserRole.Student);
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            alert('Please enter a name.');
            return;
        }
        onSubmit({ id: user?.id, name, role });
    };
    
    const isEditMode = !!user;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-700">Full Name</label>
                <input 
                    type="text" 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    placeholder="e.g. John Smith"
                    required
                  />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">Role</label>
                <div className="flex space-x-2 rounded-lg bg-slate-100 p-1">
                    {Object.values(UserRole).map(r => (
                        <button
                            type="button"
                            key={r}
                            onClick={() => setRole(r as UserRole)}
                            className={`w-full text-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                                role === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg">{isEditMode ? 'Update User' : 'Create User'}</button>
            </div>
        </form>
    );
};
