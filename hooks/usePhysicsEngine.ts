import { useState, useMemo } from 'react';

// Physical constants
const ELECTRON_CHARGE_TO_MASS_RATIO = 1.7588e11; // e/m in C/kg

export type SimulationStage = 
  | 'No Discharge'
  | 'Glow Discharge (Partial Ionization)'
  | 'Cathode Rays (Electron Beam)';

export function usePhysicsEngine() {
  // Configurable states
  const [voltage, setVoltage] = useState(0); // 0 to 10000 V
  const [pressure, setPressure] = useState(1.0); // 1.0 (atm) to 0.001 (atm)
  const [electricField, setElectricField] = useState(0); // 0 to 100 (arbitrary units)
  
  // Toggles
  const [showMalteseCross, setShowMalteseCross] = useState(false);
  const [showFluorescentScreen, setShowFluorescentScreen] = useState(false);
  const [showTarget, setShowTarget] = useState(false);

  // Derived physics
  const electronSpeed = useMemo(() => {
    // v = sqrt(2 * (e/m) * V)
    if (voltage < 500) return 0; // threshold for emission
    return Math.sqrt(2 * ELECTRON_CHARGE_TO_MASS_RATIO * voltage);
  }, [voltage]);

  // Stage calculation based on A/L Physics curriculum
  const stage: SimulationStage = useMemo(() => {
    if (voltage < 500) return 'No Discharge';
    if (pressure > 0.01 && voltage >= 500) return 'Glow Discharge (Partial Ionization)';
    if (pressure <= 0.01 && voltage >= 5000) return 'Cathode Rays (Electron Beam)';
    return 'No Discharge';
  }, [voltage, pressure]);

  // Beam properties
  const beamIntensity = useMemo(() => {
    if (stage !== 'Cathode Rays (Electron Beam)') return 0;
    // Map 5000-10000V to 0.1-1.0 intensity
    return Math.min(1, Math.max(0, (voltage - 5000) / 5000));
  }, [stage, voltage]);

  const targetTemperature = useMemo(() => {
    if (!showTarget || stage !== 'Cathode Rays (Electron Beam)') return 20; // Room temp
    // Heat increases with beam intensity
    return 20 + beamIntensity * 800; // max ~820C (glowing red hot)
  }, [showTarget, stage, beamIntensity]);

  // Deflection calculations (approximated for visual effect)
  const deflectionY = useMemo(() => {
    if (stage !== 'Cathode Rays (Electron Beam)') return 0;
    
    // Electrons are negatively charged, so they deflect opposite to E-field direction (towards + plate)
    const eDeflection = -(electricField / 100) * 100; // max 100px deflection

    return eDeflection; // Final visual Y offset
  }, [stage, electricField]);

  return {
    // State
    voltage, setVoltage,
    pressure, setPressure,
    electricField, setElectricField,
    showMalteseCross, setShowMalteseCross,
    showFluorescentScreen, setShowFluorescentScreen,
    showTarget, setShowTarget,
    
    // Derived
    stage,
    electronSpeed,
    beamIntensity,
    targetTemperature,
    deflectionY,
  };
}
