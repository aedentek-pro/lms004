import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../db';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '../icons/Icons';

interface SecureContainerProps {
    watermark?: string;
    children: React.ReactNode;
}

const SecureContainer = React.forwardRef<HTMLDivElement, SecureContainerProps>(({ watermark, children }, ref) => {
    if (!watermark) {
        return <div ref={ref} className="relative w-full h-full">{children}</div>;
    }
    const watermarks = Array(150).fill(null); 

    return (
        <div ref={ref} className="relative w-full h-full bg-black">
            {children}
            <div 
                className="absolute inset-0 flex flex-wrap items-center justify-center gap-x-8 gap-y-12 p-4 pointer-events-none z-20 overflow-hidden animate-watermark-drift"
                aria-hidden="true"
            >
                {watermarks.map((_, i) => (
                    <span key={i} className="text-white/20 text-sm font-semibold transform -rotate-12 select-none whitespace-nowrap">
                        {watermark}
                    </span>
                ))}
            </div>
        </div>
    );
});

interface VideoPlayerProps {
    video: {
        title: string;
        content: string;
        type: 'video';
    };
    watermark?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, watermark }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let objectUrl: string | null = null;
        
        const loadVideo = async () => {
            if (video.type !== 'video') return;

            setVideoUrl(null);
            setIsLoading(false);
            setError(null);

            if (video.content.startsWith('indexeddb://')) {
                setIsLoading(true);
                const videoId = video.content.replace('indexeddb://', '');
                try {
                    const videoBlob = await db.getVideo(videoId);
                    if (videoBlob) {
                        objectUrl = URL.createObjectURL(videoBlob);
                        setVideoUrl(objectUrl);
                    } else {
                        setError('Video not found. It may have been deleted.');
                    }
                } catch (err) {
                    setError('Could not load video.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setVideoUrl(video.content);
            }
        };

        loadVideo();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [video]);

    useEffect(() => {
        const videoElement = videoRef.current;
        const preventContextMenu = (e: Event) => e.preventDefault();
        
        if (videoElement) {
            videoElement.addEventListener('contextmenu', preventContextMenu);
        }
        
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('contextmenu', preventContextMenu);
            }
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [videoUrl]);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    if (isLoading) {
        return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <p className="text-white">Loading video...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }
    
    if (!videoUrl) {
         return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <p className="text-slate-400">No video source provided.</p>
            </div>
        );
    }
    
    const isYouTube = videoUrl.includes('youtube.com/embed');

    const videoContent = (
        <video 
            ref={videoRef}
            key={videoUrl}
            src={videoUrl} 
            controls 
            controlsList="nodownload nofullscreen"
            className="w-full h-full max-h-[inherit]" 
            aria-label={video.title}>
        </video>
    );

    // YouTube iframes have their own fullscreen which can't be controlled this way.
    // The watermark won't show in YouTube's fullscreen. This is an accepted limitation.
    if (isYouTube) {
        return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <iframe 
                    className="w-full h-full"
                    src={videoUrl}
                    title={video.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
            </div>
        )
    }

    return (
        <div className="group relative aspect-video bg-black rounded-lg overflow-hidden">
            <SecureContainer watermark={watermark} ref={containerRef}>
                <div className="w-full h-full flex items-center justify-center">
                    {videoContent}
                </div>
            </SecureContainer>
            <div className="absolute bottom-2.5 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={toggleFullscreen} 
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80" 
                    title="Toggle Fullscreen"
                >
                    {isFullscreen ? <ArrowsPointingInIcon className="w-5 h-5"/> : <ArrowsPointingOutIcon className="w-5 h-5"/>}
                </button>
            </div>
        </div>
    );
};