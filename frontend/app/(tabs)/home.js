import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const detectDog = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: image,
      name: 'dog.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('http://192.168.1.28:8000/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { detections, image_url } = response.data;  // ✅ Get annotated image URL

      router.push({
        pathname: '/result',
        params: { image_url, detections: JSON.stringify(detections) }, // ✅ Pass annotated image
      });
    } catch (error) {
      console.error("Detection failed:", error);
      Alert.alert("Error", "Failed to detect dog. Check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Dog Image</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Choose Image" onPress={pickImage} />
      {image && (
      <View style={{ marginTop: 20 }}>
        <Button title="Detect Dog" onPress={detectDog} disabled={isLoading} />
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E3F2FD' },
  title: { fontSize: 20, marginBottom: 20 },
  image: { width: 300, height: 300, marginBottom: 20 },
});
