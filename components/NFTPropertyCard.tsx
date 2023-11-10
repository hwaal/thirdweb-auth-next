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

      const revealValue = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
      };

      canvas.addEventListener('mousedown', (e) => {
        canvas.addEventListener('mousemove', revealValue);
        revealValue(e);
      });
      
      canvas.addEventListener('mouseup', () => {
        canvas.removeEventListener('mousemove', revealValue);
      });

      canvas.addEventListener('mouseleave', () => {
        canvas.removeEventListener('mousemove', revealValue);
      });

      return () => {
        canvas.removeEventListener('mousedown', (e) => {
          canvas.removeEventListener('mousemove', revealValue);
        });
        canvas.removeEventListener('mouseup', () => {
          canvas.removeEventListener('mousemove', revealValue);
        });
        canvas.removeEventListener('mouseleave', () => {
          canvas.removeEventListener('mousemove', revealValue);
        });
      };
    }
  }, [bgColor]);

  return (
    <div className="flex flex-col items-center justify-center p-4 user-select-none">
      <p className="text-xl font-bold mb-2 user-select-none">{property}</p>
      <div className="relative">
        <p className="absolute top-1/2 left-1/2 text-center z-0 pointer-events-none user-select-none transform -translate-x-1/2 -translate-y-1/2 text-2xl">{value}</p>
        <canvas ref={canvasRef} width={256} height={100} className="scratch-canvas z-10" style={{ position: 'relative' }} />
      </div>
    </div>
  );
};

export default NFTPropertyCard;
