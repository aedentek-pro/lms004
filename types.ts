





export enum UserRole {
    Student = 'Student',
    Instructor = 'Instructor',
    Admin = 'Admin',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phoneNumber?: string;
    address?: string;
}

export interface Question {
    text: string;
    options: string[];
    correctAnswerIndex: number;
}

export interface Quiz {
    id:string;
    title: string;
    questions: Question[];
}

export interface Module {
    id: string;
    title: string;
    type: 'text' | 'video';
    content: string;
    durationMinutes: number;
}

export interface Assignment {
    id: string;
    courseId: string;
    title: string;
    prompt: string;
    submissionDeadline?: Date;
    allowMultipleSubmissions?: boolean;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    modules: Module[];
    quiz: Quiz;
    assignment?: Assignment;
    rating?: number;
    totalRatings?: number;
    price?: number;
}

export type NewQuestion = Omit<Question, 'id'>;
export type NewModule = Omit<Module, 'id'>;

export interface NewCourse {
    id?: string;
    title: string;
    description: string;
    instructorId: string;
    modules: NewModule[];
    quiz: {
        id?: string;
        title: string;
        questions: NewQuestion[];
    };
    assignment?: {
        id?: string;
        title: string;
        prompt: string;
        submissionDeadline?: Date;
        allowMultipleSubmissions?: boolean;
    };
    price?: number;
}

export interface StudentProgress {
    courseId: string;
    studentId: string;
    completedModules: string[];
    quizScore: number | null;
    assignmentStatus: 'pending' | 'submitted' | 'graded';
    submissionText?: string;
    submissionFileUrl?: string;
    submissionFileName?: string;
    grade?: number | null;
    feedback?: string;
    rating?: number;
    completionNotified?: boolean;
    certificateIssued?: boolean;
}

export interface Notification {
    id: string;
    recipientId: string;
    message: string;
    createdAt: Date;
    read: boolean;
    type: 'system' | 'course' | 'certificate' | 'session' | 'announcement';
    link?: string;
}

export interface ChatMessage {
    id: string;
    user: User;
    timestamp: Date;
    text: string;
}

export interface LiveSession {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    dateTime: Date;
    price?: number;
    attendeeIds: string[];
    recordingUrl?: string;
    reminderSent?: boolean;
}

export interface NewLiveSession {
    title: string;
    description: string;
    dateTime: string;
    instructorId: string;
    price?: number;
}

export interface OneToOneSession {
    id: string;
    studentId: string;
    instructorId: string;
    dateTime: Date;
    status: 'pending' | 'scheduled' | 'completed' | 'canceled' | 'rejected';
    requestedById: string;
    reminderSent?: boolean;
}