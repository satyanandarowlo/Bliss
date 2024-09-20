import React, { useState, useEffect, useRef } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet, Image, NativeModules, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
const { BinauralBeats } = NativeModules;

import Sound from 'react-native-sound';
import KeepAwake from 'react-native-keep-awake';

const Meditation: React.FC = () => {
  const [delay, setDelay] = useState<number>(1000); // Initial trance gap in milliseconds
  const [started, setStarted] = useState<boolean>(false);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10); // Countdown timer
  const [totalDuration, setTotalDuration] = useState<number>(0); // Track meditation duration
  const [currentDelay, setCurrentDelay] = useState<number>(0); // Current trance gap for display
  const [baseFrequency, setBaseFrequency] = useState<number>(100); // Base frequency default
  const [beatFrequency, setBeatFrequency] = useState<number>(4); // Beat frequency default
  const [duration, setDuration] = useState<number>(120); // Duration default
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
    }
    return () => clearTimeout(countdownTimer);
  }, [countdown, isCountingDown]);

  // Function to play binaural beats
  const playBinauralBeats = () => {
    BinauralBeats.playBinauralBeats(baseFrequency, beatFrequency, duration); 
  };

  // Function to stop binaural beats
  const stopBinauralBeats = () => {
    BinauralBeats.stopBinauralBeats();
  };

  // Start Meditation after countdown finishes
  const handleStartMeditation = () => {
    setStarted(true);
    setCurrentDelay(delay / 1000); 
    startTimeRef.current = Date.now();
    timeoutRef.current = setTimeout(playSoundAndIncreaseDelay, delay);
  };

  // Play sound and increase trance gap gradually
  const playSoundAndIncreaseDelay = () => {
    if (audio) {
      audio.setCurrentTime(0);
      audio.play();
      setDelay(delay * 1.05);
      const now = Date.now();
      setTotalDuration(now - startTimeRef.current); 
      setCurrentDelay(delay / 1000); 
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
      clearTimeout(timeoutRef.current); 
    }
    audio.stop(); 
    setStarted(false); 
    setIsCountingDown(false); 
    setCountdown(10); 
    setTotalDuration(0); 
    setCurrentDelay(0); 
    setDelay(1000); 
  };

  // Render dropdown options for base frequency, beat frequency, and duration
  const renderPickerItems = (range: number[], step = 1) =>
    range.map((value, index) => (
      <Picker.Item key={index} label={`${value}`} value={value} />
    ));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}
    showsVerticalScrollIndicator={false} 
    >
      <View style={styles.container}>
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
              <View>
                {/* Base Frequency Picker */}
                <Text style={styles.pickerLabel}>Base Frequency (Hz):</Text>
                <Picker
                  selectedValue={baseFrequency}
                  onValueChange={(value) => setBaseFrequency(value)}
                  style={styles.picker}
                >
                  {renderPickerItems(Array.from({ length: 35 }, (_, i) => 60 + i * 10))}
                </Picker>

                {/* Beat Frequency Picker */}
                <Text style={styles.pickerLabel}>Beat Frequency (Hz):</Text>
                <Picker
                  selectedValue={beatFrequency}
                  onValueChange={(value) => setBeatFrequency(value)}
                  style={styles.picker}
                >
                  {renderPickerItems(Array.from({ length: 40 }, (_, i) => 1 + i))}
                </Picker>

                {/* Duration Picker */}
                <Text style={styles.pickerLabel}>Duration (seconds):</Text>
                <Picker
                  selectedValue={duration}
                  onValueChange={(value) => setDuration(value)}
                  style={styles.picker}
                >
                  {renderPickerItems(Array.from({ length: 120 }, (_, i) => 60 + i * 60))}
                </Picker>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleStart} style={styles.startButton}>
                    <Text style={styles.buttonText}>Start Meditation</Text>
                  </TouchableOpacity>
                  <Button title="Play Binaural Beats" onPress={playBinauralBeats} />
                  <Button title="Stop Binaural Beats" onPress={stopBinauralBeats} />
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Meditation;

// Styles for the component
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  pickerLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  picker: {
    width: 300,
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom:40,
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
    marginBottom: 20,
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
    marginBottom: 20,
    paddingBottom:50,
  },
  buttonText: {
    fontSize: 20,
    color: '#6e8efb',
    fontWeight: 'bold',
  },
});
