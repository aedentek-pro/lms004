


import React from 'react';
import { User, UserRole } from '../../types';
import { HomeIcon, AcademicCapIcon, UserGroupIcon, ChatBubbleLeftRightIcon, ArrowRightOnRectangleIcon, UserCircleIcon, CalendarDaysIcon } from '../icons/Icons';

interface SideNavBarProps {
  user: User;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const SideNavBar: React.FC<SideNavBarProps> = ({ user, currentPage, setCurrentPage, onLogout }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'courses', label: 'Classes', icon: <AcademicCapIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'live', label: 'Live', icon: <CalendarDaysIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'sessions', label: '1-on-1 Sessions', icon: <UserGroupIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'community', label: 'Community', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, roles: [UserRole.Student, UserRole.Instructor, UserRole.Admin] },
    { id: 'users', label: 'User Management', icon: <UserCircleIcon className="w-6 h-6" />, roles: [UserRole.Admin] },
  ];

  const availableNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <nav className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4">
      <div className="flex items-center mb-8">
        <AcademicCapIcon className="h-10 w-10 text-indigo-600"/>
        <span className="text-xl font-bold text-slate-800 ml-2">Purple LMS</span>
      </div>
      <div className="flex-1 space-y-2">
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
      <div className="mt-auto">
        <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
          <ArrowRightOnRectangleIcon className="w-6 h-6"/>
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </nav>
  );
};