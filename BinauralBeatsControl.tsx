import React, { useEffect } from 'react';
import { NativeModules } from 'react-native';

const { BinauralBeats } = NativeModules;

interface BinauralBeatsControlProps {
  started: boolean;
  baseFrequency: number;
  beatFrequency: number;
  duration: number;
}

const BinauralBeatsControl: React.FC<BinauralBeatsControlProps> = ({ started, baseFrequency, beatFrequency, duration }) => {

  useEffect(() => {
    if (started) {
      BinauralBeats.playBinauralBeats(baseFrequency, beatFrequency, duration);
    } else {
      BinauralBeats.stopBinauralBeats();
    }

    return () => {
      BinauralBeats.stopBinauralBeats(); // Cleanup when component unmounts or stops
    };
  }, [started]);

  return null; // No UI for binaural beats, purely functional
};

export default BinauralBeatsControl;
