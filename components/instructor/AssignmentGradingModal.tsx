import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Assignment } from '../../types';
import { db } from '../../db';
import { DocumentArrowDownIcon } from '../icons/Icons';

interface AssignmentGradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (grade: number, feedback: string) => void;
    studentName: string;
    assignment: Assignment;
    submissionText?: string;
    submissionFileUrl?: string;
    submissionFileName?: string;
}

export const AssignmentGradingModal: React.FC<AssignmentGradingModalProps> = ({ isOpen, onClose, onSubmit, studentName, assignment, submissionText, submissionFileUrl, submissionFileName }) => {
    const [grade, setGrade] = useState<number | ''>('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (grade === '' || grade < 0 || grade > 100) {
            alert('Please enter a valid grade between 0 and 100.');
            return;
        }
        onSubmit(Number(grade), feedback);
        setGrade('');
        setFeedback('');
        onClose();
    };
    
    const handleCancel = () => {
        setGrade('');
        setFeedback('');
        onClose();
    };

    const handleDownload = async () => {
        if (!submissionFileUrl) return;
        const fileId = submissionFileUrl.replace('indexeddb://', '');
        try {
            const fileBlob = await db.getVideo(fileId); // Reusing video getter
            if (fileBlob) {
                const url = URL.createObjectURL(fileBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = submissionFileName || 'submission';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('File not found.');
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download file.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} title={`Grade Assignment for ${studentName}`}>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md border">{assignment.prompt}</p>
                </div>
                <hr/>
                <div>
                    <h3 className="font-semibold text-gray-800">Student's Submission</h3>
                    {submissionText && (
                        <p className="text-gray-700 mt-1 p-3 bg-white rounded-md border whitespace-pre-wrap">{submissionText}</p>
                    )}
                    {submissionFileUrl && (
                         <div className="mt-2 p-3 bg-white rounded-md border flex justify-between items-center">
                            <p className="text-sm text-gray-700 truncate">{submissionFileName}</p>
                            <button onClick={handleDownload} className="flex items-center px-3 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200">
                                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                                Download File
                            </button>
                        </div>
                    )}
                </div>
                <hr/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade (0-100)</label>
                        <input
                            type="number"
                            id="grade"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value === '' ? '' : parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            min="0"
                            max="100"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                         <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">Feedback (Optional)</label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Provide constructive feedback..."
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Submit Grade</button>
                </div>
            </div>
        </Modal>
    );
};