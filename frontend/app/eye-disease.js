// import React, { useState } from 'react';
// import { View, Text, Button, Image, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// export default function EyeDiseaseScreen() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [segmentationImage, setSegmentationImage] = useState(null); // Segmentation mask URL
//   const [diseasePrediction, setDiseasePrediction] = useState(''); // Disease prediction result

//   // Function to upload and process the image
//   const handleImageUpload = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (!permissionResult.granted) {
//       Alert.alert('Permission Denied', 'You need to allow access to the media library.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setSelectedImage(uri);

//       // Upload the image to the FastAPI backend
//       uploadImageToBackend(uri);
//     }
//   };

//   const uploadImageToBackend = async (imageUri) => {
//     try {
//       setLoading(true);

//       // Prepare form data
//       const formData = new FormData();
//       formData.append('file', {
//         uri: imageUri,
//         type: 'image/jpeg',
//         name: 'uploaded_image.jpg',
//       });

//       // Send to FastAPI endpoint (replace with your server's URL)
//       const response = await fetch('http://172.20.7.169:8000/segment_and_predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       setLoading(false);

//       if (response.ok) {
//         // Handle results from the backend
//         setSegmentationImage(data.segmentation_image_url); // URL for segmentation mask
//         setDiseasePrediction(data.disease_prediction); // Disease prediction
//       } else {
//         Alert.alert('Error', 'Failed to process the image.');
//       }
//     } catch (error) {
//       setLoading(false);
//       Alert.alert('Error', 'An error occurred while uploading the image.');
//       console.error(error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.header}>Upload Infected Eye Image</Text>
//         <View style={styles.buttonContainer}>
//           <Button title="Upload Image" onPress={handleImageUpload} />
//         </View>

//         {loading && <ActivityIndicator size="large" color="#0D47A1" />}

//         {selectedImage && !loading && (
//           <Image source={{ uri: selectedImage }} style={styles.image} />
//         )}

//         {segmentationImage && (
//           <View>
//             <Text style={styles.resultHeader}>Segmentation Mask</Text>
//             <Image source={{ uri: segmentationImage }} style={styles.resultImage} />
//           </View>
//         )}

//         {diseasePrediction && (
//           <Text style={styles.predictionText}>
//             Disease Prediction: {diseasePrediction}
//           </Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#E3F2FD',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#0D47A1',
//   },
//   buttonContainer: {
//     marginBottom: 20,
//     width: '80%',
//   },
//   image: {
//     width: 300,
//     height: 300,
//     marginTop: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#0D47A1',
//   },
//   resultHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: '#0D47A1',
//   },
//   resultImage: {
//     width: 300,
//     height: 300,
//     marginTop: 10,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#0D47A1',
//   },
//   predictionText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: '#0D47A1',
//   },
// });


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Image,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// export default function EyeDiseaseScreen() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [segmentationImage, setSegmentationImage] = useState(null); // For segmentation mask URL
//   const [diseasePrediction, setDiseasePrediction] = useState(''); // For disease prediction

//   // Function to handle image upload and processing
//   const handleImageUpload = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (!permissionResult.granted) {
//       Alert.alert('Permission Denied', 'You need to allow access to the media library.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setSelectedImage(uri);

//       // Upload the image to the backend
//       await uploadImageToBackend(uri);
//     }
//   };

//   // Function to upload the image to the FastAPI backend
//   const uploadImageToBackend = async (imageUri) => {
//     try {
//       setLoading(true);

//       // Create form data
//       const formData = new FormData();
//       formData.append('file', {
//         uri: imageUri,
//         type: 'image/jpeg',
//         name: 'uploaded_image.jpg',
//       });

//       // Replace with your FastAPI endpoint
//       const apiUrl = 'http://172.20.7.169:8000/segment_and_predict';
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       setLoading(false);

//       if (response.ok) {
//         // Process results from the backend
//         setSegmentationImage(data.segmentation_image_url);  // instead of data.data.segmentation_image_url
//         setDiseasePrediction(data.disease_prediction);      // instead of data.data.predicted_disease
//       } else {
//         Alert.alert('Error', 'Failed to process the image.');
//       }
//     } catch (error) {
//       setLoading(false);
//       Alert.alert('Error', 'An error occurred while uploading the image.');
//       console.error(error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.header}>Upload Infected Eye Image</Text>
//         <View style={styles.buttonContainer}>
//           <Button title="Upload Image" onPress={handleImageUpload} />
//         </View>

//         {loading && <ActivityIndicator size="large" color="#0D47A1" />}

//         {selectedImage && !loading && (
//           <Image source={{ uri: selectedImage }} style={styles.image} />
//         )}

//         {segmentationImage && (
//           <View>
//             <Text style={styles.resultHeader}>Segmentation Mask</Text>
//             <Image source={{ uri: segmentationImage }} style={styles.resultImage} />
//           </View>
//         )}

