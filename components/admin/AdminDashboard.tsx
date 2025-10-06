










import React, { useState } from 'react';
import { User, Course, StudentProgress, Notification, ChatMessage, LiveSession, NewCourse, NewLiveSession, UserRole, OneToOneSession } from '../../types';
import { BottomNavBar } from '../shared/BottomNavBar';
import { NotificationBell } from '../shared/NotificationBell';
import { UserCircleIcon, PencilIcon, TrashIcon, Cog6ToothIcon, AcademicCapIcon, MagnifyingGlassIcon } from '../icons/Icons';
import CourseListPage from '../pages/CourseListPage';
import WebinarListPage from '../pages/WebinarListPage';
import CommunityPage from '../pages/CommunityPage';
import { Card } from '../shared/Card';
import { Modal } from '../shared/Modal';
import { UserEditForm } from '../forms/UserEditForm';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import OneToOnePage from '../pages/OneToOnePage';
import { AppSettingsMenu } from '../shared/AppSettingsMenu';
import { UserProfileMenu } from '../shared/UserProfileMenu';
import { AnalyticsPage } from './AnalyticsPage';


// Simple User Management Page component defined within the dashboard
const UserManagementPage: React.FC<{
    users: User[];
    onUpdateUser: (userData: {name: string, role: UserRole, id?: string}) => void;
    onDeleteUser: (userId: string) => void;
}> = ({ users, onUpdateUser, onDeleteUser }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleFormSubmit = (userData: {name: string, role: UserRole, id?: string}) => {
        onUpdateUser(userData);
        setIsEditModalOpen(false);
        setEditingUser(null);
    };
    
    const handleDeleteConfirm = () => {
        if (deletingUser) {
            onDeleteUser(deletingUser.id);
            setDeletingUser(null);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">User Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map(user => (
                    <Card key={user.id} className="flex flex-col">
                        <div className="p-5 flex-grow">
                            <h3 className="text-lg font-bold text-slate-800 truncate">{user.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{user.email}</p>
                            <p className={`text-sm font-semibold mt-2 ${user.role === UserRole.Admin ? 'text-red-600' : user.role === UserRole.Instructor ? 'text-indigo-600' : 'text-green-600'}`}>{user.role}</p>
                        </div>
                        <div className="bg-slate-50 p-3 border-t flex justify-end space-x-2">
                             <button onClick={() => handleEditClick(user)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" aria-label={`Edit ${user.name}`}><PencilIcon className="w-5 h-5"/></button>
                             <button onClick={() => setDeletingUser(user)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label={`Delete ${user.name}`}><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </Card>
                ))}
            </div>
            
            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingUser(null); }} title={editingUser ? 'Edit User' : 'Create User'}>
                <UserEditForm user={editingUser} onSubmit={handleFormSubmit} onCancel={() => { setIsEditModalOpen(false); setEditingUser(null); }}/>
            </Modal>
            
            <ConfirmationModal 
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                message={`Are you sure you want to delete the user ${deletingUser?.name}? This action cannot be undone.`}
            />
        </div>
    );
};


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
    users: User[];
    students: User[];
    sessions: OneToOneSession[];
    onCreateSession: (studentId: string, instructorId: string, dateTime: Date) => void;
    onUpdateSession: (sessionId: string, studentId: string, instructorId: string, dateTime: Date) => void;
    onCancelSession: (sessionId: string) => void;
    onUpdateUser: (userData: {name: string, role: UserRole, id?: string}) => void;
    onDeleteUser: (userId: string) => void;
    whatsAppPosition: string;
    setWhatsAppPosition: (position: string) => void;
    onAcceptSession: (sessionId: string) => void;
    onRejectSession: (sessionId: string) => void;
    onRegisterForWebinar: (sessionId: string) => void;
    onUploadWebinarRecording: (sessionId: string, file: File) => Promise<void>;
}

const AdminDashboard: React.FC<DashboardProps> = (props) => {
    const [currentPage, setCurrentPage] = useState('home');
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const showSearchBar = currentPage === 'courses';

    const renderContent = () => {
        const courseListProps = {
            currentUser: props.currentUser,
            allCourses: props.allCourses,
            instructors: props.instructors,
            studentProgress: props.studentProgress,
            onCreateCourse: props.onCreateCourse,
            onDeleteCourse: props.onDeleteCourse,
            onIssueCertificate: props.onIssueCertificate,
            onGradeAssignment: props.onGradeAssignment,
            students: props.students,
            // Dummy/unused props for admin view
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
                return <CourseListPage {...courseListProps} />;
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
            case 'analytics':
                return <AnalyticsPage users={props.users} courses={props.allCourses} studentProgress={props.studentProgress} />;
            case 'users':
                return <UserManagementPage users={props.users} onUpdateUser={props.onUpdateUser} onDeleteUser={props.onDeleteUser} />;
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
                const totalStudents = props.users.filter(u => u.role === UserRole.Student).length;
                const totalInstructors = props.users.filter(u => u.role === UserRole.Instructor).length;

                return (
                    <div>
                        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
                            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                            <p className="text-slate-600 mt-2">Oversee all platform activity from here.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="p-5 border-t-4 border-violet-500"><h3 className="text-lg font-semibold text-slate-700">Total Users</h3><p className="text-3xl font-bold text-violet-600">{props.users.length}</p></Card>
                            <Card className="p-5 border-t-4 border-violet-500"><h3 className="text-lg font-semibold text-slate-700">Students</h3><p className="text-3xl font-bold text-violet-600">{totalStudents}</p></Card>
                            <Card className="p-5 border-t-4 border-violet-500"><h3 className="text-lg font-semibold text-slate-700">Instructors</h3><p className="text-3xl font-bold text-violet-600">{totalInstructors}</p></Card>
                            <Card className="p-5 border-t-4 border-violet-500"><h3 className="text-lg font-semibold text-slate-700">Active Courses</h3><p className="text-3xl font-bold text-violet-600">{props.allCourses.length}</p></Card>
                        </div>

                        <div className="mt-8">
                            <UserManagementPage users={props.users.slice(0,4)} onUpdateUser={props.onUpdateUser} onDeleteUser={props.onDeleteUser} />
                        </div>
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

export default AdminDashboard;