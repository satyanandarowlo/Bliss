import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

interface CountdownTimerProps {
  initialCount: number;
  onCountdownFinish: () => void;
  started: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialCount, onCountdownFinish, started }) => {
  const [countdown, setCountdown] = useState<number>(initialCount);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout | null = null;
    if (started && countdown > 0) {
      countdownTimer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (started && countdown === 0) {
      onCountdownFinish(); // Notify parent that countdown finished
    }

    return () => {
      if (countdownTimer) clearTimeout(countdownTimer);
    };
  }, [countdown, started]);

  return (
    <Text style={{ fontSize: 24, color: '#fff', textAlign: 'center' }}>
      Meditation starts in {countdown}...
    </Text>
  );
};

export default CountdownTimer;
