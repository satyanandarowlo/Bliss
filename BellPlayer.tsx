import React, {useState, useEffect, useRef} from 'react';
import {Text} from 'react-native';
import Sound from 'react-native-sound';

interface BellPlayerProps {
  started: boolean;
}

const BellPlayer: React.FC<BellPlayerProps> = ({started}) => {
  const [delay, setDelay] = useState<number>(1000); // Initial delay of 1 second
  const [currentDelay, setCurrentDelay] = useState<number>(delay / 1000); // Display the delay
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store timeout
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Store interval for fade-out

  const bellAudio = useRef<Sound>(
    new Sound(
      require('./assets/bell-a-99888.mp3'),
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.error('Failed to load bell sound', error);
        } else {
          console.log('Bell sound loaded successfully');
        }
      },
    ),
  ).current;

  // Function to gradually reduce the volume over 10 minutes
  const fadeOutVolume = () => {
    let volume = 1.0; // Start at 100% volume
    const fadeDuration = 1200; // 600 seconds (20 minutes)
    const fadeStep = 1 / fadeDuration; // Amount to reduce volume by each second

    intervalRef.current = setInterval(() => {
      volume -= fadeStep;
      if (volume > 0) {
        bellAudio.setVolume(volume);
      } else {
        // Clear interval and stop when volume reaches 0
        if (intervalRef.current) clearInterval(intervalRef.current);
        bellAudio.stop();
      }
    }, 1000); // Adjust the volume every second
  };

  // Function to play the bell sound and increase delay
  const playBellSound = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    bellAudio.setCurrentTime(0); // Reset sound
    bellAudio.play();

    setDelay(prevDelay => {
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
      fadeOutVolume(); // Start fade out logic
    } else {
      // Stop everything if started is false
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current); // Clear fade-out
      bellAudio.stop();
      bellAudio.setVolume(1.0); // Reset volume for next play
      setDelay(1000); // Reset delay
      setCurrentDelay(1); // Reset display
    }

    return () => {
      // Clean up everything on unmount
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      bellAudio.stop();
    };
  }, [started]);

  return (
    <Text style={{fontSize: 24, color: '#fff', textAlign: 'center'}}>
      Trance gap: {currentDelay.toFixed(2)} seconds
    </Text>
  );
};

export default BellPlayer;
