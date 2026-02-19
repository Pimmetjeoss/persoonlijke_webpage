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
        className='w-full h-full object-cover z-0'
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src='/CodeLieshout-intro!720p.mp4' type='video/mp4' />
      </video>
    </div>
  );
};

export default Home;