import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Result() {
  const { image } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disease Detection Result</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text>Processing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  image: { width: 300, height: 300, marginBottom: 20 },
});
