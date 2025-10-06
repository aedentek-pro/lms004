import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../shared/Card';
import { User, UserRole, OneToOneSession } from '../../types';
import { Modal } from '../shared/Modal';
import { WebinarView } from '../student/WebinarView';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { VideoCameraIcon, TrashIcon, PencilIcon, CheckCircleIcon, XCircleIcon } from '../icons/Icons';

interface OneToOnePageProps {
  currentUser: User;
  instructors: User[];
  students: User[];
  users: User[];
  sessions: OneToOneSession[];
  onCreateSession: (studentId: string, instructorId: string, dateTime: Date) => void;
  onUpdateSession: (sessionId: string, studentId: string, instructorId: string, dateTime: Date) => void;
  onCancelSession: (sessionId: string) => void;
  onAcceptSession: (sessionId: string) => void;
  onRejectSession: (sessionId: string) => void;
}

const SessionFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { studentId: string, instructorId: string, dateTime: Date, sessionId?: string }) => void;
    currentUser: User;
    instructors: User[];
    students: User[];
    sessionToEdit?: OneToOneSession | null;
}> = ({ isOpen, onClose, onSubmit, currentUser, instructors, students, sessionToEdit }) => {
    const isEditMode = !!sessionToEdit;
    const [studentId, setStudentId] = useState<string>('');
    const [instructorId, setInstructorId] = useState<string>('');
    const [dateTime, setDateTime] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && sessionToEdit) {
                setStudentId(sessionToEdit.studentId);
                setInstructorId(sessionToEdit.instructorId);
                // Format date correctly for the datetime-local input, adjusting for timezone
                const d = new Date(sessionToEdit.dateTime);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                setDateTime(d.toISOString().slice(0, 16));
            } else {
                 if (currentUser.role === UserRole.Student) {
                    setStudentId(currentUser.id);
                    setInstructorId('');
                } else { // Instructor or Admin
                    setStudentId('');
                    setInstructorId(currentUser.role === UserRole.Instructor ? currentUser.id : '');
                }
                setDateTime('');
            }
        }
    }, [isOpen, isEditMode, sessionToEdit, currentUser]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId || !instructorId || !dateTime) {
            alert('Please fill out all fields.');
            return;
        }
        onSubmit({ studentId, instructorId, dateTime: new Date(dateTime), sessionId: sessionToEdit?.id });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Update Session" : "Schedule a New Session"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {currentUser.role !== UserRole.Student ? (
                     <div>
                        <label htmlFor="student-select" className="block mb-2 text-sm font-medium text-slate-700">Student</label>
                        <select
                            id="student-select"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            required
                        >
                            <option value="" disabled>Select a student</option>
                            {students.map(stud => <option key={stud.id} value={stud.id}>{stud.name}</option>)}
                        </select>
                    </div>
                ) : (
                    <input type="hidden" value={studentId} />
                )}
               
                {currentUser.role !== UserRole.Instructor ? (
                    <div>
                        <label htmlFor="instructor-select" className="block mb-2 text-sm font-medium text-slate-700">Instructor</label>
                        <select
                            id="instructor-select"
                            value={instructorId}
                            onChange={(e) => setInstructorId(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            required
                        >
                            <option value="" disabled>Select an instructor</option>
                            {instructors.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                        </select>
                    </div>
                ): (
                     <input type="hidden" value={instructorId} />
                )}

                 <div>
                    <label htmlFor="session-datetime" className="block mb-2 text-sm font-medium text-slate-700">Date and Time</label>
                    <input
                        id="session-datetime"
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                    <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg">{isEditMode ? 'Update Session' : 'Request Session'}</button>
                </div>
            </form>
        </Modal>
    );
};

const StatusBadge: React.FC<{ status: OneToOneSession['status'] }> = ({ status }) => {
    const statusStyles: { [key in OneToOneSession['status']]: string } = {
        pending: 'bg-yellow-100 text-yellow-800',
        scheduled: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        canceled: 'bg-gray-100 text-gray-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const OneToOnePage: React.FC<OneToOnePageProps> = ({ currentUser, instructors, students, users, sessions, onCreateSession, onUpdateSession, onCancelSession, onAcceptSession, onRejectSession }) => {
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<OneToOneSession | null>(null);
    const [joiningSession, setJoiningSession] = useState<OneToOneSession | null>(null);
    const [cancelModalConfig, setCancelModalConfig] = useState({ session: null as OneToOneSession | null, message: '', title: '' });
    
    const processedSessions = useMemo(() => {
        const now = new Date();
        return sessions.map(session => {
            // Mark session as completed 30 minutes after its scheduled start time to allow a joining grace period.
            if (session.status === 'scheduled' && now.getTime() > (session.dateTime.getTime() + 30 * 60 * 1000)) {
                return { ...session, status: 'completed' as const };
            }
            return session;
        });
    }, [sessions]);

    const getVisibleSessions = (filterFn: (s: OneToOneSession) => boolean) => 
        processedSessions.filter(s => {
            if (currentUser.role === UserRole.Admin) return filterFn(s);
            return (s.studentId === currentUser.id || s.instructorId === currentUser.id) && filterFn(s);
        }).sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    const pendingSessions = getVisibleSessions(s => s.status === 'pending');
    const upcomingSessions = getVisibleSessions(s => s.status === 'scheduled' && s.dateTime > new Date());
    const pastSessions = getVisibleSessions(s => ['completed', 'canceled', 'rejected'].includes(s.status) || (s.status === 'scheduled' && s.dateTime <= new Date())).sort((a,b) => b.dateTime.getTime() - a.dateTime.getTime());

    const handleSessionFormSubmit = (data: { studentId: string, instructorId: string, dateTime: Date, sessionId?: string }) => {
        if (data.sessionId) {
            onUpdateSession(data.sessionId, data.studentId, data.instructorId, data.dateTime);
        } else {
            onCreateSession(data.studentId, data.instructorId, data.dateTime);
        }
        setIsCreationModalOpen(false);
        setEditingSession(null);
    };
    
    const handleConfirmCancel = () => {
        if (cancelModalConfig.session) {
            onCancelSession(cancelModalConfig.session.id);
            setCancelModalConfig({ session: null, message: '', title: '' });
        }
    };
    
    const SessionList: React.FC<{ 
        title: string; 
        sessions: OneToOneSession[]; 
        emptyMessage: string;
    }> = ({ title, sessions, emptyMessage }) => {
        const canManage = currentUser.role === UserRole.Admin || currentUser.role === UserRole.Instructor;
        
        const getOtherPartyName = (session: OneToOneSession) => {
             if (currentUser.role === UserRole.Student) {
                 return users.find(u => u.id === session.instructorId)?.name || 'Unknown Instructor';
             }
             if (currentUser.role === UserRole.Instructor) {
                 return users.find(u => u.id === session.studentId)?.name || 'Unknown Student';
             }
             const student = users.find(u => u.id === session.studentId)?.name || 'Unknown';
             const instructor = users.find(u => u.id === session.instructorId)?.name || 'Unknown';
             return `${student} & ${instructor}`;
        };

        const handleCancelClick = (sessionToCancel: OneToOneSession) => {
            if (sessionToCancel.status === 'pending') {
                setCancelModalConfig({
                    session: sessionToCancel,
                    message: 'Are you sure you want to withdraw this session request?',
                    title: 'Withdraw Request'
                });
            } else {
                setCancelModalConfig({
                    session: sessionToCancel,
                    message: 'Are you sure you want to cancel this scheduled session? The other party will be notified.',
                    title: 'Cancel Session'
                });
            }
        };

        return (
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
                {sessions.length === 0 ? (
                     <Card className="p-8 text-center">
                        <p className="text-slate-500">{emptyMessage}</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {sessions.map(session => {
                            const isRequester = currentUser.id === session.requestedById;
                            const canEdit = canManage && (session.status === 'pending' || session.status === 'scheduled');
                            
                            const now = new Date().getTime();
                            const sessionStartTime = session.dateTime.getTime();
                            // Can join from 30 minutes before the session starts until 30 minutes after it has started.
                            const canJoin = session.status === 'scheduled' &&
                                now >= (sessionStartTime - 30 * 60 * 1000) &&
                                now < (sessionStartTime + 30 * 60 * 1000);

                            const canCancelScheduled = session.status === 'scheduled' && session.dateTime > new Date();

                            return (
                                <Card key={session.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <p className="font-semibold text-slate-800">{getOtherPartyName(session)}</p>
                                            <StatusBadge status={session.status} />
                                        </div>
                                        <p className="text-sm text-slate-600 mt-2">{session.dateTime.toLocaleString()}</p>
                                    </div>
                                    <div className="flex space-x-2 flex-wrap gap-2 justify-start sm:justify-end">
                                        {session.status === 'pending' && (
                                            isRequester ? (
                                                <button onClick={() => handleCancelClick(session)} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-500 rounded-md hover:bg-slate-600 transition-colors">
                                                    <XCircleIcon className="w-4 h-4 mr-2"/> Withdraw Request
                                                </button>
                                            ) : (
                                                <>
                                                    <button onClick={() => onAcceptSession(session.id)} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
                                                        <CheckCircleIcon className="w-4 h-4 mr-2"/> Accept
                                                    </button>
                                                    <button onClick={() => onRejectSession(session.id)} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
                                                        <XCircleIcon className="w-4 h-4 mr-2"/> Reject
                                                    </button>
                                                </>
                                            )
                                        )}
                                        {canJoin && (
                                            <button onClick={() => setJoiningSession(session)} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                                                <VideoCameraIcon className="w-4 h-4 mr-2"/> Join
                                            </button>
                                        )}
                                        {canCancelScheduled && (
                                             <button onClick={() => handleCancelClick(session)} className="flex items-center justify-center p-2 text-sm font-semibold text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        )}
                                        {canEdit && (
                                            <button onClick={() => { setEditingSession(session); setIsCreationModalOpen(true); }} className="flex items-center justify-center p-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
                                                <PencilIcon className="w-4 h-4"/>
                                            </button>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        );
    }

    const renderContent = () => (
        <>
            {pendingSessions.length > 0 && 
                <SessionList
                    title="Pending Requests"
                    sessions={pendingSessions}
                    emptyMessage="You have no pending session requests."
                />
            }
            <SessionList
                title="Upcoming Sessions"
                sessions={upcomingSessions}
                emptyMessage="You have no upcoming sessions scheduled."
            />
             <SessionList
                title="Past Sessions"
                sessions={pastSessions}
                emptyMessage="You have no past sessions."
            />
        </>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-slate-800">One-to-One Sessions</h1>
                <button 
                    onClick={() => { setEditingSession(null); setIsCreationModalOpen(true); }}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    + Schedule Session
                </button>
            </div>
            {renderContent()}

            <SessionFormModal
                isOpen={isCreationModalOpen}
                onClose={() => { setIsCreationModalOpen(false); setEditingSession(null); }}
                onSubmit={handleSessionFormSubmit}
                currentUser={currentUser}
                instructors={instructors}
                students={students}
                sessionToEdit={editingSession}
            />

             <Modal isOpen={!!joiningSession} onClose={() => setJoiningSession(null)} title={`Session with ${users.find(u => u.id === (joiningSession?.instructorId === currentUser.id ? joiningSession?.studentId : joiningSession?.instructorId))?.name}`} size="4xl">
                <WebinarView onClose={() => setJoiningSession(null)} currentUser={currentUser} />
            </Modal>
            
            <ConfirmationModal
                isOpen={!!cancelModalConfig.session}
                onClose={() => setCancelModalConfig({ session: null, message: '', title: '' })}
                onConfirm={handleConfirmCancel}
                title={cancelModalConfig.title}
                message={cancelModalConfig.message}
            />
        </div>
    );
};

export default OneToOnePage;