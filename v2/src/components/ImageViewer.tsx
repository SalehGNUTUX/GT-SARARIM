import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X, ZoomOut } from 'lucide-react';

interface ImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
  caption?: string;
}

export function ImageViewer({ src, alt = '', className = '', caption }: ImageViewerProps) {
  const [lightbox, setLightbox] = useState(false);
  const [scale, setScale] = useState(1);

  return (
    <>
      {/* Thumbnail with zoom hint */}
      <div className={`relative group cursor-zoom-in overflow-hidden rounded-2xl ${className}`}
        onClick={() => { setLightbox(true); setScale(1); }}>
        <img src={src} alt={alt} className="w-full h-full object-contain bg-[#F8F9FA] dark:bg-[#1A1A1A]"/>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-full p-2">
            <ZoomIn className="w-5 h-5"/>
          </div>
        </div>
        {caption && (
          <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs text-center p-1 rounded-b-2xl">
            {caption}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4"
            onClick={() => setLightbox(false)}>
            {/* Controls */}
            <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <button onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                  className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors">
                  <ZoomOut className="w-5 h-5"/>
                </button>
                <span className="text-white text-sm font-bold bg-black/40 px-2 py-1 rounded-full">
                  {Math.round(scale * 100)}%
                </span>
                <button onClick={() => setScale(s => Math.min(4, s + 0.25))}
                  className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors">
                  <ZoomIn className="w-5 h-5"/>
                </button>
              </div>
              <button onClick={() => setLightbox(false)}
                className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {/* Image */}
            <motion.div className="overflow-auto max-w-full max-h-[80vh] mt-14"
              onClick={e => e.stopPropagation()}>
              <motion.img
                src={src} alt={alt}
                style={{ transform: `scale(${scale})`, transformOrigin: 'center', transition: 'transform 0.2s' }}
                className="max-w-[90vw] max-h-[75vh] object-contain rounded-xl select-none"
                draggable={false}
              />
            </motion.div>

            {caption && (
              <p className="text-white/80 text-sm mt-3 text-center">{caption}</p>
            )}
            <p className="text-white/40 text-xs mt-2">اِنْقُرْ خَارِجَ الصُّورَةِ لِلْإِغْلَاقِ</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
