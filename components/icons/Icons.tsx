
import React from 'react';

export const IconBase: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {props.children}
  </svg>
);

export const AcademicCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.376-1.884a1.125 1.125 0 010-1.991l15.482-8.662a1.125 1.125 0 011.125 0l15.482 8.662a1.125 1.125 0 010 1.991l-3.376 1.884m-15.482 0l15.482 0" /></IconBase>
);
export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></IconBase>
);
export const VideoCameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></IconBase>
);
export const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.928A3 3 0 017.5 12.5m3 3.72a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72M12 12c-1.487 0-2.731.662-3.616 1.67a3.003 3.003 0 01-1.215-2.254M12 12c1.487 0 2.731.662 3.616 1.67a3.003 3.003 0 001.215-2.254M12 12a3 3 0 01-3-3m3 3a3 3 0 003-3m-3 3a3 3 0 01-3 3m3-3a3 3 0 003 3m0 0c1.11.278 2.03.834 2.741 1.52m-3.35-3.35a3 3 0 01-3.35 3.35m3.35-3.35a3 3 0 00-3.35 3.35m0 0c1.11-.278 2.03-.834 2.741-1.52m-4.682 4.682a3 3 0 01-4.682-2.72m-3.35 3.35a3 3 0 00-3.35-3.35m3.35 3.35a3 3 0 013.35-3.35m0 0c-1.11.278-2.03.834-2.741 1.52m4.682 4.682a3 3 0 014.682 2.72" /></IconBase>
);
export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663l.001.001zm-3.125-4.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></IconBase>
);
export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></IconBase>
);
export const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.28c-1.131.084-2.18-.4-2.688-1.332a18.726 18.726 0 00-2.602-3.115c-.533-.46-1.197-.74-1.903-.74H8.25c-1.056 0-1.908-.853-1.908-1.908v-4.286c0-1.056.852-1.908 1.908-1.908h.384a18.726 18.726 0 012.602-3.115c.508-.932 1.557-1.416 2.688-1.332l3.722.28c1.131.085 1.98.957 1.98 2.097v3.192zM15.75 9.75a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z" /></IconBase>
);
export const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.578 0c-.275.046-.55.097-.824.15l-2.122 5.292A2.25 2.25 0 004.58 12.358h14.84a2.25 2.25 0 002.13-2.316l-2.122-5.292a48.107 48.107 0 00-3.478-.397m-12.578 0c-.275.046-.55.097-.824.15M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconBase>
);
export const CalendarDaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></IconBase>
);
export const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></IconBase>
);
export const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></IconBase>
);
export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></IconBase>
);
export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></IconBase>
);
export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></IconBase>
);
export const ArrowRightOnRectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></IconBase>
);
export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" /></IconBase>
);
export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></IconBase>
);
export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.32 1.011l-4.2 4.03a.563.563 0 00-.162.524l1.28 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.28-5.385a.563.563 0 00-.162-.524l-4.2-4.03a.563.563 0 01.32-1.011l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></IconBase>
);
export const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
    <path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm7.5 18.4a2 2 0 0 1-1.8 1.5h-.3a3.6 3.6 0 0 1-3.2-1.8c-.4-.6-.8-1.2-1.7-2.1l-.2-.2a7.1 7.1 0 0 1-2.4-1.6 8.3 8.3 0 0 1-2-2.6l-.1-.2a4.4 4.4 0 0 1-.3-2.1V12a2 2 0 0 1 .6-1.5 2 2 0 0 1 1.5-.6h.3a1.4 1.4 0 0 1 1 .4l.1.1.2.3a1.4 1.4 0 0 1 .2.4 1.3 1.3 0 0 1 0 .6v.4l-.2.4-.2.4-.1.1c-.2.2-.4.5-.7.7l-.3.3-.2.1a.7.7 0 0 0 0 1.2c.1 0 .2.1.4.2l.4.2.5.3.6.4c.6.4 1.2 1 1.8 1.5s1.2 1.2 1.8 1.8a5.3 5.3 0 0 0 2.2 1.8h.4a1.4 1.4 0 0 0 1.1-.7l.1-.1a2.1 2.1 0 0 0 .1-1.3V18a1.3 1.3 0 0 0-.2-.6 1.6 1.6 0 0 0-.5-.5h-.1l-.2-.1a1.6 1.6 0 0 1-1.3-.4 1.2 1.2 0 0 1-.4-1.1V15a1.2 1.2 0 0 1 .3-1 1.6 1.6 0 0 1 1.1-.4h.1a1.5 1.5 0 0 1 1.2.6 1.7 1.7 0 0 1 .5 1.3v.3a2.3 2.3 0 0 1-.5 1.5 2.7 2.7 0 0 1-1 1Z" />
  </svg>
);
export const Cog6ToothIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5M12 9.75v.01M12 12v.01M12 14.25v.01M4.5 12a7.5 7.5 0 0115 0" /></IconBase>
);
export const PresentationChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></IconBase>
);
export const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></IconBase>
);
export const ArrowsPointingOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m4.5 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></IconBase>
);
export const ArrowsPointingInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" /></IconBase>
);
export const DocumentPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3h-6m-1.125-6.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" /></IconBase>
);
export const DocumentArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.158 10.192l-1.077 1.077a.563.563 0 01-.8 0l-1.077-1.077m2.954 0H9.158c-.356 0-.69-.07-1.003-.205a2.25 2.25 0 01-1.58-1.58c-.135-.313-.205-.647-.205-1.003V10.5m4.242 4.242h2.252a2.25 2.25 0 002.25-2.25V10.5m-3 4.5V13.5m0 0l-1.5 1.5m1.5-1.5l1.5 1.5" /></IconBase>
);