//         {diseasePrediction && (
//           <Text style={styles.predictionText}>
//             Disease Prediction: {diseasePrediction}
//           </Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#E3F2FD',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#0D47A1',
//   },
//   buttonContainer: {
//     marginBottom: 20,
//     width: '80%',
//   },
//   image: {
//     width: 300,
//     height: 300,
//     marginTop: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#0D47A1',
//   },
//   resultHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: '#0D47A1',
//   },
//   resultImage: {
//     width: 300,
//     height: 300,
//     marginTop: 10,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#0D47A1',
//   },
//   predictionText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: '#0D47A1',
//   },
// });


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Image,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// export default function EyeDiseaseScreen() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [segmentationImage, setSegmentationImage] = useState(null);
//   const [predictedDisease, setPredictedDisease] = useState('');

//   const handleImageUpload = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (!permissionResult.granted) {
//       Alert.alert('Permission Denied', 'You need to allow access to the media library.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setSelectedImage(uri);
//       await uploadImageToBackend(uri);
//     }
//   };

//   const uploadImageToBackend = async (imageUri) => {
//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append('file', {
//         uri: imageUri,
//         type: 'image/jpeg',
//         name: 'uploaded_image.jpg',
//       });

//       const apiUrl = 'http://172.20.7.169:8000/segment_and_predict';
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       setLoading(false);

//       if (response.ok) {
//         setSegmentationImage(data.mask_image_url);      // From backend key: mask_image_url
//         setPredictedDisease(data.predicted_disease);     // From backend key: predicted_disease
//       } else {
//         Alert.alert('Error', 'Failed to process the image.');
//       }
//     } catch (error) {
//       setLoading(false);
//       Alert.alert('Error', 'An error occurred while uploading the image.');
//       console.error(error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.header}>Upload Infected Eye Image</Text>
//         <View style={styles.buttonContainer}>
//           <Button title="Upload Image" onPress={handleImageUpload} />
//         </View>

//         {loading && <ActivityIndicator size="large" color="#0D47A1" />}

//         {selectedImage && !loading && (
//           <Image source={{ uri: selectedImage }} style={styles.image} />
//         )}

//         {segmentationImage && (
//           <View>
//             <Text style={styles.resultHeader}>Segmentation Mask</Text>
//             <Image source={{ uri: segmentationImage }} style={styles.resultImage} />
//           </View>
//         )}

//         {predictedDisease && (
//           <Text style={styles.predictionText}>
//             Predicted Disease: {predictedDisease}
//           </Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#E3F2FD',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#0D47A1',
//   },
//   buttonContainer: {
//     marginBottom: 20,
//     width: '80%',
//   },
//   image: {
//     width: 300,
//     height: 300,
//     marginTop: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#0D47A1',
//   },
//   resultHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: '#0D47A1',
//   },
//   resultImage: {
//     width: 300,
//     height: 300,
//     marginTop: 10,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#0D47A1',
//   },
//   predictionText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color: '#0D47A1',
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function EyeDiseaseScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [segmentationImage, setSegmentationImage] = useState(null);
  const [predictedDisease, setPredictedDisease] = useState('');
  const router = useRouter();

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
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      await uploadImageToBackend(uri);
    }
  };

  const uploadImageToBackend = async (imageUri) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'uploaded_image.jpg',
      });

      const apiUrl = 'http://192.168.1.28:8000/segment_and_predict';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSegmentationImage(data.mask_image_url);
        setPredictedDisease(data.predicted_disease);
      } else {
        Alert.alert('Error', 'Failed to process the image.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An error occurred while uploading the image.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Upload Infected Eye Image</Text>
        <View style={styles.buttonContainer}>
          <Button title="Upload Image" onPress={handleImageUpload} />
        </View>

        {loading && <ActivityIndicator size="large" color="#0D47A1" />}

        {selectedImage && !loading && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}

        {segmentationImage && (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.resultHeader}>Segmentation Mask</Text>
            <Image source={{ uri: segmentationImage }} style={styles.resultImage} />
          </View>
        )}

        {predictedDisease && (
          <Text style={styles.predictionText}>
            Predicted Disease: {predictedDisease}
          </Text>
        )}

        {/* Buttons for navigation */}
        {predictedDisease !== '' && (
          <View style={styles.navigationButtonsContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push('/VetContactScreen')}
            >
              <Text style={styles.navButtonText}>Contact Vet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push(`/HomeRemediesScreen?disease=${predictedDisease}`)}
            >
              <Text style={styles.navButtonText}>Home Remedies</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0D47A1',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0D47A1',
  },
  resultHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#0D47A1',
    textAlign: 'center',
  },
  resultImage: {
    width: 300,
    height: 300,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0D47A1',
  },
  predictionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#0D47A1',
    textAlign: 'center',
  },
  navigationButtonsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    gap: 15,
  },
  navButton: {
    backgroundColor: '#0D47A1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

