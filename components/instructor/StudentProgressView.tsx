
import React, { useState } from 'react';
import { Course, User, StudentProgress } from '../../types';
import { Card } from '../shared/Card';
import { ProgressBar } from '../shared/ProgressBar';
import { AssignmentGradingModal } from './AssignmentGradingModal';

interface StudentProgressViewProps {
    course: Course;
    students: User[];
    allProgress: StudentProgress[];
    onIssueCertificate: (courseId: string, studentId: string) => void;
    onGradeAssignment: (courseId: string, studentId: string, grade: number, feedback: string) => void;
}

export const StudentProgressView: React.FC<StudentProgressViewProps> = ({ course, students, allProgress, onIssueCertificate, onGradeAssignment }) => {
    
    const [gradingStudent, setGradingStudent] = useState<User | null>(null);
    const gradingProgress = gradingStudent ? allProgress.find(p => p.studentId === gradingStudent.id && p.courseId === course.id) : null;

    const enrolledStudentIds = allProgress
        .filter(p => p.courseId === course.id)
        .map(p => p.studentId);

    const enrolledStudents = students.filter(s => enrolledStudentIds.includes(s.id));

    const getProgressForStudent = (studentId: string) => {
        return allProgress.find(p => p.courseId === course.id && p.studentId === studentId);
    };
    
    const handleGradeSubmit = (grade: number, feedback: string) => {
        if (gradingStudent) {
            onGradeAssignment(course.id, gradingStudent.id, grade, feedback);
        }
    };

    return (
        <div className="space-y-4">
            {enrolledStudents.length > 0 ? enrolledStudents.map(student => {
                const progress = getProgressForStudent(student.id);
                if (!progress) return null;

                const progressPercent = (progress.completedModules.length / course.modules.length) * 100;

                return (
                    <Card key={student.id} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h4 className="font-bold text-slate-800">{student.name}</h4>
                                <p className="text-sm text-slate-500">{student.email}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                                {progress.completionNotified && !progress.certificateIssued && (
                                    <button 
                                        onClick={() => onIssueCertificate(course.id, student.id)}
                                        className="px-4 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Issue Certificate
                                    </button>
                                )}
                                {progress.certificateIssued && (
                                     <p className="px-4 py-1.5 text-sm font-semibold text-green-800 bg-green-100 rounded-lg">Certificate Issued</p>
                                )}
                                {!progress.completionNotified && (
                                    <p className="px-4 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg">In Progress</p>
                                )}
                            </div>
                        </div>
                         <div className="mt-4">
                            <ProgressBar progress={progressPercent} />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>{progress.completedModules.length} / {course.modules.length} modules</span>
                                <span>Quiz Score: {progress.quizScore !== null ? `${progress.quizScore}%` : 'N/A'}</span>
                            </div>
                        </div>
                        {course.assignment && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold text-slate-700">Assignment: <span className="font-normal">{course.assignment.title}</span></p>
                                    {progress.assignmentStatus === 'pending' && <p className="text-sm text-slate-500">Not Submitted</p>}
                                    {progress.assignmentStatus === 'submitted' && (
                                        <button onClick={() => setGradingStudent(student)} className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                                            Grade
                                        </button>
                                    )}
                                     {progress.assignmentStatus === 'graded' && <p className="text-sm font-bold text-teal-600">Grade: {progress.grade}/100</p>}
                                </div>
                            </div>
                        )}
                    </Card>
                )
            }) : (
                <div className="text-center py-8">
                    <p className="text-slate-500">No students are currently enrolled in this course.</p>
                </div>
            )}

            {course.assignment && gradingStudent && gradingProgress && (gradingProgress.submissionText || gradingProgress.submissionFileUrl) && (
                <AssignmentGradingModal
                    isOpen={!!gradingStudent}
                    onClose={() => setGradingStudent(null)}
                    onSubmit={handleGradeSubmit}
                    studentName={gradingStudent.name}
                    assignment={course.assignment}
                    submissionText={gradingProgress.submissionText}
                    submissionFileUrl={gradingProgress.submissionFileUrl}
                    submissionFileName={gradingProgress.submissionFileName}
                />
            )}
        </div>
    );
};