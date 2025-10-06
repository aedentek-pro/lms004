import React from 'react';
import { User } from '../../types';
import { Card } from './Card';
import { AcademicCapIcon, EnvelopeIcon } from '../icons/Icons';

interface InstructorProfileCardProps {
    instructor: User;
    onContactInstructor?: () => void;
}

export const InstructorProfileCard: React.FC<InstructorProfileCardProps> = ({ instructor, onContactInstructor }) => {
    return (
        <Card>
            <div className="p-5 flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                    <AcademicCapIcon className="w-8 h-8 text-indigo-600"/>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-slate-800">{instructor.name}</h4>
                    <p className="text-sm text-slate-500">{instructor.role}</p>
                </div>
            </div>
            <div className="px-5 pb-5">
                <p className="text-sm text-slate-600">
                    Your expert guide through the complexities of the stock market. With over 10 years of trading experience, {instructor.name.split(' ')[0]} is dedicated to helping you succeed.
                </p>
                {onContactInstructor && (
                    <button 
                        onClick={onContactInstructor}
                        className="w-full mt-4 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
                    >
                        <EnvelopeIcon className="w-5 h-5 mr-2" />
                        Contact Instructor
                    </button>
                )}
            </div>
        </Card>
    );
};