import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VetContactScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vet Contact Information</Text>
      <Text style={styles.text}>Dr. John Doe - +1 234 567 890</Text>
      <Text style={styles.text}>Dr. Jane Smith - +1 987 654 321</Text>
      <Text style={styles.header}>Nearby Vet Hospitals</Text>
      <Text style={styles.text}>Animal Care Hospital, 123 Pet Street</Text>
      <Text style={styles.text}>Healthy Dogs Clinic, 456 Dog Lane</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0D47A1',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});
