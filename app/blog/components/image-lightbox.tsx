"use client";

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function ImageLightbox({ src, alt, width = 1200, height = 630 }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Clickable Featured Image */}
      <div
        className="relative w-full rounded-xl overflow-hidden mb-8 border-[3px] border-[hsl(144.9,80.4%,10%)] cursor-zoom-in hover:opacity-95 transition-opacity"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          priority
        />
        {/* Zoom hint overlay on hover */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-[hsl(144.9,80.4%,10%)]">
            Klik om te vergroten
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/90 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* Lightbox Container */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                aria-label="Sluiten"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Zoomed Image */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring', damping: 25 }}
                className="relative max-w-[95vw] max-h-[95vh] cursor-zoom-out"
                onClick={() => setIsOpen(false)}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={width * 2}
                  height={height * 2}
                  className="w-auto h-auto max-w-full max-h-[95vh] object-contain rounded-lg"
                />
              </motion.div>

              {/* Caption */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm max-w-[90%] text-center">
                {alt}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
