import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ErrorLogger = () => {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Save original console.error method
    const originalConsoleError = console.error;

    // Override console.error
    console.error = (...args) => {
      setErrors(prevErrors => [...prevErrors, args.join(' ')]);
      originalConsoleError.apply(console, args);
    };

    // Clean up to restore original console.error
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <ScrollView style={styles.logContainer}>
      {errors.length > 0 ? (
        errors.map((error, index) => (
          <Text key={index} style={styles.errorText}>
            {error}
          </Text>
        ))
      ) : (
        <Text style={styles.noErrorText}>No errors logged</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logContainer: {
    flex: 1,
    backgroundColor: '#f8d7da',
    padding: 10,
  },
  errorText: {
    color: '#721c24',
    marginBottom: 10,
  },
  noErrorText: {
    color: '#155724',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ErrorLogger;
