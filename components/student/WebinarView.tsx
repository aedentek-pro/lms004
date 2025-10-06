import React, { useState, useEffect, useRef } from 'react';
import { XCircleIcon } from '../icons/Icons';
import { ChatMessage, User, UserRole } from '../../types';

interface WebinarViewProps {
    onClose: () => void;
    currentUser: User;
}

const MOCK_PARTICIPANT: User = { id: 'participant-bot', name: 'Alex Ray', email: '', role: UserRole.Student };

export const WebinarView: React.FC<WebinarViewProps> = ({ onClose, currentUser }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    // Media stream effect
    useEffect(() => {
        const getMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(`Error accessing media devices: ${err.message}`);
                } else {
                    setError('An unknown error occurred while accessing media devices.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        getMedia();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Simulated chat messages effect
    useEffect(() => {
        const welcomeMessage: ChatMessage = {
            id: 'msg-system-1',
            user: { id: 'system', name: 'System', role: UserRole.Admin, email: '' },
            timestamp: new Date(),
            text: 'Welcome to the session! The chat is now live.',
        };
        setMessages([welcomeMessage]);

        const timer1 = setTimeout(() => {
            setMessages(prev => [...prev, {
                id: 'msg-bot-1',
                user: MOCK_PARTICIPANT,
                timestamp: new Date(),
                text: 'Hello everyone! Excited for this session.'
            }]);
        }, 3000);

        const timer2 = setTimeout(() => {
            setMessages(prev => [...prev, {
                id: 'msg-bot-2',
                user: MOCK_PARTICIPANT,
                timestamp: new Date(),
                text: 'Can we ask questions during the presentation?'
            }]);
        }, 10000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message: ChatMessage = {
                id: `msg-${Date.now()}`,
                user: currentUser,
                timestamp: new Date(),
                text: newMessage,
            };
            setMessages(prev => [...prev, message]);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Video Player Section */}
            <div className="w-full md:w-2/3">
                {isLoading && <p className="text-gray-600">Initializing camera and microphone...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {stream && (
                    <div className="w-full">
                        <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black aspect-video"></video>
                        <div className="mt-4 text-center">
                            <p className="text-lg font-semibold text-slate-800">You are in the session!</p>
                            <p className="text-sm text-slate-500 mb-4">Your camera and microphone are active.</p>
                             <button 
                                onClick={onClose}
                                className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <XCircleIcon className="w-5 h-5 mr-2" />
                                Leave Session
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Section */}
            <div className="w-full md:w-1/3 flex flex-col bg-slate-100 rounded-lg border h-[70vh]">
                <div className="p-3 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800 text-center">Live Chat</h3>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${msg.user.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`order-2 ${msg.user.id === currentUser.id ? 'items-end' : 'items-start'} flex flex-col max-w-[85%]`}>
                                {msg.user.id !== currentUser.id && (
                                    <p className="text-xs text-slate-500 mb-1 px-1">{msg.user.name}</p>
                                )}
                                <div
                                    className={`px-3 py-2 rounded-lg inline-block break-words ${
                                        msg.user.id === currentUser.id
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-slate-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-100 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 text-sm"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};