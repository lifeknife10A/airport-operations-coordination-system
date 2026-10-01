import React, { useRef, useEffect } from 'react';
import './AircraftCanvas.css';

export interface AircraftCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
  tintMode?: 'warm-day' | 'mist' | 'minimal';
  cropShape?: 'framed' | 'full' | 'minimal';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const TOTAL_CACHED_FRAMES = 50;

export const AircraftCanvas: React.FC<AircraftCanvasProps> = ({
  scrollProgress,
  tintMode = 'warm-day',
  cropShape = 'framed',
  className = '',
  style = {},
  children
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetProgressRef = useRef<number>(scrollProgress);
  const currentProgressRef = useRef<number>(scrollProgress);
  const cachedFramesRef = useRef<(ImageBitmap | HTMLCanvasElement)[]>([]);

  // Update target progress synchronously whenever scroll changes - never resets rAF loop!
  useEffect(() => {
    targetProgressRef.current = Math.max(0, Math.min(1, scrollProgress));
  }, [scrollProgress]);

  // Dedicated background decoder for butter-smooth forward & reverse frame pre-caching
  useEffect(() => {
    let isCancelled = false;

    const cacheVideo = document.createElement('video');
    cacheVideo.src = '/Landing.mp4';
    cacheVideo.muted = true;
    cacheVideo.playsInline = true;
    cacheVideo.preload = 'auto';

    const startCaching = async () => {
      if (isCancelled) return;
      const duration = cacheVideo.duration || 10;
      const width = cacheVideo.videoWidth || 1920;
      const height = cacheVideo.videoHeight || 1080;

      for (let i = 0; i < TOTAL_CACHED_FRAMES; i++) {
        if (isCancelled) break;
        const time = (i / (TOTAL_CACHED_FRAMES - 1)) * Math.max(0.05, duration - 0.05);
        cacheVideo.currentTime = time;

        await new Promise<void>((resolve) => {
          const onSeeked = async () => {
            cacheVideo.removeEventListener('seeked', onSeeked);
            if (!isCancelled) {
              try {
                if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
                  const bmp = await createImageBitmap(cacheVideo);
                  cachedFramesRef.current[i] = bmp;
                } else {
                  const c = document.createElement('canvas');
                  c.width = width;
                  c.height = height;
                  const cCtx = c.getContext('2d');
                  cCtx?.drawImage(cacheVideo, 0, 0, width, height);
                  cachedFramesRef.current[i] = c;
                }
              } catch {
                // Fallback silently if single frame fails
              }
            }
            resolve();
          };
          cacheVideo.addEventListener('seeked', onSeeked);
        });
      }
    };

    if (cacheVideo.readyState >= 1) {
      startCaching();
    } else {
      cacheVideo.addEventListener('loadedmetadata', startCaching, { once: true });
    }

    return () => {
      isCancelled = true;
      cacheVideo.src = '';
    };
  }, []);

  // Continuous, uninterrupted 60/120 FPS rAF lerp render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animId: number;
    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Exponential smoothing lerp (ultra responsive & silky smooth)
      if (Math.abs(diff) > 0.0003) {
        currentProgressRef.current += diff * 0.18;
      } else {
        currentProgressRef.current = target;
      }

      const p = currentProgressRef.current;
      const frames = cachedFramesRef.current;
      const total = TOTAL_CACHED_FRAMES;

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const frameIdx = Math.min(total - 1, Math.max(0, Math.round(p * (total - 1))));
        let frameToDraw = frames[frameIdx];

        // If target frame not loaded yet, select closest available cached frame
        if (!frameToDraw && frames.length > 0) {
          for (let step = 1; step < total; step++) {
            if (frames[frameIdx - step]) {
              frameToDraw = frames[frameIdx - step];
              break;
            }
            if (frames[frameIdx + step]) {
              frameToDraw = frames[frameIdx + step];
              break;
            }
          }
        }

        if (frameToDraw) {
          if (canvas.width !== frameToDraw.width || canvas.height !== frameToDraw.height) {
            canvas.width = frameToDraw.width;
            canvas.height = frameToDraw.height;
          }
          ctx.drawImage(frameToDraw, 0, 0);
        } else {
          // Direct fallback to initial video element
          const video = videoRef.current;
          if (video && video.readyState >= 2 && video.videoWidth > 0) {
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
            }
            const duration = video.duration || 10;
            const seekTime = p * Math.max(0.1, duration - 0.05);
            if (!video.seeking && Math.abs(video.currentTime - seekTime) > 0.06) {
              try { video.currentTime = seekTime; } catch { }
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, []); // Run once on mount - never torn down during scroll!

  return (
    <div
      className={`aircraft-canvas-container tint-${tintMode} crop-${cropShape} ${className}`}
      style={style}
    >
      {/* Hidden baseline video for immediate first-frame fallback */}
      <video
        ref={videoRef}
        src="/Landing.mp4"
        muted
        playsInline
        preload="auto"
        className="aircraft-source-video-hidden"
      />

      {/* High-Performance Canvas Viewport */}
      <canvas ref={canvasRef} className="aircraft-canvas-viewport" />

      {/* Atmospheric Soft Tint Overlay */}
      <div className={`aircraft-overlay-shade tint-${tintMode}`} />

      {children}
    </div>
  );
};
