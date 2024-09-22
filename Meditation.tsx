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
  const [countdown, setCountdown] = useState<number>(3); // Countdown timer
  const [totalDuration, setTotalDuration] = useState<number>(0); // Track meditation duration
  const [currentDelay, setCurrentDelay] = useState<number>(0); // Current trance gap for display
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store the timeout for stopping

  // Binaural beats settings
  const [baseFrequency, setBaseFrequency] = useState<number>(100); // Base frequency default
  const [beatFrequency, setBeatFrequency] = useState<number>(4); // Beat frequency default
  const [duration, setDuration] = useState<number>(4000); // Duration default

  // Load the bell sound
  const bellAudio = useRef<Sound>(
    new Sound(require('./assets/bell-a-99888.mp3'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load the bell sound', error);
      }
    })
  ).current;

  // Load the sea sound and set it to loop
  const seaAudio = useRef<Sound>(
    new Sound(require('./assets/ocean-waves-112906.mp3'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load the sea sound', error);
      } else{
        // seaAudio.setNumberOfLoops(-1);
        // seaAudio.play();
        console.log("Sea sound loaded successfully, ready to play.");
      }
      console.log("out of error or success code for sea audio");
    })
  ).current;

  // Function to play the sea sound and detect when it finishes
const playSeaSound = () => {
  seaAudio.play((success) => {
    if (!success) {
      console.error("Playback failed due to audio decoding errors.");
    } else {
      console.log("Sea sound finished playing.");
      // Replay the sea sound if needed
      playSeaSound(); // This will keep it looping manually if necessary
    }
  });
};

  // Prevent the screen from locking during the session
  useEffect(() => {
    if (started) {
      KeepAwake.activate(); // Prevent the screen from locking
    }

    return () => {
      KeepAwake.deactivate(); // Allow screen lock after the session
      // seaAudio.stop(); // Stop sea sound when the session ends
      stopBinauralBeats(); // Stop binaural beats
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
    setCurrentDelay(delay / 1000); // Display initial trance gap in seconds
    startTimeRef.current = Date.now();
    console.log("playing sea sound");
    // seaAudio.setCurrentTime(0);
    // seaAudio.setNumberOfLoops(2);
    // seaAudio.setNumberOfLoops(-1); // Loop infinitely
    // seaAudio.setCurrentTime(0); // Start from the beginning  
    // seaAudio.play(); // Start playing the sea sound in loop
    playSeaSound();
    playBinauralBeats(); // Start the binaural beats
    timeoutRef.current = setTimeout(playBellSoundAndIncreaseDelay, delay); // Start the bell sound and delay cycle
  }; 

  // Play bell sound and gradually increase the gap
  const playBellSoundAndIncreaseDelay = () => {
    bellAudio.setCurrentTime(0); // Reset bell audio to the start
    bellAudio.play(); // Play bell sound

    // Increment the delay by 5%
    setDelay((prevDelay) => {
      const newDelay = prevDelay * 1.01; // Increase delay by 1%
      const now = Date.now();
      setTotalDuration(now - startTimeRef.current); // Update meditation duration
      setCurrentDelay(newDelay / 1000); // Update displayed delay

      // Schedule the next bell with the updated delay
      timeoutRef.current = setTimeout(playBellSoundAndIncreaseDelay, newDelay);

      return newDelay; // Return the new delay
    });
  };

  // Stop the meditation and reset everything
  const handleStop = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Clear any ongoing timeouts
    bellAudio.stop(); // Stop bell sound
    seaAudio.stop(() => {
      seaAudio.release(); // Release sea sound resources after stopping
    });
    stopBinauralBeats(); // Stop binaural beats
    setStarted(false);
    setIsCountingDown(false);
    setCountdown(3); // Reset countdown to 10 seconds
    setTotalDuration(0); // Reset meditation duration
    setCurrentDelay(0); // Reset trance gap
    setDelay(1000); // Reset delay to initial 1 second
  };

  // Start countdown
  const handleStart = () => {
    setIsCountingDown(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleStart} style={styles.startButton}>
                  <Text style={styles.buttonText}>Start Meditation</Text>
                </TouchableOpacity>
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
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
  },
  buttonText: {
    fontSize: 20,
    color: '#6e8efb',
    fontWeight: 'bold',
  },
});
