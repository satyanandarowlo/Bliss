import React, {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import {NativeModules} from 'react-native';

const {BinauralBeats} = NativeModules;

interface BinauralBeatsControlProps {
  started: boolean;
  baseFrequency: number;
  beatFrequency: number;
  duration: number;
}

const BinauralBeatsControl: React.FC<BinauralBeatsControlProps> = ({
  started,
  baseFrequency,
  beatFrequency,
  duration,
}) => {
  const [currentVolume, setCurrentVolume] = useState<number>(0.0); // Track volume
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to handle volume fade-in from initial volume to 100%
  const fadeInVolume = (
    initialVolume: number,
    startMinute: number,
    endMinute: number,
  ) => {
    let volume = initialVolume;
    const fadeStartTime = startMinute * 60 * 1000; // Convert minutes to milliseconds
    const fadeEndTime = endMinute * 60 * 1000;
    const fadeDuration = fadeEndTime - fadeStartTime; // Total duration to fade

    const volumeStep = 1.0 / (fadeDuration / 1000); // Volume increment per second

    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (volume < 1.0) {
          volume += volumeStep;
          const newVolume = Math.min(volume, 1.0); // Ensure volume doesn't exceed 1.0
          BinauralBeats.setVolume(newVolume); // Set volume natively
          setCurrentVolume(newVolume); // Update volume in state
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current); // Stop interval once volume is at 100%
        }
      }, 1000); // Increase the volume every second
    }, fadeStartTime); // Start fading in after the set start minute
  };

  useEffect(() => {
    if (started) {
      BinauralBeats.playBinauralBeats(
        baseFrequency,
        beatFrequency,
        duration,
        0.0, // Start with volume 0.0
      );

      fadeInVolume(0.0, 15, 20); // Call fadeInVolume to increase volume from 0% at 9 minutes to 100% at 20 minutes
    } else {
      BinauralBeats.stopBinauralBeats();
      if (intervalRef.current) clearInterval(intervalRef.current); // Clear the interval
    }

    return () => {
      BinauralBeats.stopBinauralBeats(); // Cleanup when component unmounts
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started]);

  return (
    <View style={{alignItems: 'center', marginTop: 20}}>
      <Text style={{fontSize: 18, color: '#fff'}}>
        {started
          ? `Beats Volume: ${(currentVolume * 100).toFixed(2)}%`
          : 'Beats Stopped'}
      </Text>
    </View>
  );
};

export default BinauralBeatsControl;
