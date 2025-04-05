import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native'; // Use navigation hook

export default function Result() {
  const { image_url, detections } = useLocalSearchParams(); // ✅ Use annotated image URL
  const detectedObjects = JSON.parse(detections || '[]');
  const navigation = useNavigation(); // Get navigation object


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detection Results</Text>
      
      {/* ✅ Show Annotated Image */}
      {image_url && <Image source={{ uri: image_url }} style={styles.image} />}
      
      {detectedObjects.length > 0 ? (
        <>
          {detectedObjects.map((det, index) => (
            <View key={index} style={styles.resultBox}>
              <Text>Label: {det.label}</Text>
              <Text>Confidence: {det.confidence}</Text>
              <Text>Bounding Box: {det.bounding_box.join(', ')}</Text>
            </View>
          ))}

          {/* Show Predict Disease button if dog is detected */}
          <Button title="Predict Disease" onPress={() => navigation.navigate('DiseaseSelectionScreen')} />
        </>
      ) : (
        <Text style={styles.noDetection}>No dog detected.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#E3F2FD' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 300, height: 300, marginBottom: 20 },
  resultBox: { width: '90%', padding: 10, backgroundColor: '#FFF', borderRadius: 10, marginBottom: 10 },
  noDetection: { fontSize: 18, color: 'red', marginTop: 20 },
});
