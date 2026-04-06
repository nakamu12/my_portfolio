import { useEffect, useRef } from 'react';
import WebGLFluidEnhanced from 'webgl-fluid-enhanced';

interface FluidBackgroundProps {
  className?: string;
}

const DARK_PALETTE = ['#686dff', '#686dff', '#5b6fff', '#b66fff', '#4a5eff'];
const LIGHT_PALETTE = ['#686dff', '#686dff', '#5b6fff', '#b66fff', '#4a5eff'];

function getThemeConfig() {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    colorPalette: isDark ? DARK_PALETTE : LIGHT_PALETTE,
    bloomIntensity: isDark ? 0.4 : 0.5,
    brightness: isDark ? 0.6 : 0.8,
  };
}

export default function FluidBackground({ className = '' }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const simulation = new WebGLFluidEnhanced(canvasRef.current);
    simulationRef.current = simulation;

    const themeConfig = getThemeConfig();

    simulation.setConfig({
      simResolution: 128,
      dyeResolution: 1024,
      densityDissipation: 0.6,
      velocityDissipation: 0.3,
      pressure: 0.8,
      curl: 20,
      splatRadius: 0.3,
      splatForce: 6000,
      hover: true,
      bloom: true,
      bloomThreshold: 0.3,
      sunrays: false,
      transparent: true,
      colorful: true,
      colorUpdateSpeed: 8,
      ...themeConfig,
    });

    simulation.start();

    // Watch for dark class changes on <html>
    const observer = new MutationObserver(() => {
      if (simulationRef.current) {
        simulationRef.current.setConfig(getThemeConfig());
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
      simulation.stop();
    };
  }, []);

  return <div ref={canvasRef} className={`pointer-events-auto ${className}`} />;
}
