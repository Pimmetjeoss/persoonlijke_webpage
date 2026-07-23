/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useTransition } from './transition_provider';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const { startTransition, isTransitioning } = useTransition();
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/portfolio');
  }, [router]);

  const handleVideoEnd = () => {
    if (!videoEnded) {
      setVideoEnded(true);
      startTransition('/portfolio');
    }
  };

  const handleSkipVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleVideoEnd();
  };

  return (
    <div
      className='relative w-screen h-screen overflow-hidden bg-black cursor-pointer'
      onClick={handleSkipVideo}
    >
      <video
        ref={videoRef}
        className='w-full h-full object-contain md:object-cover z-0'
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src='/CodeLieshout-intro!720p.mp4' type='video/mp4' />
      </video>
      <button
        type='button'
        onClick={handleSkipVideo}
        className='absolute bottom-6 right-6 md:bottom-8 md:right-8 z-10 rounded-full border border-white/40 bg-black/40 px-5 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/60'
      >
        Skip intro →
      </button>
    </div>
  );
};

export default Home;