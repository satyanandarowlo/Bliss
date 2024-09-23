import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'react-native';
import Sound from 'react-native-sound';

interface BellPlayerProps {
  started: boolean;
}

const BellPlayer: React.FC<BellPlayerProps> = ({ started }) => {
  const [delay, setDelay] = useState<number>(1000); // Initial delay of 1 second
  const [currentDelay, setCurrentDelay] = useState<number>(delay / 1000); // Display the delay
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store timeout
  const bellAudio = useRef<Sound>(
    new Sound(require('./assets/bell-a-99888.mp3'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load bell sound', error);
      }
      console.log("now playing bell");
    })
  ).current;

  // Function to play the bell sound and increase delay
  const playBellSound = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    bellAudio.setCurrentTime(0); // Reset sound
    bellAudio.play();

    setDelay((prevDelay) => {
      const newDelay = prevDelay * 1.01; // Increase by 1%
      setCurrentDelay(newDelay / 1000); // Update display
      timeoutRef.current = setTimeout(playBellSound, newDelay);
      return newDelay;
    });
  };

  // Start or stop the bell based on started prop
  useEffect(() => {
    if (started) {
      timeoutRef.current = setTimeout(playBellSound, delay);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      bellAudio.stop();
      setDelay(1000); // Reset
      setCurrentDelay(1);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      bellAudio.stop();
    };
  }, [started]);

  return (
    <Text style={{ fontSize: 24, color: '#fff', textAlign: 'center' }}>
      Trance gap: {currentDelay.toFixed(2)} seconds
    </Text>
  );
};

export default BellPlayer;
