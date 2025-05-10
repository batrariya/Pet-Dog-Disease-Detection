import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function SkinDiseaseScreen() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(null);
  const [predictedDisease, setPredictedDisease] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // Controls the "Next Steps" button visibility

  // const handleImageUpload = async () => {
  //   const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (!permissionResult.granted) {
  //     Alert.alert('Permission Denied', 'You need to allow access to the media library.');
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setSelectedImage(result.assets[0].uri);
  //     setPredictedDisease(null);
  //     setShowOptions(false);
  //   }
  // };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow access to the media library.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      // Updated to handle different result structures
      const imageUri = result.assets ? result.assets[0].uri : result.uri;
      setSelectedImage(imageUri);
      setPredictedDisease(null);
      setShowOptions(false);
    }
  };
  

  const handlePredictDisease = async () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please upload an image first.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        name: 'skin_image.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch('http://192.168.1.28:8000/predict_skin_disease', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setPredictedDisease(data.prediction);
        setShowOptions(true);
      } else {
        Alert.alert('Prediction Failed', data.error || 'Error occurred while predicting.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to predict disease at this time.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextSteps = () => {
    if (predictedDisease === 'Healthy') {
      Alert.alert('Great!', "Your pet's skin looks healthy. No action needed.");
    } else {
      Alert.alert(
        'Recommended Actions',
        `For ${predictedDisease}, you can:\n\n- Contact a Vet\n- Try Home Remedies`,
        [
          { text: 'Contact Vet', onPress: () => router.push('/VetContactScreen') },
          { text: "View Remedies", onPress: () => router.push(`/HomeRemediesScreen?disease=${predictedDisease}`) }, // ✅ Pass params this way
        ]
      );
    }
  };    

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Dog's Skin Image</Text>
      <Button title="Upload Image" onPress={handleImageUpload} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      
      <View style={{ marginTop: 20 }}>
        <Button title="Predict Disease" onPress={handlePredictDisease} disabled={loading} />
      </View>

      {loading && <ActivityIndicator size="large" color="#0D47A1" style={styles.loader} />}
      
      {predictedDisease && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Prediction: {predictedDisease}</Text>
        </View>
      )}

      {showOptions && (
        <TouchableOpacity style={styles.nextStepsButton} onPress={handleNextSteps}>
          <Text style={styles.nextStepsText}>Next Steps</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 20,
    color: '#0D47A1',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0D47A1',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFD54F',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nextStepsButton: {
    marginTop: 20,
    backgroundColor: '#388E3C',
    padding: 12,
    borderRadius: 10,
  },
  nextStepsText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
});

