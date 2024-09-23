import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Text, StyleSheet, Image } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import MeditationDuration from './MeditationDuration';
import BellPlayer from './BellPlayer';
import CountdownTimer from './CountdownTimer';
import BinauralBeatsControl from './BinauralBeatsControl';
import BackgroundEffectPlayer from './BackgroundEffectPlayer';

const Meditation: React.FC = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownFinished, setCountdownFinished] = useState<boolean>(false);
  const [soundSelection, setSoundSelection] = useState<'ocean' | 'birds' | 'rain'>('ocean');

  // Handle countdown finish
  const onCountdownFinish = () => {
    setCountdownFinished(true);
    console.log("counting finished");
    setStarted(true); // Start the meditation once the countdown is finished
  };

  // Handle start
  const handleStart = () => {
    setIsCountingDown(true);
  };

  // Handle stop
  const handleStop = () => {
    setStarted(false);
    setIsCountingDown(false);
    setCountdownFinished(false); // Reset countdown state
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />

        {isCountingDown && !countdownFinished ? (
          <CountdownTimer initialCount={3} onCountdownFinish={onCountdownFinish} started={isCountingDown} />
        ) : (
          <>
            {started ? (
              <View style={styles.meditationInfo}>
                <MeditationDuration started={started} />
                <BellPlayer started={started} />
                <BackgroundEffectPlayer started={started} />
                <BinauralBeatsControl started={started} baseFrequency={100} beatFrequency={4} duration={4000} />
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

        {/* Display values of the variables at the bottom */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Is Counting Down: {isCountingDown ? 'Yes' : 'No'}</Text>
          <Text style={styles.debugText}>Countdown Finished: {countdownFinished ? 'Yes' : 'No'}</Text>
          <Text style={styles.debugText}>Started: {started ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Meditation;

// Styles
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
    color: '#6e8fb',
    fontWeight: 'bold',
  },
  // Debug info styles
  debugInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 16,
    color: '#fff',
  },
});
