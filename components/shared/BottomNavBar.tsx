

import React from 'react';
import { User, UserRole } from '../../types';
import { HomeIcon, BookOpenIcon, UserGroupIcon, ChatBubbleLeftRightIcon, PresentationChartBarIcon, VideoCameraIcon, UsersIcon } from '../icons/Icons';

interface BottomNavBarProps {
  user: User;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
      isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'
    }`}
  >
    {icon}
    <span className="mt-1">{label}</span>
  </button>
);

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ user, currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'courses', label: 'Classes', icon: <BookOpenIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'live', label: 'Live', icon: <VideoCameraIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'sessions', label: '1-on-1', icon: <UsersIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'community', label: 'Community', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'analytics', label: 'Analytics', icon: <PresentationChartBarIcon className="w-6 h-6" />, roles: [UserRole.Admin] },
    { id: 'users', label: 'Users', icon: <UserGroupIcon className="w-6 h-6" />, roles: [UserRole.Admin] },
  ];
  
  const availableNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
      <div className="flex justify-around">
        {availableNavItems.map(item => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={currentPage === item.id}
            onClick={() => setCurrentPage(item.id)}
          />
        ))}
      </div>
    </div>
  );
};
