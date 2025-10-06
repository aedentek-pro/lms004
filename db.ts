import { User, Course, StudentProgress, Notification, ChatMessage, LiveSession, OneToOneSession } from './types';
import { mockApi } from './mockApi';

// --- IndexedDB for Large File Storage (remains client-side) ---

const DB_NAME = 'lms_video_storage';
const STORE_NAME = 'videos';
let dbInstance: IDBDatabase | null = null;

const openVideoDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }
        const request = indexedDB.open(DB_NAME, 1);
        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject('Error opening video database.');
        };
        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
};

const saveVideo = async (id: string, videoBlob: Blob): Promise<void> => {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(videoBlob, id);
        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error('Error saving video to IndexedDB:', request.error);
            reject('Could not save video.');
        };
    });
};

const getVideo = async (id: string): Promise<Blob | null> => {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);
        request.onsuccess = () => {
            resolve(request.result ? (request.result as Blob) : null);
        };
        request.onerror = () => {
            console.error('Error getting video from IndexedDB:', request.error);
            reject('Could not retrieve video.');
        };
    });
};

const deleteVideo = async (id: string): Promise<void> => {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.error('Error deleting video from IndexedDB:', request.error);
            reject('Could not delete video.');
        };
    });
};


export const initializeDB = async () => {
    await mockApi.initializeDB();
};

export const db = {
    // Each function is now an async call to the mock API
    getUsers: (): Promise<User[]> => mockApi.getUsers(),
    saveUsers: (data: User[]): Promise<void> => mockApi.saveUsers(data),
    
    getCourses: (): Promise<Course[]> => mockApi.getCourses(),
    saveCourses: (data: Course[]): Promise<void> => mockApi.saveCourses(data),
    
    getStudentProgress: (): Promise<StudentProgress[]> => mockApi.getStudentProgress(),
    saveStudentProgress: (data: StudentProgress[]): Promise<void> => mockApi.saveStudentProgress(data),
    
    getNotifications: (): Promise<Notification[]> => mockApi.getNotifications(),
    saveNotifications: (data: Notification[]): Promise<void> => mockApi.saveNotifications(data),
    
    getChatMessages: (): Promise<ChatMessage[]> => mockApi.getChatMessages(),
    saveChatMessages: (data: ChatMessage[]): Promise<void> => mockApi.saveChatMessages(data),
    
    getLiveSessions: (): Promise<LiveSession[]> => mockApi.getLiveSessions(),
    saveLiveSessions: (data: LiveSession[]): Promise<void> => mockApi.saveLiveSessions(data),
    
    getOneToOneSessions: (): Promise<OneToOneSession[]> => mockApi.getOneToOneSessions(),
    saveOneToOneSessions: (data: OneToOneSession[]): Promise<void> => mockApi.saveOneToOneSessions(data),
    
    // IndexedDB functions remain as they are, for client-side large file storage
    saveVideo,
    getVideo,
    deleteVideo,
};
