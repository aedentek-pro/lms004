import React from 'react';
import { Modal } from '../shared/Modal';
import { Assignment, StudentProgress } from '../../types';
import { db } from '../../db';
import { DocumentArrowDownIcon } from '../icons/Icons';

interface AssignmentViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignment: Assignment;
    progress: StudentProgress;
}

const StatusDisplay: React.FC<{ status: StudentProgress['assignmentStatus'] }> = ({ status }) => {
    const statusStyles = {
        submitted: 'bg-blue-100 text-blue-800',
        graded: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
    };
    const currentStatus = status === 'pending' ? 'Not Submitted' : status;
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[status]}`}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </span>
    );
};

export const AssignmentViewModal: React.FC<AssignmentViewModalProps> = ({ isOpen, onClose, assignment, progress }) => {
    
    const handleDownload = async () => {
        if (!progress.submissionFileUrl) return;
        const fileId = progress.submissionFileUrl.replace('indexeddb://', '');
        try {
            const fileBlob = await db.getVideo(fileId); // Reusing video getter
            if (fileBlob) {
                const url = URL.createObjectURL(fileBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = progress.submissionFileName || 'submission';
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
        <Modal isOpen={isOpen} onClose={onClose} title="Your Assignment">
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
                        <StatusDisplay status={progress.assignmentStatus} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-md border">{assignment.prompt}</p>
                </div>

                {(progress.submissionText || progress.submissionFileUrl) && (
                    <hr />
                )}

                {progress.submissionText && (
                    <div>
                        <h3 className="font-semibold text-gray-800">Your Submission Text</h3>
                        <p className="text-gray-700 mt-1 p-3 bg-white rounded-md border whitespace-pre-wrap">{progress.submissionText}</p>
                    </div>
                )}

                 {progress.submissionFileUrl && (
                    <div>
                        <h3 className="font-semibold text-gray-800">Your Submitted File</h3>
                        <div className="mt-1 p-3 bg-white rounded-md border flex justify-between items-center">
                            <p className="text-sm text-gray-700 truncate">{progress.submissionFileName}</p>
                            <button onClick={handleDownload} className="flex items-center px-3 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200">
                                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                                Download
                            </button>
                        </div>
                    </div>
                )}
                
                {progress.assignmentStatus === 'graded' && (
                     <div>
                        <h3 className="font-semibold text-gray-800">Grade & Feedback</h3>
                        <div className="mt-2 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-md">
                            <p className="text-xl font-bold text-indigo-700">Grade: {progress.grade}/100</p>
                            {progress.feedback && (
                                <p className="mt-2 text-sm text-indigo-800">{progress.feedback}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};