import React from 'react';
import { Course, User } from '../../types';
import { AcademicCapIcon } from '../icons/Icons';

interface CertificateViewProps {
    course: Course;
    student: User;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ course, student }) => {
    return (
        <div className="p-8 border-4 border-indigo-500 bg-white text-center aspect-[4/3] flex flex-col justify-center items-center">
            <AcademicCapIcon className="w-20 h-20 text-indigo-500 mb-4" />
            <p className="text-xl text-slate-500">Certificate of Completion</p>
            <p className="text-sm text-slate-500 mb-8">This certifies that</p>
            <h1 className="text-4xl font-bold text-slate-800">{student.name}</h1>
            <p className="text-sm text-slate-500 my-8">has successfully completed the course</p>
            <h2 className="text-3xl font-semibold text-indigo-700">{course.title}</h2>
            <p className="mt-12 text-xs text-slate-400">Issued on {new Date().toLocaleDateString()}</p>
        </div>
    );
};