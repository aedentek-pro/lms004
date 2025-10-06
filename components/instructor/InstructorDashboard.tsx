





import React, { useState } from 'react';
import { User, Course, StudentProgress, Notification, ChatMessage, LiveSession, NewCourse, NewLiveSession, OneToOneSession } from '../../types';
import { BottomNavBar } from '../shared/BottomNavBar';
import { NotificationBell } from '../shared/NotificationBell';
import { UserCircleIcon, Cog6ToothIcon, AcademicCapIcon, MagnifyingGlassIcon } from '../icons/Icons';
import CourseListPage from '../pages/CourseListPage';
import WebinarListPage from '../pages/WebinarListPage';
import CommunityPage from '../pages/CommunityPage';
import OneToOnePage from '../pages/OneToOnePage';
import { AppSettingsMenu } from '../shared/AppSettingsMenu';
import { UserProfileMenu } from '../shared/UserProfileMenu';

interface DashboardProps {
    currentUser: User;
    onLogout: () => void;
    allCourses: Course[];
    instructors: User[];
    studentProgress: StudentProgress[];
    onCreateCourse: (courseData: NewCourse) => void;
    onDeleteCourse: (courseId: string) => void;
    onIssueCertificate: (courseId: string, studentId: string) => void;
    onGradeAssignment: (courseId: string, studentId: string, grade: number, feedback: string) => void;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    chatMessages: ChatMessage[];
    onSendMessage: (text: string) => void;
    allLiveSessions: LiveSession[];
    onCreateLiveSession: (sessionData: NewLiveSession) => void;
    onDeleteLiveSession: (sessionId: string) => void;
    sessions: OneToOneSession[];
    users: User[];
    students: User[];
    onCreateSession: (studentId: string, instructorId: string, dateTime: Date) => void;
    onUpdateSession: (sessionId: string, studentId: string, instructorId: string, dateTime: Date) => void;
    onCancelSession: (sessionId: string) => void;
    whatsAppPosition: string;
    setWhatsAppPosition: (position: string) => void;
    onAcceptSession: (sessionId: string) => void;
    onRejectSession: (sessionId: string) => void;
    onRegisterForWebinar: (sessionId: string) => void;
    onUploadWebinarRecording: (sessionId: string, file: File) => Promise<void>;
}

const InstructorDashboard: React.FC<DashboardProps> = (props) => {
    const [currentPage, setCurrentPage] = useState('home');
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const showSearchBar = ['home', 'courses'].includes(currentPage);

    const renderContent = () => {
        const courseListProps = {
             currentUser: props.currentUser,
            instructors: props.instructors,
            studentProgress: props.studentProgress,
            onCreateCourse: props.onCreateCourse,
            onDeleteCourse: props.onDeleteCourse,
            onIssueCertificate: props.onIssueCertificate,
            onGradeAssignment: props.onGradeAssignment,
            students: props.students,
            // Dummy/unused props for instructor view
            onModuleComplete: () => {},
            onQuizComplete: () => {},
            onAssignmentSubmit: () => {},
            onRateCourse: () => {},
            onEnrollInCourse: () => {},
            onNotifyInstructorOfCompletion: () => {},
            searchTerm,
        };

        switch (currentPage) {
            case 'courses':
                return <CourseListPage 
                    {...courseListProps}
                    allCourses={props.allCourses}
                />;
            case 'live':
                 return <WebinarListPage
                    currentUser={props.currentUser}
                    allLiveSessions={props.allLiveSessions}
                    instructors={props.instructors}
                    onCreateLiveSession={props.onCreateLiveSession}
                    onDeleteLiveSession={props.onDeleteLiveSession}
                    onRegisterForWebinar={props.onRegisterForWebinar}
                    onUploadWebinarRecording={props.onUploadWebinarRecording}
                    users={props.users}
                />;
            case 'community':
                return <CommunityPage currentUser={props.currentUser} messages={props.chatMessages} onSendMessage={props.onSendMessage}/>;
            case 'sessions':
                 return <OneToOnePage 
                    currentUser={props.currentUser}
                    instructors={props.instructors}
                    students={props.students}
                    users={props.users}
                    sessions={props.sessions}
                    onCreateSession={props.onCreateSession}
                    onUpdateSession={props.onUpdateSession}
                    onCancelSession={props.onCancelSession}
                    onAcceptSession={props.onAcceptSession}
                    onRejectSession={props.onRejectSession}
                 />;
            case 'home':
            default:
                 const myCourses = props.allCourses.filter(c => c.instructorId === props.currentUser.id);
                return (
                    <div>
                        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
                            <h1 className="text-3xl font-bold text-slate-800">Instructor Dashboard</h1>
                            <p className="text-slate-600 mt-2">Manage your classes, live sessions, and student interactions.</p>
                        </div>

                         <h2 className="text-2xl font-bold text-slate-800 mb-4">My Classes</h2>
                         <CourseListPage 
                            {...courseListProps}
                            allCourses={myCourses}
                        />
                    </div>
                );
        }
    };

    return (
         <div className="bg-slate-50 min-h-screen">
            <header className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md sticky top-0 z-30">
                <div className="flex items-center flex-shrink-0">
                    <AcademicCapIcon className="h-8 w-8"/>
                    <span className="text-lg font-bold ml-2 hidden sm:block">Purple LMS</span>
                </div>

                <div className="flex-1 min-w-0">
                    {showSearchBar && (
                        <div className="relative w-full max-w-lg mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full bg-indigo-400/50 border-transparent rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-indigo-100 focus:ring-white focus:bg-indigo-400/80"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    <NotificationBell currentUser={props.currentUser} notifications={props.notifications} setNotifications={props.setNotifications} setCurrentPage={setCurrentPage} />
                    <div className="relative">
                        <button onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)} className="p-1 rounded-full hover:bg-white/20">
                            <Cog6ToothIcon className="w-6 h-6"/>
                        </button>
                        {isSettingsMenuOpen && <AppSettingsMenu onPositionChange={props.setWhatsAppPosition} currentPosition={props.whatsAppPosition} onClose={() => setIsSettingsMenuOpen(false)}/>}
                    </div>
                     <div className="relative">
                         <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="rounded-full hover:bg-white/20">
                             <UserCircleIcon className="w-8 h-8"/>
                         </button>
                         {isProfileMenuOpen && <UserProfileMenu user={props.currentUser} onLogout={props.onLogout} onClose={() => setIsProfileMenuOpen(false)} />}
                    </div>
                </div>
            </header>
            <main className="p-6 pb-24">
                {renderContent()}
            </main>
            <BottomNavBar user={props.currentUser} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
};

export default InstructorDashboard;