import React, { useState } from 'react';
import { WebinarView } from '../student/WebinarView';
import { LiveSession as LiveSessionType, User, UserRole } from '../../types';

interface WebinarSessionProps {
    session: LiveSessionType;
    onClose: () => void;
    currentUser: User;
    onUploadRecording?: (sessionId: string, file: File) => Promise<void>;
}

export const WebinarSession: React.FC<WebinarSessionProps> = ({ session, onClose, currentUser, onUploadRecording }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    const isSessionOver = new Date() > new Date(session.dateTime);
    const canUpload = (currentUser.role === UserRole.Admin || currentUser.role === UserRole.Instructor) && onUploadRecording;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !canUpload) return;
        
        setIsUploading(true);
        setUploadError(null);
        try {
            await onUploadRecording(session.id, selectedFile);
            onClose();
        } catch (error) {
            console.error(error);
            setUploadError("Failed to upload recording. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const renderUploadSection = () => {
        if (!canUpload || !isSessionOver || session.recordingUrl) return null;

        return (
            <div className="mt-6 p-4 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">Upload Session Recording</h3>
                <p className="text-sm text-slate-500 mb-4">Upload a recording for students who missed the live session.</p>
                <div className="flex items-center space-x-4">
                     <input
                        id="recording-upload"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label htmlFor="recording-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                       {selectedFile ? 'Change File' : 'Choose File'}
                    </label>
                    {selectedFile && <span className="text-sm text-slate-600 truncate">{selectedFile.name}</span>}
                </div>
                {uploadError && <p className="text-sm text-red-500 mt-2">{uploadError}</p>}
                 <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isUploading ? 'Uploading...' : 'Upload Recording'}
                </button>
            </div>
        );
    };

    return (
        <div>
            {!isSessionOver ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">{session.title}</h2>
                    <WebinarView onClose={onClose} currentUser={currentUser} />
                </>
            ) : (
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold mb-2">This session has ended.</h2>
                    {!session.recordingUrl && <p className="text-slate-500">A recording may be available soon.</p>}
                </div>
             )}
            {renderUploadSection()}
        </div>
    );
};
