import React, { useState, useEffect, useCallback } from 'react';
import { AuthScreen } from './components/auth/AuthScreen';
import StudentDashboard from './components/student/StudentDashboard';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { User, UserRole, Course, StudentProgress, Notification, ChatMessage, LiveSession, NewCourse, NewLiveSession, OneToOneSession } from './types';
import { WhatsAppFloat } from './components/shared/WhatsAppFloat';
import { Toast } from './components/shared/Toast';
import { db, initializeDB } from './db';
import { AcademicCapIcon } from './components/icons/Icons';

const LoadingScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="flex items-center text-indigo-600 mb-4">
            <AcademicCapIcon className="h-12 w-12 animate-pulse" />
            <span className="text-3xl font-bold ml-3">Purple LMS</span>
        </div>
        <p className="text-slate-500">Loading your learning experience...</p>
    </div>
);


const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
    const [oneToOneSessions, setOneToOneSessions] = useState<OneToOneSession[]>([]);
    const [whatsAppPosition, setWhatsAppPosition] = useState('bottom-6 right-6');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    // State for the OTP signup flow
    const [pendingSignupData, setPendingSignupData] = useState<{ name: string; email: string; role: UserRole } | null>(null);
    const [signupOtp, setSignupOtp] = useState<string | null>(null);

    // Load all data from DB on initial render
    useEffect(() => {
        const loadInitialData = async () => {
            await initializeDB();
            const [
                loadedUsers,
                loadedCourses,
                loadedProgress,
                loadedNotifications,
                loadedChat,
                loadedLive,
                loadedOneToOne
            ] = await Promise.all([
                db.getUsers(),
                db.getCourses(),
                db.getStudentProgress(),
                db.getNotifications(),
                db.getChatMessages(),
                db.getLiveSessions(),
                db.getOneToOneSessions(),
            ]);
            
            setUsers(loadedUsers);
            setCourses(loadedCourses);
            setStudentProgress(loadedProgress);
            setNotifications(loadedNotifications);
            setChatMessages(loadedChat);
            setLiveSessions(loadedLive);
            setOneToOneSessions(loadedOneToOne);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    // Wrapper for setting notifications to also save them
    const handleSetNotifications = useCallback(async (updater: React.SetStateAction<Notification[]>) => {
        setNotifications(prev => {
            const newState = typeof updater === 'function' ? updater(prev) : updater;
            queueMicrotask(async () => {
                await db.saveNotifications(newState);
            });
            return newState;
        });
    }, []);

    // Effect for sending welcome notification
    useEffect(() => {
        if (currentUser) {
            const welcomeNotif: Notification = {
                id: `notif-${Date.now()}`,
                recipientId: currentUser.id,
                message: `Welcome back, ${currentUser.name}!`,
                createdAt: new Date(),
                read: false,
                type: 'system',
            };
            handleSetNotifications(prev => [...prev, welcomeNotif]);
        }
    }, [currentUser, handleSetNotifications]);

    // Effect for sending session reminders
    useEffect(() => {
        const reminderInterval = setInterval(async () => {
            if (isLoading) return;

            const now = new Date().getTime();
            let hasOneToOneUpdates = false;
            let hasLiveUpdates = false;
            
            const localOneToOneSessions = [...oneToOneSessions];
            const localLiveSessions = [...liveSessions];
            
            // --- 1-on-1 Session Reminders (30 mins) ---
            const updatedOneToOneSessions = localOneToOneSessions.map(session => {
                const sessionTime = new Date(session.dateTime).getTime();
                const timeUntil = sessionTime - now;
                const thirtyMinutes = 30 * 60 * 1000;

                if (session.status === 'scheduled' && !session.reminderSent && timeUntil > 0 && timeUntil <= thirtyMinutes) {
                    const student = users.find(u => u.id === session.studentId);
                    const instructor = users.find(u => u.id === session.instructorId);

                    if (student && instructor) {
                        const studentMsg = `Your 1-on-1 session with ${instructor.name} is starting in 30 minutes.`;
                        const instructorMsg = `Your 1-on-1 session with ${student.name} is starting in 30 minutes.`;

                        handleSetNotifications(prev => [
                            ...prev,
                            { id: `notif-${Date.now()}-s`, recipientId: student.id, message: studentMsg, createdAt: new Date(), read: false, type: 'session', link: 'sessions' },
                            { id: `notif-${Date.now()}-i`, recipientId: instructor.id, message: instructorMsg, createdAt: new Date(), read: false, type: 'session', link: 'sessions' }
                        ]);
                    }
                    hasOneToOneUpdates = true;
                    return { ...session, reminderSent: true };
                }
                return session;
            });

            if (hasOneToOneUpdates) {
                await db.saveOneToOneSessions(updatedOneToOneSessions);
                setOneToOneSessions(updatedOneToOneSessions);
            }

            // --- Live Webinar Reminders (1 hour) ---
            const updatedLiveSessions = localLiveSessions.map(session => {
                const sessionTime = new Date(session.dateTime).getTime();
                const timeUntil = sessionTime - now;
                const oneHour = 60 * 60 * 1000;

                if (!session.reminderSent && timeUntil > 0 && timeUntil <= oneHour) {
                    const message = `The webinar "${session.title}" is starting in 1 hour.`;
                    const recipients = [...session.attendeeIds, session.instructorId];
                    
                    const newNotifications: Notification[] = recipients.map(recipientId => ({
                        id: `notif-${Date.now()}-${recipientId}`,
                        recipientId,
                        message,
                        createdAt: new Date(),
                        read: false,
                        type: 'session',
                        link: 'live',
                    }));

                    handleSetNotifications(prev => [...prev, ...newNotifications]);
                    hasLiveUpdates = true;
                    return { ...session, reminderSent: true };
                }
                return session;
            });
            
            if (hasLiveUpdates) {
                await db.saveLiveSessions(updatedLiveSessions);
                setLiveSessions(updatedLiveSessions);
            }

        }, 60000); // Check every minute

        return () => clearInterval(reminderInterval);
    }, [oneToOneSessions, liveSessions, users, handleSetNotifications, isLoading]);

    // --- AUTH HANDLERS ---
    const handleLogin = (email: string): User | null => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            setCurrentUser(user);
            return user;
        }
        return null;
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleInitiateSignup = (name: string, email: string, role: UserRole): boolean => {
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return false;
        }
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setSignupOtp(generatedOtp);
        setPendingSignupData({ name, email, role });
        setToast({ message: `(For testing) Your OTP is: ${generatedOtp}`, type: 'success' });
        return true;
    };

    const handleVerifyOtpAndSignup = async (otp: string): Promise<boolean> => {
        if (otp === signupOtp && pendingSignupData) {
            const newUser: User = { 
                id: `user-${Date.now()}`, 
                name: pendingSignupData.name, 
                email: pendingSignupData.email, 
                role: pendingSignupData.role 
            };
            const updatedUsers = [...users, newUser];
            await db.saveUsers(updatedUsers);
            setUsers(updatedUsers);
            setCurrentUser(newUser);
            setToast({ message: 'Account created successfully! Welcome.', type: 'success' });
            setPendingSignupData(null);
            setSignupOtp(null);
            return true;
        }
        return false;
    };

    // --- DATA HANDLERS ---
    const handleCreateCourse = async (courseData: NewCourse) => {
        let updatedCourses: Course[];
        if (courseData.id) { // Update existing course
            updatedCourses = courses.map(c => c.id === courseData.id ? { 
                ...c, 
                ...courseData, 
                modules: courseData.modules.map((m, i) => ({...m, id: c.modules[i]?.id || `m-${Date.now()}-${i}` })), 
                quiz: {...courseData.quiz, id: c.quiz.id},
                assignment: courseData.assignment ? { ...courseData.assignment, id: c.assignment?.id || `assign-${Date.now()}`, courseId: c.id } : undefined
            } as Course : c);
        } else { // Create new course
            const newCourseId = `course-${Date.now()}`;
            const newCourse: Course = {
                ...courseData,
                id: newCourseId,
                rating: 0,
                totalRatings: 0,
                modules: courseData.modules.map((m, i) => ({ ...m, id: `m-${Date.now()}-${i}` })),
                quiz: { ...courseData.quiz, id: `q-${Date.now()}` },
                assignment: courseData.assignment ? { ...courseData.assignment, id: `assign-${Date.now()}`, courseId: newCourseId } : undefined
            };
            updatedCourses = [...courses, newCourse];
        }
        
        try {
            await db.saveCourses(updatedCourses);
            setCourses(updatedCourses);
        } catch (e: any) {
            if (e.name === 'QuotaExceededError') {
                setToast({ message: 'Storage limit exceeded. Could not save course. Please reduce video sizes.', type: 'error' });
            } else {
                setToast({ message: 'An unexpected error occurred while saving the course.', type: 'error' });
            }
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        const courseToDelete = courses.find(c => c.id === courseId);
        if (courseToDelete) {
            const videoDeletionPromises = courseToDelete.modules
                .filter(module => module.type === 'video' && module.content.startsWith('indexeddb://'))
                .map(module => {
                    const videoId = module.content.replace('indexeddb://', '');
                    return db.deleteVideo(videoId).catch(err => console.error(`Failed to delete video ${videoId}`, err));
                });
            await Promise.all(videoDeletionPromises);
        }

        const updatedCourses = courses.filter(c => c.id !== courseId);
        await db.saveCourses(updatedCourses);
        setCourses(updatedCourses);
    };

    const handleStudentProgressUpdate = useCallback((updateFn: (progress: StudentProgress[]) => StudentProgress[]) => {
        setStudentProgress(prev => {
            const updatedProgress = updateFn(prev);
            queueMicrotask(async () => {
                await db.saveStudentProgress(updatedProgress);
            });
            return updatedProgress;
        });
    }, []);

    const handleModuleComplete = useCallback((courseId: string, moduleId: string) => {
        if (!currentUser) return;
        handleStudentProgressUpdate(prev => {
            const progressIndex = prev.findIndex(p => p.courseId === courseId && p.studentId === currentUser.id);
            if (progressIndex > -1) {
                const currentProgress = prev[progressIndex];
                if (!currentProgress.completedModules.includes(moduleId)) {
                    return prev.map((p, index) => 
                        index === progressIndex 
                        ? { ...p, completedModules: [...p.completedModules, moduleId] }
                        : p
                    );
                }
                return prev;
            } else {
                const newProgress: StudentProgress = { courseId, studentId: currentUser.id, completedModules: [moduleId], quizScore: null, assignmentStatus: 'pending' };
                return [...prev, newProgress];
            }
        });
    }, [currentUser, handleStudentProgressUpdate]);
    
    const handleQuizComplete = useCallback((courseId: string, score: number) => {
        if (!currentUser) return;
        handleStudentProgressUpdate(prev => {
            const progressIndex = prev.findIndex(p => p.courseId === courseId && p.studentId === currentUser.id);
            if (progressIndex > -1) {
                return prev.map((p, index) => index === progressIndex ? { ...p, quizScore: score } : p);
            } else {
                const newProgress: StudentProgress = { courseId, studentId: currentUser.id, completedModules: [], quizScore: score, assignmentStatus: 'pending' };
                return [...prev, newProgress];
            }
        });

        const newNotification: Notification = { 
            id: `notif-${Date.now()}`, 
            recipientId: currentUser.id, 
            message: `You scored ${score}% on the quiz!`, 
            createdAt: new Date(), 
            read: false,
            type: 'course',
            link: 'courses'
        };
        handleSetNotifications(prev => [...prev, newNotification]);
        setToast({ message: newNotification.message, type: 'success' });
    }, [currentUser, handleStudentProgressUpdate, handleSetNotifications]);
    
    const handleAssignmentSubmit = useCallback(async (courseId: string, submission: { text: string; file?: File }) => {
        if (!currentUser) return;
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
    
        let fileUrl: string | undefined = undefined;
        let fileName: string | undefined = undefined;
    
        if (submission.file) {
            const fileId = `assignment-file-${courseId}-${currentUser.id}-${Date.now()}`;
            try {
                // Reusing video storage for generic files. A more robust solution
                // would have a separate store or handle different file types.
                await db.saveVideo(fileId, submission.file);
                fileUrl = `indexeddb://${fileId}`;
                fileName = submission.file.name;
            } catch (error) {
                console.error("Failed to save assignment file:", error);
                setToast({ message: 'Error uploading file. Please try again.', type: 'error' });
                return;
            }
        }
    
        handleStudentProgressUpdate(prev =>
            prev.map(p =>
                p.courseId === courseId && p.studentId === currentUser.id
                    ? {
                        ...p,
                        submissionText: submission.text,
                        assignmentStatus: 'submitted',
                        submissionFileUrl: fileUrl,
                        submissionFileName: fileName,
                      }
                    : p
            )
        );
    
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: course.instructorId,
            message: `${currentUser.name} has submitted the assignment for "${course.title}".`,
            createdAt: new Date(),
            read: false,
            type: 'course',
            link: 'courses',
        };
        handleSetNotifications(prev => [...prev, newNotification]);
        setToast({ message: "Assignment submitted successfully!", type: 'success' });
    }, [currentUser, courses, handleStudentProgressUpdate, handleSetNotifications]);
    
    const handleGradeAssignment = useCallback((courseId: string, studentId: string, grade: number, feedback: string) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        handleStudentProgressUpdate(prev =>
            prev.map(p =>
                p.courseId === courseId && p.studentId === studentId
                    ? { ...p, grade, feedback, assignmentStatus: 'graded' }
                    : p
            )
        );

        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: studentId,
            message: `Your assignment for "${course.title}" has been graded.`,
            createdAt: new Date(),
            read: false,
            type: 'course',
            link: 'courses',
        };
        handleSetNotifications(prev => [...prev, newNotification]);
    }, [courses, handleStudentProgressUpdate, handleSetNotifications]);

    const handleRateCourse = useCallback(async (courseId: string, rating: number) => {
        if (!currentUser) return;
        
        let newProgressState: StudentProgress[] = [];
        setStudentProgress(prev => {
            const progressIndex = prev.findIndex(p => p.courseId === courseId && p.studentId === currentUser!.id);
            if (progressIndex > -1) {
                newProgressState = prev.map((p, index) => index === progressIndex ? { ...p, rating } : p);
                return newProgressState;
            }
            return prev;
        });
        await db.saveStudentProgress(newProgressState);

        const updatedCourses = courses.map(c => c.id === courseId ? {...c, rating: ((c.rating || 0) * (c.totalRatings || 0) + rating) / ((c.totalRatings || 0) + 1), totalRatings: (c.totalRatings || 0) + 1} : c);

        try {
            await db.saveCourses(updatedCourses);
            setCourses(updatedCourses);
        } catch (e: any) {
            if (e.name === 'QuotaExceededError') {
                setToast({ message: 'Storage limit exceeded. Course rating could not be saved.', type: 'error' });
            } else {
                setToast({ message: 'An unexpected error occurred while saving the rating.', type: 'error' });
            }
        }
    }, [currentUser, courses]);

    const handleSendMessage = async (text: string) => {
        if (!currentUser) return;
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            user: currentUser,
            timestamp: new Date(),
            text,
        };
        const updatedMessages = [...chatMessages, newMessage];
        await db.saveChatMessages(updatedMessages);
        setChatMessages(updatedMessages);
    };

    const handleCreateLiveSession = async (sessionData: NewLiveSession) => {
        const newSession: LiveSession = {
            ...sessionData,
            id: `ls-${Date.now()}`,
            dateTime: new Date(sessionData.dateTime),
            attendeeIds: [],
        };
        const updatedSessions = [...liveSessions, newSession];
        await db.saveLiveSessions(updatedSessions);
        setLiveSessions(updatedSessions);
    };
    
    const handleDeleteLiveSession = async (sessionId: string) => {
        const updatedSessions = liveSessions.filter(s => s.id !== sessionId);
        await db.saveLiveSessions(updatedSessions);
        setLiveSessions(updatedSessions);
    };
    
    const handleUpdateUser = async (userData: {name: string, role: UserRole, id?: string}) => {
        if (userData.id) {
            const updatedUsers = users.map(u => u.id === userData.id ? { ...u, name: userData.name, role: userData.role } : u);
            await db.saveUsers(updatedUsers);
            setUsers(updatedUsers);
        }
    };
    
    const handleDeleteUser = async (userId: string) => {
        const updatedUsers = users.filter(u => u.id !== userId);
        await db.saveUsers(updatedUsers);
        setUsers(updatedUsers);
    };
    
    const handleCreateOneToOne = async (studentId: string, instructorId: string, dateTime: Date) => {
        if (!currentUser) return;
        
        const conflictWindow = 60 * 60 * 1000; // 1 hour in milliseconds
        const newTime = dateTime.getTime();

        const hasConflict = oneToOneSessions.some(session => 
            session.status === 'scheduled' &&
            (session.studentId === studentId || session.instructorId === instructorId) &&
            Math.abs(newTime - new Date(session.dateTime).getTime()) < conflictWindow
        );

        if (hasConflict) {
            setToast({ message: 'Scheduling conflict detected. The instructor or student is unavailable at this time.', type: 'error' });
            return;
        }

        const newSession: OneToOneSession = {
            id: `oto-${Date.now()}`,
            studentId,
            instructorId,
            dateTime,
            status: 'pending',
            requestedById: currentUser.id,
        };
        const updatedSessions = [...oneToOneSessions, newSession];
        await db.saveOneToOneSessions(updatedSessions);
        setOneToOneSessions(updatedSessions);

        const student = users.find(u => u.id === studentId);
        const instructor = users.find(u => u.id === instructorId);

        if (student && instructor) {
            const dateString = dateTime.toLocaleString();
            const recipientId = currentUser.id === student.id ? instructor.id : student.id;
            const message = `New 1-on-1 session request from ${currentUser.name} for ${dateString}.`;

            await handleSetNotifications(prev => [...prev, {
                id: `notif-${Date.now()}-recipient`,
                recipientId,
                message,
                createdAt: new Date(),
                read: false,
                type: 'session',
                link: 'sessions'
            }]);
            setToast({ message: 'Session request sent successfully.', type: 'success' });
        }
    };
    
    const handleUpdateOneToOne = async (sessionId: string, studentId: string, instructorId: string, dateTime: Date) => {
        const updatedSessions = oneToOneSessions.map(s => s.id === sessionId ? {...s, studentId, instructorId, dateTime} : s);
        await db.saveOneToOneSessions(updatedSessions);
        setOneToOneSessions(updatedSessions);
    };

    const handleCancelOneToOne = async (sessionId: string) => {
        const sessionToCancel = oneToOneSessions.find(s => s.id === sessionId);
        if (!sessionToCancel) return;

        const updatedSessions = oneToOneSessions.map(s => s.id === sessionId ? {...s, status: 'canceled' as const} : s);
        await db.saveOneToOneSessions(updatedSessions);
        setOneToOneSessions(updatedSessions);
        
        if (sessionToCancel.status === 'scheduled' && currentUser) {
             const student = users.find(u => u.id === sessionToCancel.studentId);
             const instructor = users.find(u => u.id === sessionToCancel.instructorId);
             if (!student || !instructor) return;

             const recipientId = currentUser.id === student.id ? instructor.id : student.id;
             const message = `Your session with ${currentUser.name} for ${new Date(sessionToCancel.dateTime).toLocaleString()} has been canceled.`;
             await handleSetNotifications(prev => [...prev, {
                id: `notif-${Date.now()}-cancel`, recipientId, message,
                createdAt: new Date(), read: false, type: 'session', link: 'sessions'
            }]);
        }
         setToast({ message: sessionToCancel.status === 'pending' ? 'Session request withdrawn.' : 'Session canceled.', type: 'success' });
    };

    const handleAcceptSession = async (sessionId: string) => {
        let session: OneToOneSession | undefined;
        const updatedSessions = oneToOneSessions.map(s => {
            if (s.id === sessionId) {
                session = { ...s, status: 'scheduled' };
                return session;
            }
            return s;
        });
        await db.saveOneToOneSessions(updatedSessions);
        setOneToOneSessions(updatedSessions);

        if (session && currentUser) {
            const dateString = new Date(session.dateTime).toLocaleString();
            const recipientId = session.requestedById;
            const confirmationMessage = `${currentUser.name} has confirmed your session request for ${dateString}.`;
            
            await handleSetNotifications(prev => [...prev, {
                id: `notif-${Date.now()}-recipient`, recipientId, message: confirmationMessage,
                createdAt: new Date(), read: false, type: 'session', link: 'sessions'
            }]);

            setToast({ message: 'Session confirmed!', type: 'success' });
        }
    };

    const handleRejectSession = async (sessionId: string) => {
        let session: OneToOneSession | undefined;
        const updatedSessions = oneToOneSessions.map(s => {
            if (s.id === sessionId) {
                session = { ...s, status: 'rejected' };
                return session;
            }
            return s;
        });
        await db.saveOneToOneSessions(updatedSessions);
        setOneToOneSessions(updatedSessions);

         if (session && currentUser) {
            const recipientId = session.requestedById;
            const rejectionMessage = `${currentUser.name} has rejected your session request for ${new Date(session.dateTime).toLocaleString()}.`;
            
            await handleSetNotifications(prev => [...prev, {
                id: `notif-${Date.now()}-recipient`, recipientId, message: rejectionMessage,
                createdAt: new Date(), read: false, type: 'session', link: 'sessions'
            }]);

            setToast({ message: 'Session request rejected.', type: 'success' });
        }
    };


    const handleEnrollInCourse = useCallback(async (courseId: string, enrollmentData: { phoneNumber: string; address: string; }) => {
        if (!currentUser) return;

        const updatedUsers = users.map(user => 
            user.id === currentUser.id 
                ? { ...user, ...enrollmentData } 
                : user
        );
        await db.saveUsers(updatedUsers);
        setUsers(updatedUsers);
        setCurrentUser(prevUser => prevUser ? { ...prevUser, ...enrollmentData } : null);

        handleStudentProgressUpdate(prev => {
            const alreadyEnrolled = prev.some(p => p.courseId === courseId && p.studentId === currentUser.id);
            if (alreadyEnrolled) return prev;
            const newProgress: StudentProgress = { courseId, studentId: currentUser.id, completedModules: [], quizScore: null, assignmentStatus: 'pending' };
            return [...prev, newProgress];
        });
        
        const course = courses.find(c => c.id === courseId);
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: currentUser.id,
            message: `You have successfully enrolled in "${course?.title}"!`,
            createdAt: new Date(),
            read: false,
            type: 'course',
            link: 'courses',
        };
        await handleSetNotifications(prev => [...prev, newNotification]);
        setToast({ message: newNotification.message, type: 'success' });
    }, [currentUser, users, courses, handleStudentProgressUpdate, handleSetNotifications]);
    
    const handleNotifyInstructorOfCompletion = useCallback((courseId: string) => {
        if (!currentUser) return;
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        handleStudentProgressUpdate(prev => prev.map(p => 
            (p.courseId === courseId && p.studentId === currentUser.id)
                ? { ...p, completionNotified: true }
                : p
        ));

        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: course.instructorId,
            message: `${currentUser.name} has completed the course "${course.title}".`,
            createdAt: new Date(),
            read: false,
            type: 'course',
            link: 'courses',
        };
        handleSetNotifications(prev => [...prev, newNotification]);
    }, [currentUser, courses, handleStudentProgressUpdate, handleSetNotifications]);

    const handleIssueCertificate = useCallback((courseId: string, studentId: string) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        
        handleStudentProgressUpdate(prev => prev.map(p => 
            (p.courseId === courseId && p.studentId === studentId)
                ? { ...p, certificateIssued: true }
                : p
        ));

        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: studentId,
            message: `Congratulations! Your certificate for "${course.title}" has been issued.`,
            createdAt: new Date(),
            read: false,
            type: 'certificate',
            link: 'courses'
        };
        handleSetNotifications(prev => [...prev, newNotification]);
        if (currentUser?.id === studentId) {
            setToast({ message: newNotification.message, type: 'success' });
        }
    }, [currentUser, courses, handleStudentProgressUpdate, handleSetNotifications]);

    const handleRegisterForWebinar = async (sessionId: string) => {
        if (!currentUser) return;
        const session = liveSessions.find(s => s.id === sessionId);
        if (!session) return;
        
        if (session.attendeeIds.includes(currentUser.id)) {
            setToast({ message: "You are already registered for this session.", type: 'error' });
            return;
        }
        
        const updatedSessions = liveSessions.map(s => 
            s.id === sessionId
                ? { ...s, attendeeIds: [...s.attendeeIds, currentUser.id] }
                : s
        );
        await db.saveLiveSessions(updatedSessions);
        setLiveSessions(updatedSessions);

        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            recipientId: currentUser.id,
            message: `You have successfully registered for "${session.title}".`,
            createdAt: new Date(),
            read: false,
            type: 'session',
            link: 'live'
        };
        await handleSetNotifications(prev => [...prev, newNotification]);
        setToast({ message: newNotification.message, type: 'success' });
    };

    const handleUploadWebinarRecording = async (sessionId: string, file: File) => {
        try {
            const videoId = `webinar-rec-${sessionId}-${Date.now()}`;
            await db.saveVideo(videoId, file);
    
            const recordingUrl = `indexeddb://${videoId}`;
    
            const updatedSessions = liveSessions.map(s =>
                s.id === sessionId
                    ? { ...s, recordingUrl }
                    : s
            );
    
            await db.saveLiveSessions(updatedSessions);
            setLiveSessions(updatedSessions);
            setToast({ message: 'Recording uploaded successfully!', type: 'success' });
        } catch (error) {
            console.error("Failed to upload recording:", error);
            setToast({ message: 'Failed to upload recording.', type: 'error' });
            throw error;
        }
    };

    // --- RENDER LOGIC ---
    const renderDashboard = () => {
        if (!currentUser) return null;
        
        const instructors = users.filter(u => u.role === UserRole.Instructor);
        const students = users.filter(u => u.role === UserRole.Student);

        const commonProps = {
            currentUser,
            onLogout: handleLogout,
            notifications,
            setNotifications: handleSetNotifications,
            chatMessages,
            onSendMessage: handleSendMessage,
            allLiveSessions: liveSessions,
            sessions: oneToOneSessions,
            instructors,
            students,
            users,
            whatsAppPosition,
            setWhatsAppPosition,
            onCreateSession: handleCreateOneToOne,
            onUpdateSession: handleUpdateOneToOne,
            onCancelSession: handleCancelOneToOne,
            onAcceptSession: handleAcceptSession,
            onRejectSession: handleRejectSession,
            onRegisterForWebinar: handleRegisterForWebinar,
        };

        switch (currentUser.role) {
            case UserRole.Student:
                return <StudentDashboard
                    {...commonProps}
                    allCourses={courses}
                    studentProgress={studentProgress}
                    onModuleComplete={handleModuleComplete}
                    onQuizComplete={handleQuizComplete}
                    onAssignmentSubmit={handleAssignmentSubmit}
                    onRateCourse={handleRateCourse}
                    onEnrollInCourse={handleEnrollInCourse}
                    onNotifyInstructorOfCompletion={handleNotifyInstructorOfCompletion}
                />;
            case UserRole.Instructor:
                return <InstructorDashboard
                    {...commonProps}
                    allCourses={courses}
                    studentProgress={studentProgress}
                    onCreateCourse={handleCreateCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onCreateLiveSession={handleCreateLiveSession}
                    onDeleteLiveSession={handleDeleteLiveSession}
                    onIssueCertificate={handleIssueCertificate}
                    onGradeAssignment={handleGradeAssignment}
                    onUploadWebinarRecording={handleUploadWebinarRecording}
                />;
            case UserRole.Admin:
                return <AdminDashboard
                    {...commonProps}
                    allCourses={courses}
                    studentProgress={studentProgress}
                    onCreateCourse={handleCreateCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onCreateLiveSession={handleCreateLiveSession}
                    onDeleteLiveSession={handleDeleteLiveSession}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                    onIssueCertificate={handleIssueCertificate}
                    onGradeAssignment={handleGradeAssignment}
                    onUploadWebinarRecording={handleUploadWebinarRecording}
                />;
            default:
                return <div>Invalid user role.</div>;
        }
    };
    
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {currentUser ? renderDashboard() : <AuthScreen onLogin={handleLogin} onInitiateSignup={handleInitiateSignup} onVerifyOtp={handleVerifyOtpAndSignup} />}
            {currentUser && <WhatsAppFloat position={whatsAppPosition} />}
        </>
    );
};

export default App;