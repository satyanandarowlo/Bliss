import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';

interface MeditationDurationProps {
  started: boolean;  // Receive a started prop
}

const MeditationDuration: React.FC<MeditationDurationProps> = ({ started }) => {
  const [duration, setDuration] = useState<number>(0);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (started) {
      startTimeRef.current = Date.now(); // Set the start time when meditation starts
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        setDuration((now - startTimeRef.current) / 1000); // Update the duration every second in seconds
      }, 1000);
    } else {
      // Reset duration when meditation stops
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDuration(0);
    }

    return () => {
      // Cleanup interval when component unmounts
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started]);

  // Function to convert seconds into hours, minutes, and seconds
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  return (
    <Text style={styles.text}>Meditation duration: {formatTime(duration)}</Text>
  );
};

export default MeditationDuration;

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
