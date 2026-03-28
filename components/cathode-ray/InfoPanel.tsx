import React from 'react';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SimulationStage } from '../../hooks/usePhysicsEngine';

interface InfoPanelProps {
    stage: SimulationStage;
    voltage: number;
    pressure: number;
    showMalteseCross: boolean;
    electricField: number;
    magneticField: number;
    showTarget: boolean;
    showFluorescentScreen: boolean;
}

export function InfoPanel({
    stage, voltage, pressure, showMalteseCross, electricField, magneticField, showTarget, showFluorescentScreen
}: InfoPanelProps) {

    const getExplanation = () => {
        if (stage === 'No Discharge') {
            return "The voltage is too low, or the resistance of the gas is too high. No current flows through the tube yet. Increase the voltage or lower the pressure.";
        }
        if (stage === 'Glow Discharge (Partial Ionization)') {
            return "The gas is ionizing at low pressure. The positive ions move towards the cathode, and electrons towards the anode, creating a glow discharge.";
        }
        if (stage === 'Cathode Rays (Electron Beam)') {
            let text = "At very low pressure, positive ions violently strike the cathode, causing it to emit an invisible stream of electrons called 'Cathode Rays'.";

            if (showMalteseCross) {
                text += " The sharp shadow cast by the Maltese cross proves that cathode rays travel in straight lines.";
            }
            if (electricField !== 0) {
                const direction = electricField > 0 ? "positive" : "negative";
                text += ` The beam is deflected towards the ${direction} plate, proving that cathode rays carry a negative electrical charge.`;
            }
            if (magneticField > 0) {
                text += " The beam is curving due to the magnetic field (Lorentz force). This further confirms they are charged particles.";
            }
            if (showTarget) {
                text += " As the electrons hit the metal target, their kinetic energy is converted to heat, making the target glow.";
            }
            if (showFluorescentScreen) {
                text += " The phosphor coating on the screen fluoresces when struck by the high-speed electrons, making the invisible beam visible.";
            }
            return text;
        }
        return "";
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-200 shadow-2xl h-full flex flex-col">
            <div className="flex items-center space-x-2 text-cyan-400 mb-4">
                <Info className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Observation & Theory</h2>
            </div>

            <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Current State</div>
                <div className={`px-3 py-2 rounded-lg font-medium inline-flex items-center space-x-2
          ${stage === 'No Discharge' ? 'bg-gray-800 text-gray-400' :
                        stage === 'Glow Discharge (Partial Ionization)' ? 'bg-indigo-900/50 text-indigo-300' :
                            'bg-emerald-900/50 text-emerald-300'}`}
                >
                    {stage === 'No Discharge' && <AlertCircle className="w-4 h-4" />}
                    {stage !== 'No Discharge' && <CheckCircle2 className="w-4 h-4" />}
                    <span>{stage}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <p className="text-sm leading-relaxed text-gray-300">
                        {getExplanation()}
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4 text-xs">
                <div>
                    <span className="text-gray-500 block">Pressure Level</span>
                    <span className="font-mono text-gray-300">{pressure > 0.1 ? 'Normal/High' : pressure > 0.01 ? 'Low (Soft Vacuum)' : 'Very Low (Hard Vacuum)'}</span>
                </div>
                <div>
                    <span className="text-gray-500 block">Voltage Level</span>
                    <span className="font-mono text-gray-300">{voltage < 1000 ? 'Low' : voltage < 5000 ? 'High' : 'Very High'} ({(voltage / 1000).toFixed(1)} kV)</span>
                </div>
            </div>
        </div>
    );
}
