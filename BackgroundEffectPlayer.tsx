import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback'); // Ensure it plays in background

interface BackgroundEffectPlayerProps {
  started: boolean;
}

const BackgroundEffectPlayer: React.FC<BackgroundEffectPlayerProps> = ({ started }) => {
  const soundRef = useRef(null);

  useEffect(() => {
    if (started) {
      // Load the sound and start playing
      soundRef.current = new Sound(require('./assets/ocean-waves-112906.mp3'), (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        soundRef.current.setNumberOfLoops(-1); // Loop the sound indefinitely
        soundRef.current.play((success) => {
          if (!success) {
            console.log('Sound playback failed');
          }
        });
      });
    } else {
      // Stop the sound if it's playing
      if (soundRef.current) {
        soundRef.current.stop(() => {
          console.log('Sound stopped');
        });
      }
    }

    return () => {
      // Clean up the sound instance to avoid memory leaks
      if (soundRef.current) {
        soundRef.current.release();
        console.log('Sound stopped through release');
        soundRef.current = null;
      }
    };
  }, [started]);

  return (
    <View >
      <Text style={{ fontSize: 24, color: '#fff', textAlign: 'center' }}>{started ? 'Playing Background Effect' : 'Background Effect Stopped'}</Text>
    </View>
  );
};

export default BackgroundEffectPlayer;
