import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

export default function DiseaseSelectionScreen() {
  const router = useRouter(); // Initialize the router

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select the Disease Type</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Eye Disease"
          onPress={() => router.push('/eye-disease')} // Navigate to EyeDiseaseScreen
        />
      </View>
      {/* <View style={styles.buttonContainer}>
        <Button
          title="Paw Disease"
          onPress={() => router.push('/paw-disease')} // Navigate to PawDiseaseScreen
        />
      </View> */}
      <View style={styles.buttonContainer}>
        <Button
          title="Skin Disease"
          onPress={() => router.push('/skin-disease')} // Navigate to SkinDiseaseScreen
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F2FD', // Light blue background
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0D47A1', // Dark blue color for text
  },
  buttonContainer: {
    width: '80%', // Button width
    marginBottom: 15, // Space between buttons
  },
});
