import React, {useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback'); // Ensure it plays in background

interface BackgroundEffectPlayerProps {
  started: boolean;
}

const BackgroundEffectPlayer: React.FC<BackgroundEffectPlayerProps> = ({
  started,
}) => {
  const soundRef = useRef<Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to gradually reduce the volume over 10 minutes
  const fadeOutVolume = () => {
    let volume = 1.0; // Start at 100% volume
    const fadeDuration = 600; // 600 seconds (10 minutes)
    const fadeStep = 1 / fadeDuration; // Amount to reduce volume by each second

    intervalRef.current = setInterval(() => {
      volume -= fadeStep;
      if (soundRef.current && volume > 0) {
        soundRef.current.setVolume(volume);
      } else {
        // Clear interval and stop when volume reaches 0
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (soundRef.current) soundRef.current.stop();
      }
    }, 1000); // Adjust the volume every second
  };

  useEffect(() => {
    if (started) {
      // Load the sound and start playing
      soundRef.current = new Sound(
        require('./assets/ocean-waves-112906.mp3'),
        error => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          soundRef.current.setVolume(1.0); // Start at full volume
          soundRef.current.setNumberOfLoops(-1); // Loop the sound indefinitely
          soundRef.current.play(success => {
            if (!success) {
              console.log('Sound playback failed');
            }
          });
          fadeOutVolume(); // Start the volume fade-out
        },
      );
    } else {
      // Stop the sound if it's playing
      if (soundRef.current) {
        soundRef.current.stop(() => {
          console.log('Sound stopped');
        });
      }
    }

    return () => {
      // Clean up the sound instance and interval to avoid memory leaks
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (soundRef.current) {
        soundRef.current.release();
        console.log('Sound stopped through release');
        soundRef.current = null;
      }
    };
  }, [started]);

  return (
    <View>
      <Text style={{fontSize: 24, color: '#fff', textAlign: 'center'}}>
        {started ? 'Playing Background Effect' : 'Background Effect Stopped'}
      </Text>
    </View>
  );
};

export default BackgroundEffectPlayer;
