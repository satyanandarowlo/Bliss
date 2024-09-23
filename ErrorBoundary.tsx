import React, { Component, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// ErrorBoundary Class Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true, error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>An error occurred:</Text>
          <Text style={styles.errorDetails}>{this.state.error?.toString()}</Text>
          <Text style={styles.errorDetails}>{this.state.errorInfo?.componentStack}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

const styles = StyleSheet.create({
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  errorDetails: {
    fontSize: 14,
    color: '#d32f2f',
    marginTop: 10,
  },
});
