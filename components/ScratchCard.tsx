// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import Link from 'next/link'; // Import Link from Next.js

const ScratchCard = ({ children }) => {
  const canvasRef = useRef(null);
  const isScratching = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, rect.width, rect.height);

    const startScratch = (e) => {
      isScratching.current = true;
      scratch(e);
    };

    const endScratch = () => {
      isScratching.current = false;
    };

    const scratch = (e) => {
      if (!isScratching.current) return;

      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.arc(x, y, 30, 0, Math.PI * 2, false);
      ctx.fill();
    };

    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('touchstart', startScratch);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch);
    window.addEventListener('mouseup', endScratch);
    window.addEventListener('touchend', endScratch);

    return () => {
      canvas.removeEventListener('mousedown', startScratch);
      canvas.removeEventListener('touchstart', startScratch);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchmove', scratch);
      window.removeEventListener('mouseup', endScratch);
      window.removeEventListener('touchend', endScratch);
    };
  }, []);

  return (
    <div className="relative">
    <canvas ref={canvasRef} className="fixed inset-0 z-20 w-full h-full" />
    <div className="fixed inset-0 z-10 flex">
      {children}
    </div>
    {/* Back Button */}
    <Link href="/">
      <div className="fixed top-5 left-5 z-30 p-3 bg-yellow-500 shadow-md hover:bg-black hover:text-white">Terug</div>
    </Link>
  </div>
  );
};

export default ScratchCard;
