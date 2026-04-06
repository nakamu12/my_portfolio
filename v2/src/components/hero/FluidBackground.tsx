import { useEffect, useRef } from 'react';
import webGLFluidEnhanced from 'webgl-fluid-enhanced';

interface FluidBackgroundProps {
  className?: string;
}

export default function FluidBackground({ className = '' }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    webGLFluidEnhanced.simulation(canvasRef.current, {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 3.5,
      VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1,
      CURL: 30,
      SPLAT_RADIUS: 0.3,
      SPLAT_FORCE: 6000,
      COLOR_PALETTE: ['#686dff', '#b66fff', '#1a1a2e', '#16213e'],
      HOVER: true,
      SPLAT_ON_CLICK: false,
      SUNRAYS: false,
      BLOOM: true,
      BLOOM_INTENSITY: 0.3,
      BLOOM_THRESHOLD: 0.6,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: true,
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-auto ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
