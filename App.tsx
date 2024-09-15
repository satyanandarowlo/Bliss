import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { onAuthStateChanged, signOut } from './authService'; // Auth service
import AuthForm from './AuthForm'; // Login/Sign Up form component
import Meditation from './Meditation'; // Meditation component

const App: React.FC = () => {
  const [user, setUser] = useState('');

  // Monitor authentication state
  useEffect(() => {
    const subscriber = onAuthStateChanged((user) => {
      setUser(user);
    });
    return subscriber; // Unsubscribe on unmount
  }, []);

  return (
    <View style={styles.container}>
      {!user ? (
        <AuthForm /> 
        // Show authentication form if not logged in
      ) : (
        <>
          <Button title="Logout" onPress={signOut} /> 
          {/* Add Logout button */}
          {/* <View/> */}
          <Meditation /> 
          {/* Show meditation section */}
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
});
