import { USERS, COURSES, STUDENT_PROGRESS, CHAT_MESSAGES, LIVE_SESSIONS, ONE_TO_ONE_SESSIONS } from './constants';
import { User, Course, StudentProgress, Notification, ChatMessage, LiveSession, OneToOneSession } from './types';

const SIMULATED_LATENCY = 300; // ms

const KEYS = {
  USERS: 'lms_users',
  COURSES: 'lms_courses',
  STUDENT_PROGRESS: 'lms_student_progress',
  NOTIFICATIONS: 'lms_notifications',
  CHAT_MESSAGES: 'lms_chat_messages',
  LIVE_SESSIONS: 'lms_live_sessions',
  ONE_TO_ONE_SESSIONS: 'lms_one_to_one_sessions',
};

// --- LocalStorage for structured data ---
const get = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        if (item) {
            // JSON reviver to correctly parse date strings back into Date objects
            return JSON.parse(item, (k, v) => {
                if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)) {
                    return new Date(v);
                }
                return v;
            });
        }
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        localStorage.removeItem(key);
    }
    return defaultValue;
};

const set = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        throw error;
    }
};

const simulateRequest = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), SIMULATED_LATENCY);
    });
};

export const mockApi = {
    initializeDB: (): Promise<void> => {
        if (!localStorage.getItem(KEYS.USERS)) set(KEYS.USERS, USERS);
        if (!localStorage.getItem(KEYS.COURSES)) set(KEYS.COURSES, COURSES);
        if (!localStorage.getItem(KEYS.STUDENT_PROGRESS)) set(KEYS.STUDENT_PROGRESS, STUDENT_PROGRESS);
        if (!localStorage.getItem(KEYS.CHAT_MESSAGES)) set(KEYS.CHAT_MESSAGES, CHAT_MESSAGES);
        if (!localStorage.getItem(KEYS.LIVE_SESSIONS)) set(KEYS.LIVE_SESSIONS, LIVE_SESSIONS);
        if (!localStorage.getItem(KEYS.ONE_TO_ONE_SESSIONS)) set(KEYS.ONE_TO_ONE_SESSIONS, ONE_TO_ONE_SESSIONS);
        if (!localStorage.getItem(KEYS.NOTIFICATIONS)) set(KEYS.NOTIFICATIONS, []);
        return simulateRequest(undefined as void);
    },

    getUsers: (): Promise<User[]> => simulateRequest(get(KEYS.USERS, [])),
    saveUsers: (data: User[]): Promise<void> => { set(KEYS.USERS, data); return simulateRequest(undefined as void) },
    
    getCourses: (): Promise<Course[]> => simulateRequest(get(KEYS.COURSES, [])),
    saveCourses: (data: Course[]): Promise<void> => { set(KEYS.COURSES, data); return simulateRequest(undefined as void) },

    getStudentProgress: (): Promise<StudentProgress[]> => simulateRequest(get(KEYS.STUDENT_PROGRESS, [])),
    saveStudentProgress: (data: StudentProgress[]): Promise<void> => { set(KEYS.STUDENT_PROGRESS, data); return simulateRequest(undefined as void) },

    getNotifications: (): Promise<Notification[]> => simulateRequest(get(KEYS.NOTIFICATIONS, [])),
    saveNotifications: (data: Notification[]): Promise<void> => { set(KEYS.NOTIFICATIONS, data); return simulateRequest(undefined as void) },

    getChatMessages: (): Promise<ChatMessage[]> => simulateRequest(get(KEYS.CHAT_MESSAGES, [])),
    saveChatMessages: (data: ChatMessage[]): Promise<void> => { set(KEYS.CHAT_MESSAGES, data); return simulateRequest(undefined as void) },

    getLiveSessions: (): Promise<LiveSession[]> => simulateRequest(get(KEYS.LIVE_SESSIONS, [])),
    saveLiveSessions: (data: LiveSession[]): Promise<void> => { set(KEYS.LIVE_SESSIONS, data); return simulateRequest(undefined as void) },

    getOneToOneSessions: (): Promise<OneToOneSession[]> => simulateRequest(get(KEYS.ONE_TO_ONE_SESSIONS, [])),
    saveOneToOneSessions: (data: OneToOneSession[]): Promise<void> => { set(KEYS.ONE_TO_ONE_SESSIONS, data); return simulateRequest(undefined as void) },
};
