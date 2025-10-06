import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Assignment } from '../../types';
import { DocumentPlusIcon, XCircleIcon } from '../icons/Icons';

interface AssignmentSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (submission: { text: string; file?: File }) => void;
    assignment: Assignment;
}

export const AssignmentSubmissionModal: React.FC<AssignmentSubmissionModalProps> = ({ isOpen, onClose, onSubmit, assignment }) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = () => {
        if (!text.trim() && !file) {
            alert('Please enter your submission text or upload a file.');
            return;
        }
        onSubmit({ text, file: file || undefined });
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files ? e.target.files[0] : null);
    };

    const deadlineString = assignment.submissionDeadline ? 
        ` (Due: ${new Date(assignment.submissionDeadline).toLocaleString()})` : '';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${assignment.title}${deadlineString}`}>
            <div className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-800">Assignment Prompt</label>
                    <p className="text-gray-600 p-3 bg-gray-50 rounded-md border">{assignment.prompt}</p>
                </div>
                <div>
                    <label htmlFor="submission-text" className="block mb-2 text-sm font-medium text-gray-700">Your Submission</label>
                    <textarea 
                        id="submission-text"
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        rows={8} 
                        className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="Type your assignment here..."
                    />
                </div>
                 <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Attach a file (optional)</label>
                    {!file ? (
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 border-2 border-dashed border-gray-300 flex justify-center px-6 pt-5 pb-6">
                            <div className="space-y-1 text-center">
                                <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                </div>
                                <p className="text-xs text-gray-500">Any file type up to 50MB</p>
                            </div>
                        </label>
                    ) : (
                        <div className="flex items-center justify-between p-3 bg-gray-100 border rounded-md">
                            <span className="text-sm text-gray-800 truncate">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-gray-500 hover:text-red-600">
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
                 <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Submit</button>
                </div>
            </div>
        </Modal>
    );
};