// import React from 'react';
// import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';

// export default function Result() {
//   const { image, detections } = useLocalSearchParams();
//   const detectedObjects = JSON.parse(detections || '[]');
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Detection Results</Text>
//       {image && <Image source={{ uri: image }} style={styles.image} />}
//       {detectedObjects.length > 0 ? (
//         detectedObjects.map((det, index) => {
//           const [x1, y1, x2, y2] = det.bounding_box; // Extract coordinates

//           return (
//             <View key={index} style={styles.resultBox}>
//               <Text>Label: {det.label}</Text>
//               <Text>Confidence: {det.confidence}</Text>
//               <Text>
//                 Bounding Box: ({x1}, {y1}), ({x2}, {y2})
//               </Text> 
//             </View>
//           );
//         })
//       ) : (
//         <Text style={styles.noDetection}>No dog detected.</Text>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#E3F2FD' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   image: { width: 300, height: 300, marginBottom: 20 },
//   resultBox: { width: '90%', padding: 10, backgroundColor: '#FFF', borderRadius: 10, marginBottom: 10 },
//   noDetection: { fontSize: 18, color: 'red', marginTop: 20 },
// });

import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Result() {
  const { image, detections } = useLocalSearchParams();
  const detectedObjects = JSON.parse(detections || '[]');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detection Results</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      
      {detectedObjects.length > 0 ? (
        <>
          {detectedObjects.map((det, index) => (
            <View key={index} style={styles.resultBox}>
              <Text>Label: {det.label}</Text>
              <Text>Confidence: {det.confidence}</Text>
              <Text>Bounding Box: {det.bounding_box.join(', ')}</Text>
            </View>
          ))}

          {/* Show Predict Image button if dog is detected */}
          <Button title="Predict Disease" onPress={() => console.log("Predict Disease clicked!")} />
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