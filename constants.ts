import { User, UserRole, Course, StudentProgress, ChatMessage, LiveSession, OneToOneSession } from './types';

// USERS
export const USERS: User[] = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: UserRole.Student },
    { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', role: UserRole.Student },
    { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com', role: UserRole.Instructor },
    { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com', role: UserRole.Admin },
    { id: 'user-5', name: 'Ethan Hunt', email: 'ethan@example.com', role: UserRole.Instructor },
];

// COURSES
export const COURSES: Course[] = [
    {
        id: 'course-1',
        title: 'Introduction to Stock Trading',
        description: 'Learn the fundamentals of stock trading, from market analysis to risk management.',
        instructorId: 'user-3',
        rating: 4.5,
        totalRatings: 120,
        price: 99.99,
        modules: [
            { id: 'm1-1', title: 'What is the Stock Market?', type: 'text', content: 'The stock market refers to the collection of markets and exchanges where regular activities of buying, selling, and issuance of shares of publicly-held companies take place.', durationMinutes: 15 },
            { id: 'm1-2', title: 'Reading Stock Charts', type: 'video', content: 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', durationMinutes: 10 },
        ],
        quiz: {
            id: 'q1',
            title: 'Fundamentals Quiz',
            questions: [
                { text: 'What does "bull market" mean?', options: ['Prices are falling', 'Prices are rising', 'Prices are stable'], correctAnswerIndex: 1 },
                { text: 'What is a dividend?', options: ['A company expense', 'A loan to the company', 'A distribution of profits to shareholders'], correctAnswerIndex: 2 },
            ]
        },
        assignment: {
            id: 'assign-1',
            courseId: 'course-1',
            title: 'Market Analysis Paper',
            prompt: 'Write a 500-word paper analyzing the recent performance of a publicly traded company of your choice. Discuss its stock chart patterns, recent news, and future outlook.',
            submissionDeadline: new Date(Date.now() + 86400000 * 14), // 2 weeks from now
            allowMultipleSubmissions: false,
        }
    },
    {
        id: 'course-2',
        title: 'Advanced Options Trading',
        description: 'Master complex options strategies to maximize your returns and hedge your positions.',
        instructorId: 'user-5',
        rating: 4.8,
        totalRatings: 85,
        price: 249.99,
        modules: [
            { id: 'm2-1', title: 'Understanding Calls and Puts', type: 'text', content: 'A call option gives the holder the right to buy a stock and a put option gives the holder the right to sell a stock.', durationMinutes: 20 },
            { id: 'm2-2', title: 'The Iron Condor Strategy', type: 'video', content: 'https://www.youtube.com/embed/JAr2rUbgGJE', durationMinutes: 40 },
        ],
        quiz: {
            id: 'q2',
            title: 'Options Strategy Quiz',
            questions: [
                { text: 'An Iron Condor is a...', options: ['Bullish strategy', 'Bearish strategy', 'Neutral strategy'], correctAnswerIndex: 2 },
            ]
        }
    }
];

// STUDENT PROGRESS
export const STUDENT_PROGRESS: StudentProgress[] = [
    { 
        courseId: 'course-1',
        studentId: 'user-1',
        completedModules: ['m1-1'],
        quizScore: null,
        assignmentStatus: 'pending',
        completionNotified: false,
        certificateIssued: false,
    }
];

// CHAT MESSAGES
export const CHAT_MESSAGES: ChatMessage[] = [
    { id: 'msg-1', user: USERS[2], timestamp: new Date(Date.now() - 60000 * 5), text: 'Welcome to the community chat!' },
    { id: 'msg-2', user: USERS[0], timestamp: new Date(Date.now() - 60000 * 4), text: 'Hi everyone! Glad to be here.' },
    { id: 'msg-3', user: USERS[1], timestamp: new Date(Date.now() - 60000 * 3), text: 'Looking forward to the advanced course.' },
];

// LIVE SESSIONS
export const LIVE_SESSIONS: LiveSession[] = [
    { id: 'ls-1', title: 'Weekly Market Analysis', description: 'Join us for a live breakdown of this week\'s market trends and what to look out for.', instructorId: 'user-3', dateTime: new Date(Date.now() + 86400000 * 2), price: 19.99, attendeeIds: ['user-1'] },
    { id: 'ls-2', title: 'Q&A with a Pro Trader', description: 'Ask your most pressing trading questions to an experienced professional.', instructorId: 'user-5', dateTime: new Date(Date.now() + 86400000 * 5), price: 0, attendeeIds: [] }
];

// 1-on-1 SESSIONS
export const ONE_TO_ONE_SESSIONS: OneToOneSession[] = [
    { id: 'oto-1', studentId: 'user-1', instructorId: 'user-3', dateTime: new Date(Date.now() + 86400000 * 3), status: 'scheduled', requestedById: 'user-3' },
    { id: 'oto-2', studentId: 'user-2', instructorId: 'user-5', dateTime: new Date(Date.now() - 86400000 * 1), status: 'completed', requestedById: 'user-2' },
    { id: 'oto-3', studentId: 'user-1', instructorId: 'user-5', dateTime: new Date(Date.now() + 86400000 * 4), status: 'pending', requestedById: 'user-1' },
];