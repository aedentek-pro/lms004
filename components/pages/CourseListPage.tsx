import React, { useState, useEffect, useMemo } from 'react';
import { Course, User, UserRole, StudentProgress, NewCourse } from '../../types';
import { CourseCard } from '../shared/CourseCard';
import { Modal } from '../shared/Modal';
import { CourseCreationForm } from '../forms/CourseCreationForm';
import { CourseDetailView } from '../student/CourseDetailView';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { StudentProgressView } from '../instructor/StudentProgressView';
import { EnrollmentModal } from '../student/EnrollmentModal';

interface CourseListPageProps {
    currentUser: User;
    allCourses: Course[];
    instructors: User[];
    students: User[];
    studentProgress: StudentProgress[];
    onCreateCourse: (courseData: NewCourse) => void;
    onDeleteCourse: (courseId: string) => void;
    onModuleComplete: (courseId: string, moduleId: string) => void;
    onQuizComplete: (courseId: string, score: number) => void;
    onAssignmentSubmit: (courseId: string, submission: { text: string; file?: File; }) => void;
    onGradeAssignment: (courseId: string, studentId: string, grade: number, feedback: string) => void;
    onRateCourse: (courseId: string, rating: number) => void;
    onEnrollInCourse: (courseId: string, enrollmentData: { phoneNumber: string, address: string }) => void;
    onNotifyInstructorOfCompletion: (courseId: string) => void;
    onIssueCertificate: (courseId: string, studentId: string) => void;
    searchTerm?: string;
}

const CourseListPage: React.FC<CourseListPageProps> = (props) => {
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
    const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
    const [enrollingCourse, setEnrollingCourse] = useState<Course | null>(null);
    const [viewingProgressForCourse, setViewingProgressForCourse] = useState<Course | null>(null);

    const { searchTerm = '' } = props;

    const canCreate = props.currentUser.role === UserRole.Admin || props.currentUser.role === UserRole.Instructor;

    const filteredCourses = useMemo(() => {
        if (!searchTerm.trim()) {
            return props.allCourses;
        }
        return props.allCourses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [props.allCourses, searchTerm]);


    const handleFormSubmit = (courseData: NewCourse) => {
        props.onCreateCourse(courseData); // This will handle both create and update
        setIsCreationModalOpen(false);
        setEditingCourse(null);
    };

    const getInstructorForCourse = (instructorId: string) => {
        return props.instructors.find(i => i.id === instructorId);
    };

    const getProgressForCourse = (courseId: string) => {
        return props.studentProgress.find(p => p.courseId === courseId && p.studentId === props.currentUser.id);
    };
    
    const handleDeleteConfirm = () => {
        if (deletingCourse) {
            props.onDeleteCourse(deletingCourse.id);
            setDeletingCourse(null);
        }
    };
    
    const handleEditClick = (course: Course) => {
        setEditingCourse(course);
        setIsCreationModalOpen(true);
    };
    
    const handleCourseClick = (course: Course) => {
        if (props.currentUser.role === UserRole.Student) {
            const progress = getProgressForCourse(course.id);
            if (progress) {
                setViewingCourse(course);
            } else {
                setEnrollingCourse(course);
            }
        } else {
             // For instructors/admins, clicking the card could be a view action, buttons are for management
             // For now, let's make it edit
             handleEditClick(course);
        }
    };

    const handleEnrollmentSubmit = (enrollmentData: { phoneNumber: string, address: string }) => {
        if (enrollingCourse) {
            props.onEnrollInCourse(enrollingCourse.id, enrollmentData);
            setEnrollingCourse(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">{props.currentUser.role === UserRole.Student ? 'Available Courses' : 'Manage Courses'}</h1>
                {canCreate && (
                    <button
                        onClick={() => { setEditingCourse(null); setIsCreationModalOpen(true); }}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        + Create Course
                    </button>
                )}
            </div>

            {filteredCourses.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            instructor={getInstructorForCourse(course.instructorId)}
                            progress={getProgressForCourse(course.id)}
                            onClick={handleCourseClick}
                            onEdit={canCreate ? handleEditClick : undefined}
                            onDelete={canCreate ? (courseId) => setDeletingCourse(props.allCourses.find(c => c.id === courseId) || null) : undefined}
                            onManageStudents={canCreate ? setViewingProgressForCourse : undefined}
                            userRole={props.currentUser.role}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                    <p className="text-slate-500">
                         {searchTerm ? `No courses found matching "${searchTerm}".` : 'No courses available.'}
                    </p>
                </div>
            )}
            
            <Modal isOpen={isCreationModalOpen} onClose={() => { setIsCreationModalOpen(false); setEditingCourse(null); }} title={editingCourse ? 'Edit Course' : 'Create a New Course'} size="3xl">
                <CourseCreationForm
                    courseToEdit={editingCourse}
                    currentUser={props.currentUser}
                    instructors={props.instructors}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setIsCreationModalOpen(false); setEditingCourse(null); }}
                />
            </Modal>
            
            <Modal isOpen={!!viewingCourse} onClose={() => setViewingCourse(null)} title={viewingCourse?.title || 'Course Details'} size="4xl">
                {viewingCourse && (
                    <CourseDetailView
                        course={viewingCourse}
                        student={props.currentUser}
                        progress={getProgressForCourse(viewingCourse.id)}
                        onModuleComplete={(moduleId) => props.onModuleComplete(viewingCourse.id, moduleId)}
                        onQuizComplete={(score) => props.onQuizComplete(viewingCourse.id, score)}
                        onAssignmentSubmit={(submission) => props.onAssignmentSubmit(viewingCourse.id, submission)}
                        onRateCourse={(rating) => props.onRateCourse(viewingCourse.id, rating)}
                        onNotifyInstructorOfCompletion={() => props.onNotifyInstructorOfCompletion(viewingCourse.id)}
                    />
                )}
            </Modal>

            <Modal isOpen={!!viewingProgressForCourse} onClose={() => setViewingProgressForCourse(null)} title={`Student Progress: ${viewingProgressForCourse?.title}`} size="3xl">
                {viewingProgressForCourse && (
                    <StudentProgressView
                        course={viewingProgressForCourse}
                        students={props.students}
                        allProgress={props.studentProgress}
                        onIssueCertificate={props.onIssueCertificate}
                        onGradeAssignment={props.onGradeAssignment}
                    />
                )}
            </Modal>
            
            <ConfirmationModal 
                isOpen={!!deletingCourse}
                onClose={() => setDeletingCourse(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Course"
                message={`Are you sure you want to delete the course "${deletingCourse?.title}"? This action cannot be undone.`}
            />

            <EnrollmentModal
                isOpen={!!enrollingCourse}
                onClose={() => setEnrollingCourse(null)}
                onSubmit={handleEnrollmentSubmit}
                course={enrollingCourse}
                user={props.currentUser}
            />
        </div>
    );
};

export default CourseListPage;