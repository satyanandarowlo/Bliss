import React, { useState, useEffect, useRef } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet, Image, NativeModules } from 'react-native';
const { BinauralBeats } = NativeModules;

import Sound from 'react-native-sound';
import KeepAwake from 'react-native-keep-awake';

// Define the meditation component
const Meditation: React.FC = () => {
  let [delay, setDelay] = useState<number>(1000); // Initial trance gap in milliseconds
  const [started, setStarted] = useState<boolean>(false);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10); // Countdown timer
  const [totalDuration, setTotalDuration] = useState<number>(0); // Track meditation duration
  const [currentDelay, setCurrentDelay] = useState<number>(0); // Current trance gap for display
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store the timeout for stopping

  // Load the sound
  const audio = useRef<Sound>(
    new Sound(require('./assets/bell-a-99888.mp3'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
      }
    })
  ).current;

  // Prevent the screen from locking during the session
  useEffect(() => {
    if (started) {
      KeepAwake.activate(); // Prevent the screen from locking
    }

    return () => {
      KeepAwake.deactivate(); // Allow screen lock after the session
    };
  }, [started]);

  // Countdown logic
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      countdownTimer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleStartMeditation();
      // playBinauralBeats();
    }
    return () => clearTimeout(countdownTimer);
  }, [countdown, isCountingDown]);

  // Function to play binaural beats
  const playBinauralBeats = () => {
    // Call the native function to start playing the binaural beats
    BinauralBeats.playBinauralBeats(100,4,120); // Base frequency 440 Hz, beat frequency 4 Hz
  };

  // Function to stop binaural beats
  const stopBinauralBeats = () => {
    // Call the native function to stop playing the binaural beats
    BinauralBeats.stopBinauralBeats();
  };

  // Start Meditation after countdown finishes
  const handleStartMeditation = () => {
    setStarted(true);
    setCurrentDelay(delay / 1000); // Display initial trance gap in seconds
    startTimeRef.current = Date.now();
    timeoutRef.current = setTimeout(playSoundAndIncreaseDelay, delay);
  };

  // Play sound and increase trance gap gradually
  const playSoundAndIncreaseDelay = () => {
    if (audio) {
      audio.setCurrentTime(0);
      audio.play();

      delay = delay * 1.05; // Increase delay by 5%
      setDelay(delay);

      const now = Date.now();
      setTotalDuration(now - startTimeRef.current); // Update meditation duration
      setCurrentDelay(delay / 1000); // Update displayed trance gap

      // Schedule the next sound after the updated delay
      timeoutRef.current = setTimeout(playSoundAndIncreaseDelay, delay);
    }
  };

  // Start countdown
  const handleStart = () => {
    setIsCountingDown(true);
  };

  // Stop the meditation and reset everything
  const handleStop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any ongoing timeouts
    }
    audio.stop(); // Stop any ongoing sound
    setStarted(false); // Reset started state
    setIsCountingDown(false); // Ensure countdown does not restart
    setCountdown(10); // Reset countdown to 10 seconds
    setTotalDuration(0); // Reset meditation duration
    setCurrentDelay(0); // Reset trance gap
    setDelay(1000); // Reset delay
  };

  return (
    <View style={styles.container}>
      {/* Add logo at the top */}
      <Image source={require('./assets/logo.png')} style={styles.logo} />

      {isCountingDown && countdown > 0 ? (
        <View style={styles.countdown}>
          <Text style={styles.text}>Meditation starts in {countdown}...</Text>
        </View>
      ) : (
        <>
          {started ? (
            <View style={styles.meditationInfo}>
              <Text style={styles.text}>Trance gap: {currentDelay.toFixed(2)} seconds</Text>
              <Text style={styles.text}>Meditation duration: {(totalDuration / 1000).toFixed(2)} seconds</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleStop} style={styles.stopButton}>
                  <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleStart} style={styles.startButton}>
                <Text style={styles.buttonText}>Start Meditation</Text>
              </TouchableOpacity>
              <Button title="Play Binaural Beats" onPress={playBinauralBeats} />
              <Button title="Stop Binaural Beats" onPress={stopBinauralBeats} /> 

            </View>
          )}
        </>
      )}
    </View>
  );
};

export default Meditation;

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#6e8efb',
    paddingTop: 50,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countdown: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  meditationInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30, // Add space at the top
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 20, // Add space between buttons
  },
  stopButton: {
    backgroundColor: '#ff5252',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 20, // Add space between buttons
  },
  buttonText: {
    fontSize: 20,
    color: '#6e8efb',
    fontWeight: 'bold',
  },
});

