

import React from 'react';
import { Course, User, StudentProgress, UserRole } from '../../types';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { AcademicCapIcon } from '../icons/Icons';
import { StarRating } from './StarRating';

interface CourseCardProps {
  course: Course;
  instructor: User | undefined;
  progress?: StudentProgress;
  onClick: (course: Course) => void;
  onDelete?: (courseId: string) => void; // For instructor/admin
  onEdit?: (course: Course) => void; // For instructor/admin
  onManageStudents?: (course: Course) => void; // For instructor/admin
  userRole?: UserRole; // To conditionally render buttons
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, instructor, progress, onClick, onDelete, onEdit, onManageStudents, userRole }) => {
  const progressPercent = progress && course.modules.length > 0 ? (progress.completedModules.length / course.modules.length) * 100 : 0;
  const isEnrolled = progress !== undefined;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(course);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(course.id);
  };
  
  const handleManage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onManageStudents) onManageStudents(course);
  };

  return (
    <Card className="flex flex-col h-full" onClick={() => onClick(course)}>
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
            <AcademicCapIcon className="h-16 w-16 text-white opacity-50"/>
        </div>
        <div className="absolute top-2 right-2 flex items-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
           <StarRating rating={course.rating || 0} readOnly />
           <span className="ml-1 text-slate-600">({course.totalRatings || 0})</span>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 hover:text-violet-700">{course.title}</h3>
        <p className="text-sm text-slate-500 mt-1">By {instructor?.name || 'Unknown'}</p>
        <p className="text-sm text-slate-600 mt-2 flex-grow">{course.description}</p>
        {isEnrolled && userRole === UserRole.Student && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-600">Progress</span>
              <span className="text-xs font-bold text-violet-600">{Math.round(progressPercent)}%</span>
            </div>
            <ProgressBar progress={progressPercent} />
          </div>
        )}
         {!isEnrolled && userRole === UserRole.Student && course.price != null && course.price > 0 && (
            <div className="mt-auto pt-4">
                <p className="text-2xl font-bold text-slate-800">${course.price.toFixed(2)}</p>
            </div>
        )}
      </div>
       {(userRole === UserRole.Admin || userRole === UserRole.Instructor) ? (
        <div className="bg-slate-50 p-3 border-t flex justify-end space-x-2">
            {onManageStudents && <button onClick={handleManage} className="text-sm text-green-600 hover:text-green-800 font-medium">Manage Students</button>}
            {onEdit && <button onClick={handleEdit} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</button>}
            {onDelete && <button onClick={handleDelete} className="text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>}
        </div>
      ) : userRole === UserRole.Student && !isEnrolled ? (
        <div className="bg-amber-500 mt-auto p-4 text-center text-black font-bold transition-colors hover:bg-amber-600">
            {course.price && course.price > 0 ? `Enroll Now for $${course.price.toFixed(2)}` : 'Enroll for Free'}
        </div>
      ) : null }
    </Card>
  );
};