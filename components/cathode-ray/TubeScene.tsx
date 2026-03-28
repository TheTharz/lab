import React, { useRef, useEffect } from 'react';
import { SimulationStage } from '../../hooks/usePhysicsEngine';

interface TubeSceneProps {
    stage: SimulationStage;
    voltage: number;
    pressure: number;
    electronSpeed: number;
    beamIntensity: number;
    deflectionY: number;
    showMalteseCross: boolean;
    showFluorescentScreen: boolean;
    showTarget: boolean;
    targetTemperature: number;
    electricField: number;
    magneticField: number;
}

export function TubeScene({
    stage, voltage, pressure, electronSpeed, beamIntensity, deflectionY,
    showMalteseCross, showFluorescentScreen, showTarget, targetTemperature,
    electricField, magneticField
}: TubeSceneProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        let animationFrameId: number;
        let particles: { x: number, y: number, speed: number, alpha: number }[] = [];

        const render = () => {
            ctx.clearRect(0, 0, rect.width, rect.height);

            const isBeam = stage === 'Cathode Rays (Electron Beam)';
            const isGlow = stage === 'Glow Discharge (Partial Ionization)';

            const tubeLeft = rect.width * 0.1;
            const tubeRight = rect.width * 0.9;
            const cathodeX = tubeLeft + 20;
            const anodeX = tubeRight - 20;
            const centerY = rect.height / 2;

            // Gas glow
            if (voltage > 500) {
                let gasAlpha = 0;
                if (isGlow) gasAlpha = Math.min(0.6, (voltage - 500) / 4000) * (pressure / 1.0);
                else if (isBeam) gasAlpha = 0.05;

                if (gasAlpha > 0) {
                    const g = ctx.createRadialGradient(rect.width / 2, centerY, 0, rect.width / 2, centerY, rect.width / 2);
                    g.addColorStop(0, `rgba(200, 100, 255, ${gasAlpha})`);
                    g.addColorStop(1, 'rgba(200, 100, 255, 0)');
                    ctx.fillStyle = g;
                    ctx.fillRect(tubeLeft, centerY - 60, tubeRight - tubeLeft, 120);
                }
            }

            // Add particles
            if (isBeam) {
                const emissionRate = Math.max(1, Math.floor(beamIntensity * 8));
                for (let i = 0; i < emissionRate; i++) {
                    particles.push({
                        x: cathodeX,
                        y: centerY + (Math.random() - 0.5) * 16, // beam width 16px
                        speed: 4 + (electronSpeed / 1e8) * 10 + Math.random() * 2,
                        alpha: 1.0
                    });
                }
            } else if (isGlow) {
                for (let i = 0; i < 2; i++) {
                    particles.push({
                        x: tubeLeft + Math.random() * (tubeRight - tubeLeft),
                        y: centerY + (Math.random() - 0.5) * 100,
                        speed: (Math.random() - 0.5) * 2,
                        alpha: 0.5
                    });
                }
            }

            const crossX = rect.width * 0.5;
            const targetX = rect.width * 0.7;

            // Update particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.speed;

                if (isBeam) {
                    const fieldStartX = rect.width * 0.3;
                    const fieldEndX = rect.width * 0.6;

                    if (p.x > fieldStartX) {
                        const factor = Math.min(1, (p.x - fieldStartX) / (rect.width * 0.4));
                        p.y += (deflectionY / 100) * factor * (p.speed / 10);
                    }

                    if (showMalteseCross && Math.abs(p.x - crossX) < 15 && Math.abs(p.y - centerY) < 30) {
                        particles.splice(i, 1);
                        continue;
                    }
                    if (showTarget && Math.abs(p.x - targetX) < 15 && Math.abs(p.y - centerY) < 20) {
                        particles.splice(i, 1);
                        continue;
                    }
                } else {
                    p.alpha -= 0.01;
                    if (p.alpha <= 0) {
                        particles.splice(i, 1);
                        continue;
                    }
                }

                if (p.x > tubeRight) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                if (isBeam) {
                    ctx.fillStyle = `rgba(100, 255, 200, ${beamIntensity * p.alpha})`;
                    ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.speed * 2, p.y);
                    ctx.strokeStyle = `rgba(100, 255, 200, ${beamIntensity * 0.4})`;
                    ctx.stroke();
                } else {
                    ctx.fillStyle = `rgba(255, 100, 200, ${p.alpha})`;
                    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                }
                ctx.fill();
            }

            // Fluorescence
            if (showFluorescentScreen && isBeam) {
                const screenHitY = centerY + deflectionY;
                // Only show glow if it actually hits within the tube height (roughly)
                if (Math.abs(deflectionY) < 60) {
                    const g = ctx.createRadialGradient(tubeRight - 10, screenHitY, 0, tubeRight - 10, screenHitY, 40);
                    g.addColorStop(0, `rgba(50, 255, 100, ${beamIntensity * 0.9})`);
                    g.addColorStop(1, 'rgba(50, 255, 100, 0)');
                    ctx.fillStyle = g;
                    ctx.fillRect(tubeRight - 50, centerY - 60, 50, 120);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [stage, voltage, pressure, electronSpeed, beamIntensity, deflectionY, showMalteseCross, showFluorescentScreen, showTarget]);

    return (
        <div className="relative w-full h-[350px] md:h-[450px] bg-gray-950 rounded-2xl border border-gray-800 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center">

            {/* External Fields Context */}
            {electricField !== 0 && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8 opacity-60">
                    <div className={`w-[50%] mx-auto h-3 ${electricField > 0 ? 'bg-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.8)]'} rounded-full`} />
                    <div className={`w-[50%] mx-auto h-3 ${electricField < 0 ? 'bg-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.8)]'} rounded-full`} />
                </div>
            )}
            {magneticField > 0 && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                    <div className="w-[50%] h-[200px] border-4 border-emerald-500 rounded-full border-dashed animate-[spin_20s_linear_infinite] opacity-50 shadow-[0_0_30px_rgba(16,185,129,0.3)_inset]" />
                </div>
            )}

            {/* Glass Tube Frame */}
            <div className="absolute w-[80%] h-[140px] rounded-full border-[6px] border-cyan-900/30 bg-cyan-950/20 shadow-[inset_0_0_60px_rgba(0,100,255,0.08)] flex items-center justify-between px-2 box-border relative">
                <div className="absolute inset-0 rounded-full ring-1 ring-white/10 pointer-events-none" />

                {/* Cathode Lead */}
                <div className="w-12 h-1.5 bg-gray-400 absolute left-[-40px] shadow-[0_0_5px_currentColor]" />

                {/* Cathode Plate */}
                <div className="w-5 h-[80px] bg-gradient-to-r from-gray-300 to-gray-500 rounded z-10 border border-gray-400 shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-end pr-1">
                    <div className="w-1 h-12 bg-gray-600 rounded" />
                </div>

                {/* Internal Interactive Objects */}
                <div className="flex-1 h-full relative z-10 pointer-events-none">
                    {showMalteseCross && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] opacity-95">
                            <svg viewBox="0 0 100 100" fill="#222" stroke="#555" strokeWidth="2" className="w-full h-full drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
                                <path d="M 50 50 L 15 15 L 35 10 L 50 30 L 65 10 L 85 15 Z" fill="#111" />
                                <path d="M 50 50 L 85 15 L 90 35 L 70 50 L 90 65 L 85 85 Z" fill="#1a1a1a" />
                                <path d="M 50 50 L 85 85 L 65 90 L 50 70 L 35 90 L 15 85 Z" fill="#222" />
                                <path d="M 50 50 L 15 85 L 10 65 L 30 50 L 10 35 L 15 15 Z" fill="#2a2a2a" />
                                <circle cx="50" cy="50" r="8" fill="#444" />
                            </svg>
                        </div>
                    )}
                    {showTarget && (
                        <div className="absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 border border-gray-600 rounded drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-colors duration-500"
                            style={{
                                backgroundColor: `rgb(${Math.min(255, 50 + targetTemperature / 2)}, ${Math.max(40, 150 - targetTemperature / 10)}, 40)`,
                                boxShadow: targetTemperature > 50 ? `0 0 ${targetTemperature / 15}px rgba(255, ${Math.max(0, 100 - targetTemperature / 10)}, 0, ${Math.min(1, targetTemperature / 1000)})` : 'none'
                            }}
                        >
                            <div className="w-full h-full border border-black/30 bg-gradient-to-b from-transparent to-black/20" />
                            <div className="w-1 h-full bg-white/20 ml-1" />
                        </div>
                    )}
                </div>

                {/* Anode Plate */}
                <div className="w-5 h-[80px] bg-gradient-to-l from-red-600 to-red-800 rounded z-10 border border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.4)] flex items-center justify-center">
                    <div className="w-2 h-[40px] bg-black/90 rounded-sm shadow-[inset_0_0_5px_rgba(0,0,0,1)]" />
                </div>

                {/* Anode Lead */}
                <div className="w-12 h-1.5 bg-red-700 absolute right-[-40px] shadow-[0_0_5px_currentColor]" />

                {/* Fluorescent Coating */}
                {showFluorescentScreen && (
                    <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-emerald-500/20 to-transparent rounded-r-full border-r-2 border-emerald-400/30 backdrop-blur-[1px]" />
                )}
            </div>

            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />
        </div>
    );
}
