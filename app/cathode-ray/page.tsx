"use client";

import React from 'react';
import { usePhysicsEngine } from '../../hooks/usePhysicsEngine';
import { TubeScene } from '../../components/cathode-ray/TubeScene';
import { ControlsPanel } from '../../components/cathode-ray/ControlsPanel';
import { InfoPanel } from '../../components/cathode-ray/InfoPanel';
import { Beaker } from 'lucide-react';

export default function CathodeRaySimulationPage() {
    const engine = usePhysicsEngine();

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">

            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                            <Beaker className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Virtual Lab: Cathode Ray Experiment
                        </h1>
                    </div>
                    <div className="text-sm text-gray-400 hidden sm:block">
                        A/L Physics & Chemistry
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Top: Scene */}
                <section className="w-full">
                    <TubeScene {...engine} />
                </section>

                {/* Bottom: Controls & Info */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7">
                        <ControlsPanel {...engine} />
                    </div>
                    <div className="lg:col-span-5">
                        <InfoPanel {...engine} />
                    </div>
                </section>

            </main>

        </div>
    );
}
