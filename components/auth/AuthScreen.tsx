import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { AcademicCapIcon, EnvelopeIcon, LockClosedIcon, UserIcon, ArrowRightOnRectangleIcon } from '../icons/Icons';
import { Card } from '../shared/Card';

interface AuthScreenProps {
  onLogin: (email: string) => User | null;
  onInitiateSignup: (name: string, email: string, role: UserRole) => boolean;
  onVerifyOtp: (otp: string) => Promise<boolean>;
}

const WelcomePanel: React.FC = () => (
  <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-white text-center">
    <AcademicCapIcon className="h-24 w-24 mb-6"/>
    <h1 className="text-4xl font-bold">Welcome to Purple LMS</h1>
    <p className="mt-4 text-lg text-indigo-100">Unlock Your Trading Potential. Learn, Grow, and Succeed in the Financial Markets.</p>
  </div>
);

interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ id, type, label, value, onChange, icon }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
      {icon}
    </div>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      className="peer block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
      placeholder=" " // Important: must not be empty!
      required
    />
    <label
      htmlFor={id}
      className="absolute text-base text-slate-500 duration-300 transform -translate-y-5 scale-75 top-4 z-10 origin-[0] bg-white px-2 left-8
                 peer-focus:text-violet-600
                 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-10
                 pointer-events-none"
    >
      {label}
    </label>
  </div>
);

const OtpInput: React.FC<{ otp: string; setOtp: (otp: string) => void }> = ({ otp, setOtp }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setOtp(value.slice(0, 6));
    };

    return (
        <div className="relative">
            <input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={handleChange}
                maxLength={6}
                className="block w-full text-center text-3xl tracking-[1em] py-3 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                autoComplete="off"
                required
            />
        </div>
    );
};

const DemoAccounts: React.FC<{ onDemoLogin: (email: string) => void }> = ({ onDemoLogin }) => {
    const demoUsers = [
        { role: 'Student', email: 'alice@example.com' },
        { role: 'Instructor', email: 'charlie@example.com' },
        { role: 'Admin', email: 'diana@example.com' },
    ];

    return (
        <div className="mt-8 pt-6 border-t">
            <h3 className="text-center text-slate-600 font-semibold mb-4">Demo Accounts</h3>
            <div className="grid grid-cols-1 gap-3">
                {demoUsers.map(user => (
                    <Card key={user.role} className="p-3 bg-slate-50 hover:bg-slate-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-sm text-slate-700">{user.role}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onDemoLogin(user.email)}
                                className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800"
                            >
                                Login <ArrowRightOnRectangleIcon className="w-4 h-4 ml-1"/>
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};


export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onInitiateSignup, onVerifyOtp }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>(UserRole.Student);
  
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const [error, setError] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (signupStep === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [signupStep, countdown]);
  

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = onLogin(loginEmail);
    if (!user) {
      setError('No account found with that email address.');
    }
  };

  const handleDemoLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123'); // A dummy password for the form
    setError('');
    onLogin(email);
  };


  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (signupName.trim() && signupEmail.trim() && signupPassword.trim()) {
      const success = onInitiateSignup(signupName, signupEmail, signupRole);
      if (success) {
        setSignupStep('otp');
        setCountdown(60);
        setCanResend(false);
      } else {
        setError('An account with this email already exists.');
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
        setError('Please enter a 6-digit OTP.');
        return;
    }
    const success = await onVerifyOtp(otp);
    if (!success) {
        setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    setError('');
    onInitiateSignup(signupName, signupEmail, signupRole);
    setCountdown(60);
    setCanResend(false);
    setOtp('');
  };

  const switchMode = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setSignupStep('details');
    setError('');
    setLoginEmail('');
    setLoginPassword('');
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setOtp('');
  };

  const renderSignupContent = () => {
    if (signupStep === 'otp') {
      return (
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-800 text-center">Verify Your Email</h2>
          <p className="text-center text-slate-500 mt-2 mb-8">
            We sent a 6-digit code to <span className="font-semibold text-slate-700">{signupEmail}</span>. Enter it below to continue.
          </p>
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <OtpInput otp={otp} setOtp={setOtp} />
            <div className="text-center text-sm text-slate-500">
                {canResend ? (
                     <button type="button" onClick={handleResendOtp} className="font-medium text-violet-600 hover:text-violet-500 focus:outline-none">
                        Resend Code
                     </button>
                ) : (
                    <span>Resend code in {countdown}s</span>
                )}
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all">
              Verify & Create Account
            </button>
          </form>
           <p className="mt-8 text-center text-sm text-slate-600">
                <button onClick={() => setSignupStep('details')} className="font-medium text-violet-600 hover:text-violet-500 focus:outline-none">
                  &larr; Back to details
                </button>
              </p>
        </div>
      );
    }

    return (
       <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-800 text-center">Create an Account</h2>
          <p className="text-center text-slate-500 mt-2 mb-8">Join our community of learners.</p>
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            <InputField id="name" type="text" label="Full Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} icon={<UserIcon className="h-5 w-5 text-slate-400"/>} />
            <InputField id="email" type="email" label="Email Address" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} icon={<EnvelopeIcon className="h-5 w-5 text-slate-400"/>} />
            <InputField id="password" type="password" label="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} icon={<LockClosedIcon className="h-5 w-5 text-slate-400"/>} />
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
              <div className="flex space-x-2 rounded-lg bg-slate-100 p-1">
                  {Object.values(UserRole).map(r => (
                      <button
                          type="button"
                          key={r}
                          onClick={() => setSignupRole(r as UserRole)}
                          className={`w-full text-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                              signupRole === r ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                          {r}
                      </button>
                  ))}
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all">
              Continue
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button onClick={() => switchMode('login')} className="font-medium text-violet-600 hover:text-violet-500 focus:outline-none">
              Login
            </button>
          </p>
        </div>
    )
  };

  return (
    <div className="min-h-screen flex bg-white">
      <WelcomePanel />
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <AcademicCapIcon className="h-12 w-12 mx-auto text-violet-600"/>
            <h1 className="text-2xl font-bold text-slate-800 mt-2">Purple LMS</h1>
          </div>

          {authMode === 'login' ? (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-slate-800 text-center">Login</h2>
              <p className="text-center text-slate-500 mt-2 mb-8">Welcome back! Please enter your details.</p>
              <form onSubmit={handleLogin} className="space-y-6">
                <InputField id="email" type="email" label="Email Address" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} icon={<EnvelopeIcon className="h-5 w-5 text-slate-400"/>} />
                <InputField id="password" type="password" label="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} icon={<LockClosedIcon className="h-5 w-5 text-slate-400"/>} />
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-violet-600 hover:text-violet-500">Forgot your password?</a>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all">
                  Login
                </button>
              </form>
              <p className="mt-8 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <button onClick={() => switchMode('signup')} className="font-medium text-violet-600 hover:text-violet-500 focus:outline-none">
                  Sign up
                </button>
              </p>
              <DemoAccounts onDemoLogin={handleDemoLogin} />
            </div>
          ) : (
            renderSignupContent()
          )}
        </div>
      </div>
    </div>
  );
};
