import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';  // ✅ Use this instead of navigation

export default function Home() {
  const router = useRouter();  // ✅ Get router instance
  const [image, setImage] = useState(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Dog Image</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Choose Image" onPress={pickImage} />
      {image && (
        <Button
          title="Analyze Disease"
          onPress={() => router.push({ pathname: '/result', params: { image } })}  // ✅ Fix navigation issue
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  image: { width: 300, height: 300, marginBottom: 20 },
});
