import React from 'react';
import { Settings, Zap, Compass, Wind, Layers, Aperture } from 'lucide-react';

interface ControlsPanelProps {
    voltage: number;
    setVoltage: (v: number) => void;
    pressure: number;
    setPressure: (p: number) => void;
    electricField: number;
    setElectricField: (e: number) => void;
    magneticField: number;
    setMagneticField: (m: number) => void;
    magneticDirection: 'in' | 'out';
    setMagneticDirection: (d: 'in' | 'out') => void;
    showMalteseCross: boolean;
    setShowMalteseCross: (s: boolean) => void;
    showFluorescentScreen: boolean;
    setShowFluorescentScreen: (s: boolean) => void;
    showTarget: boolean;
    setShowTarget: (s: boolean) => void;
}

export function ControlsPanel({
    voltage, setVoltage,
    pressure, setPressure,
    electricField, setElectricField,
    magneticField, setMagneticField,
    magneticDirection, setMagneticDirection,
    showMalteseCross, setShowMalteseCross,
    showFluorescentScreen, setShowFluorescentScreen,
    showTarget, setShowTarget,
}: ControlsPanelProps) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-200 shadow-2xl space-y-6">
            <div className="flex items-center space-x-2 text-blue-400 mb-4">
                <Settings className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Experiment Controls</h2>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
                {/* Voltage Slider */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center space-x-1"><Zap className="w-4 h-4 text-yellow-400" /> <span>Voltage</span></span>
                        <span className="font-mono text-yellow-400">{voltage.toLocaleString()} V</span>
                    </div>
                    <input
                        type="range" min="0" max="10000" step="100"
                        value={voltage} onChange={(e) => setVoltage(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>

                {/* Pressure Slider */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center space-x-1"><Wind className="w-4 h-4 text-gray-400" /> <span>Gas Pressure</span></span>
                        <span className="font-mono text-gray-400">{pressure.toFixed(3)} atm</span>
                    </div>
                    <input
                        type="range" min="0.001" max="1.0" step="0.001"
                        value={pressure} onChange={(e) => setPressure(Number(e.target.value))}
                        className="w-full accent-gray-400"
                        style={{ direction: 'rtl' }} // High pressure is left, low is right (vacuum)
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>High (1 atm)</span>
                        <span>Vacuum</span>
                    </div>
                </div>

                {/* Electric Field Slider */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center space-x-1"><Layers className="w-4 h-4 text-purple-400" /> <span>Electric Field</span></span>
                        <span className="font-mono text-purple-400">{electricField} units</span>
                    </div>
                    <input
                        type="range" min="-100" max="100" step="1"
                        value={electricField} onChange={(e) => setElectricField(Number(e.target.value))}
                        className="w-full accent-purple-400"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Bottom (+) / Top (-)</span>
                        <span>Top (+) / Bottom (-)</span>
                    </div>
                </div>

                {/* Magnetic Field Slider */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center space-x-1"><Compass className="w-4 h-4 text-green-400" /> <span>Magnetic Field</span></span>
                        <span className="font-mono text-green-400">{magneticField} units</span>
                    </div>
                    <input
                        type="range" min="0" max="100" step="1"
                        value={magneticField} onChange={(e) => setMagneticField(Number(e.target.value))}
                        className="w-full accent-green-400"
                    />
                    <div className="flex justify-end mt-1">
                        <button
                            onClick={() => setMagneticDirection(magneticDirection === 'in' ? 'out' : 'in')}
                            className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-700 hover:bg-gray-700 transition"
                        >
                            Direction: {magneticDirection === 'in' ? 'Into Screen (⊗)' : 'Out of Screen (⊙)'}
                        </button>
                    </div>
                </div>
            </div>

            <hr className="border-gray-800" />

            {/* Toggles */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400">Insert Objects</h3>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" className="hidden" checked={showMalteseCross} onChange={(e) => setShowMalteseCross(e.target.checked)} />
                    <div className={`w-10 h-6 shrink-0 rounded-full p-1 transition-colors duration-200 ease-in-out ${showMalteseCross ? 'bg-blue-600' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${showMalteseCross ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm group-hover:text-white transition-colors">Maltese Cross (Shadow Exp)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" className="hidden" checked={showFluorescentScreen} onChange={(e) => setShowFluorescentScreen(e.target.checked)} />
                    <div className={`w-10 h-6 shrink-0 rounded-full p-1 transition-colors duration-200 ease-in-out ${showFluorescentScreen ? 'bg-blue-600' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${showFluorescentScreen ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm group-hover:text-white transition-colors">Fluorescent Screen</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" className="hidden" checked={showTarget} onChange={(e) => setShowTarget(e.target.checked)} />
                    <div className={`w-10 h-6 shrink-0 rounded-full p-1 transition-colors duration-200 ease-in-out ${showTarget ? 'bg-blue-600' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${showTarget ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm group-hover:text-white transition-colors">Metal Target (Heating Exp)</span>
                </label>
            </div>
        </div>
    );
}
