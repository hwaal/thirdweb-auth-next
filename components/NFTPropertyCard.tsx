// @ts-nocheck
import React, { useRef, useEffect } from 'react';

interface NFTPropertyCardProps {
  property: string;
  value: string;
  bgColor: string;
}

const NFTPropertyCard: React.FC<NFTPropertyCardProps> = ({ property, value, bgColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cursorImageUrl = '/YOLO-COIN.png';
      const customCursor = `url('${cursorImageUrl}') 16 16, auto`;

      const setCustomCursor = () => {
        canvas.style.cursor = customCursor;
      };

      const resetCursor = () => {
        canvas.style.cursor = 'default';
      };

      const getTouchPos = (canvas, touchEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
          x: touchEvent.touches[0].clientX - rect.left,
          y: touchEvent.touches[0].clientY - rect.top,
        };
      };

      const scratch = (x, y) => {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
      };

      const mouseScratch = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        scratch(x, y);
      };

      const touchScratch = (e) => {
        const pos = getTouchPos(canvas, e);
        scratch(pos.x, pos.y);
        e.preventDefault(); // Prevent scrolling when touching the canvas
      };

      canvas.addEventListener('mousedown', (e) => {
        setCustomCursor();
        canvas.addEventListener('mousemove', mouseScratch);
        mouseScratch(e);
      });

      canvas.addEventListener('mouseup', () => {
        resetCursor();
        canvas.removeEventListener('mousemove', mouseScratch);
      });

      canvas.addEventListener('mouseleave', () => {
        resetCursor();
        canvas.removeEventListener('mousemove', mouseScratch);
      });

      canvas.addEventListener('touchstart', (e) => {
        canvas.addEventListener('touchmove', touchScratch);
        touchScratch(e);
      });

      canvas.addEventListener('touchend', () => {
        canvas.removeEventListener('touchmove', touchScratch);
      });

      return () => {
        canvas.removeEventListener('mousedown', (e) => {
          resetCursor();
          canvas.removeEventListener('mousemove', mouseScratch);
        });
        canvas.removeEventListener('mouseup', () => {
          resetCursor();
          canvas.removeEventListener('mousemove', mouseScratch);
        });
        canvas.removeEventListener('mouseleave', () => {
          resetCursor();
          canvas.removeEventListener('mousemove', mouseScratch);
        });
        canvas.removeEventListener('touchstart', (e) => {
          canvas.removeEventListener('touchmove', touchScratch);
        });
        canvas.removeEventListener('touchend', () => {
          canvas.removeEventListener('touchmove', touchScratch);
        });
      };
    }
  }, [bgColor]);

  return (
    <div className="flex flex-col items-center justify-center p-4 user-select-none">
      <p className="text-xl font-bold mb-2 user-select-none">{property}</p>
      <div className="relative">
        <p className="absolute top-1/2 left-1/2 z-0 pointer-events-none user-select-none transform -translate-x-1/2 -translate-y-1/2 text-2xl">{value}</p>
        <canvas ref={canvasRef} width={256} height={100} className="scratch-canvas z-10" style={{ position: 'relative', touchAction: 'none' }} />
      </div>
    </div>
  );
};

export default NFTPropertyCard;
