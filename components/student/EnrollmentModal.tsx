import React, { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { Course, User } from '../../types';
import { CheckCircleIcon } from '../icons/Icons';

interface EnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (enrollmentData: { phoneNumber: string; address: string }) => void;
    course: Course | null;
    user: User | null;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose, onSubmit, course, user }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState('Razorpay');

    useEffect(() => {
        if (user) {
            setPhoneNumber(user.phoneNumber || '');
            setAddress(user.address || '');
        }
        // Reset state on modal open/close
        setIsProcessing(false);
        setPaymentComplete(false);
        setSelectedGateway('Razorpay');
    }, [user, isOpen]);

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber || !address) {
            alert('Please fill out your personal details.');
            return;
        }

        // If the course is free, just submit.
        if (!course?.price || course.price <= 0) {
            onSubmit({ phoneNumber, address });
            return;
        }

        // Simulate payment processing
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentComplete(true);
            // After successful "payment", submit the enrollment data
            setTimeout(() => {
                onSubmit({ phoneNumber, address });
            }, 1500); // Give user a moment to see the success message
        }, 2000);
    };

    if (!course || !user) return null;

    const isPaidCourse = course.price != null && course.price > 0;
    const paymentGateways = ['Razorpay', 'Stripe', 'PayPal', 'Coinbase Commerce'];


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Enroll in: ${course.title}`}>
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                 <div>
                    <h3 className="text-lg font-semibold text-slate-800">1. Personal Details</h3>
                    <p className="text-sm text-slate-500 mb-4">Please confirm or update your personal details.</p>
                    <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                        <div>
                            <label htmlFor="enroll-phone" className="block mb-2 text-sm font-medium text-slate-700">Phone Number</label>
                            <input
                                id="enroll-phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="e.g., (123) 456-7890"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="enroll-address" className="block mb-2 text-sm font-medium text-slate-700">Mailing Address</label>
                            <textarea
                                id="enroll-address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="w-full p-2 border rounded-md"
                                placeholder="e.g., 123 Main St, Anytown, USA"
                                required
                            />
                        </div>
                    </div>
                </div>

                {isPaidCourse && (
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">2. Select Payment Method</h3>
                        <p className="text-sm text-slate-500 mb-4">Choose your preferred payment gateway.</p>
                         <div className="grid grid-cols-2 gap-4">
                            {paymentGateways.map((gateway) => (
                                <button
                                    key={gateway}
                                    type="button"
                                    onClick={() => setSelectedGateway(gateway)}
                                    className={`p-4 border rounded-lg text-left transition-all duration-200 relative ${
                                        selectedGateway === gateway
                                            ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-md'
                                            : 'border-slate-300 hover:border-indigo-400 hover:shadow-sm'
                                    }`}
                                >
                                    <p className="font-semibold text-slate-800">{gateway}</p>
                                    {selectedGateway === gateway && (
                                        <CheckCircleIcon className="w-6 h-6 text-indigo-600 absolute top-2 right-2"/>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                <div className="flex justify-end items-center space-x-4 pt-4 border-t border-slate-200">
                    {isPaidCourse && <span className="text-xl font-bold text-slate-800">Total: ${course.price.toFixed(2)}</span>}
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50" disabled={isProcessing}>Cancel</button>
                    <button
                        type="submit"
                        className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${paymentComplete ? 'bg-teal-600' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'} disabled:opacity-50 flex items-center`}
                        disabled={isProcessing || paymentComplete}
                    >
                        {isProcessing ? (
                            <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...</>
                        ) : paymentComplete ? (
                            'Enrolling...'
                        ) : isPaidCourse ? (
                             'Pay & Enroll'
                        ) : (
                            'Confirm Enrollment'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};