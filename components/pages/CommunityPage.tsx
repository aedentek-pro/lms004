import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../shared/Card';
import { ChatMessage, User, UserRole } from '../../types';

interface CommunityPageProps {
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ currentUser, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  const getRoleColor = (role: UserRole) => {
    switch(role) {
        case UserRole.Admin: return 'text-red-500';
        case UserRole.Instructor: return 'text-indigo-600';
        case UserRole.Student: return 'text-green-600';
    }
  }

  const getRoleIndicatorBgColor = (role: UserRole) => {
    switch(role) {
        case UserRole.Admin: return 'bg-red-500';
        case UserRole.Instructor: return 'bg-indigo-600';
        case UserRole.Student: return 'bg-green-600';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Community Chat</h1>
      <Card className="flex flex-col h-[70vh]">
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.user.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`order-2 ${msg.user.id === currentUser.id ? 'items-end' : 'items-start'} flex flex-col max-w-[85%]`}>
                <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${getRoleIndicatorBgColor(msg.user.role)}`}></span>
                    <p className="text-xs">
                        <span className={`font-bold ${getRoleColor(msg.user.role)}`}>{msg.user.name}</span>
                        <span className="ml-2 text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg inline-block break-words ${
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
        <div className="p-4 border-t border-slate-200 bg-white">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Send
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CommunityPage;