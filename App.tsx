import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Button, TextInput, StyleSheet, Image } from 'react-native';
import Sound from 'react-native-sound';
import KeepAwake from 'react-native-keep-awake';
import { signInWithGoogle, signUpWithEmail, signInWithEmail, onAuthStateChanged } from './authService'; // Import authService

const App: React.FC = () => {
  // Existing meditation state
  let [delay, setDelay] = useState<number>(1000);
  const [started, setStarted] = useState<boolean>(false);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [currentDelay, setCurrentDelay] = useState<number>(0);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audio = useRef<Sound>(
    new Sound(require('./assets/bell-a-99888.mp3'), Sound.MAIN_BUNDLE, (error) => {
      if (error) console.error('Failed to load the sound', error);
    })
  ).current;

  // Authentication state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');

  // Monitor authentication state
  useEffect(() => {
    const subscriber = onAuthStateChanged((user) => {
      setUser(user);
    });
    return subscriber; // Unsubscribe on unmount
  }, []);

  // Meditation countdown logic
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

      delay = delay * 1.05; // Increase delay by 5%
      setDelay(delay);

      const now = Date.now();
      setTotalDuration(now - startTimeRef.current); // Update meditation duration
      setCurrentDelay(delay / 1000); // Update displayed trance gap

      // Schedule the next sound after the updated delay
      timeoutRef.current = setTimeout(playSoundAndIncreaseDelay, delay);
    }
  };

  const handleStart = () => setIsCountingDown(true);

  const handleStop = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    audio.stop();
    setStarted(false);
    setIsCountingDown(false);
    setCountdown(10);
    setTotalDuration(0);
    setCurrentDelay(0);
    setDelay(1000);
  };

  return (
    <View style={styles.container}>
      {!user ? (
        <View>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
          <Button title="Sign Up with Email" onPress={() => signUpWithEmail(email, password)} />
          <Button title="Login with Email" onPress={() => signInWithEmail(email, password)} />
          <Button title="Sign in with Google" onPress={signInWithGoogle} />
        </View>
      ) : (
        <>
          <View style={styles.imageContainer}>
            <Image source={require('./assets/logo.png')} style={styles.logo} />
          </View>
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
        </>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#6e8efb',
    paddingTop: 50,
  },
  imageContainer: {
    paddingBottom: 150,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'contain',
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
    flexDirection: 'row',
    marginTop: 10,
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
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginLeft: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#6e8efb',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});
