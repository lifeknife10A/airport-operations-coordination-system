import React, { useRef, useEffect } from 'react';
import './HeroVideo.css';

interface HeroVideoProps {
  scrollProgress?: number;
}

const TOTAL_FRAMES = 80; // 80 high-res cached frames across video duration

const HeroVideo: React.FC<HeroVideoProps> = ({ scrollProgress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const cachedFramesRef = useRef<HTMLCanvasElement[]>([]);
  const isCachingRef = useRef<boolean>(false);

  // Background frame pre-caching engine
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const cacheVideoFrames = async () => {
      if (isCachingRef.current || cachedFramesRef.current.length >= TOTAL_FRAMES) return;
      isCachingRef.current = true;

      const duration = video.duration || 10;
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d');

      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      offCanvas.width = width;
      offCanvas.height = height;

      const frames: HTMLCanvasElement[] = [];

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const time = (i / (TOTAL_FRAMES - 1)) * Math.max(0.1, duration - 0.05);
        video.currentTime = time;

        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            if (offCtx) {
              const frameCanvas = document.createElement('canvas');
              frameCanvas.width = width;
              frameCanvas.height = height;
              const fCtx = frameCanvas.getContext('2d');
              fCtx?.drawImage(video, 0, 0, width, height);
              frames[i] = frameCanvas;
            }
            video.removeEventListener('seeked', onSeeked);
            resolve();
          };
          video.addEventListener('seeked', onSeeked);
        });
      }

      cachedFramesRef.current = frames;
      isCachingRef.current = false;
    };

    video.addEventListener('loadedmetadata', cacheVideoFrames);

    return () => {
      video.removeEventListener('loadedmetadata', cacheVideoFrames);
    };
  }, []);

  // Update target progress from scroll position
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTargetFromScroll = () => {
      if (scrollProgress !== undefined) {
        targetProgressRef.current = Math.max(0, Math.min(1, scrollProgress));
      } else {
        const scrollY = window.scrollY;
        const heroElem = video.closest('.hero-container') || video.parentElement;
        const heroHeight = heroElem ? heroElem.clientHeight : window.innerHeight;
        const scrollThreshold = Math.max(1, heroHeight - 80);

        const calcProgress = Math.max(0, Math.min(1, scrollY / scrollThreshold));
        targetProgressRef.current = calcProgress;
      }
    };

    updateTargetFromScroll();
    window.addEventListener('scroll', updateTargetFromScroll, { passive: true });
    window.addEventListener('resize', updateTargetFromScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateTargetFromScroll);
      window.removeEventListener('resize', updateTargetFromScroll);
    };
  }, [scrollProgress]);

  // Smooth 60 FPS rAF lerp render loop (using cached frames for instant reverse scrubbing)
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');

    const render = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.001) {
        currentProgressRef.current += diff * 0.25;
      } else {
        currentProgressRef.current = target;
      }

      const progress = currentProgressRef.current;
      const duration = video.duration || 10;
      const targetFrameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1))));

      if (ctx) {
        const cachedFrame = cachedFramesRef.current[targetFrameIdx];

        if (cachedFrame) {
          // Instant GPU buffer render (<0.1ms) - 100% smooth forward AND reverse!
          if (canvas.width !== cachedFrame.width || canvas.height !== cachedFrame.height) {
            canvas.width = cachedFrame.width;
            canvas.height = cachedFrame.height;
          }
          ctx.drawImage(cachedFrame, 0, 0);
        } else if (video.readyState >= 2) {
          // Direct video fallback if frame not cached yet
          if (video.videoWidth > 0) {
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
            }
            const seekTime = progress * Math.max(0.1, duration - 0.05);
            if (!video.seeking && Math.abs(video.currentTime - seekTime) > 0.05) {
              try { video.currentTime = seekTime; } catch { }
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div className="hero-video-wrapper">
      <video
        ref={videoRef}
        src="/Landing.mp4"
        muted
        playsInline
        preload="auto"
        className="hero-video-hidden"
      />
      <canvas ref={canvasRef} className="hero-video-canvas" />
      <div className="hero-overlay dark-overlay"></div>
    </div>
  );
};

export default HeroVideo;
