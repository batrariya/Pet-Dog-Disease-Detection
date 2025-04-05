import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const homeRemedies = {
  Dermatitis: {
    remedies: [
      'Apply aloe vera gel to soothe the skin.',
      'Use an oatmeal bath to reduce irritation.',
      'Keep the affected area clean and dry.',
      'Avoid excessive scratching by using an Elizabethan collar.',
      'Provide omega-3 supplements to promote healthy skin.',
    ],
    precautions: "Keep your pet's environment clean and avoid exposure to allergens like dust and certain chemicals.",
  },
  Ear_Mites: {
    remedies: [
      'Use coconut oil to soothe the ears.',
      'Apply a few drops of mineral oil to kill mites.',
      'Clean ears gently with a vet-approved ear cleaner.',
      'Use prescribed ear drops from a veterinarian.',
      'Ensure regular grooming to prevent future infections.',
    ],
    precautions: "Regularly check your dog's ears and keep them clean. Avoid contact with infected animals.",
  },
  Fungal_Infections: {
    remedies: [
      'Apply diluted apple cider vinegar to affected areas.',
      'Use antifungal shampoos for bathing.',
      'Ensure the skin remains dry and well-ventilated.',
      'Boost the immune system with a balanced diet.',
      'Keep bedding and surroundings clean to prevent reinfection.',
    ],
    precautions: 'Isolate infected pets and wash their belongings frequently to prevent spreading.',
  },
  Healthy: {
    remedies: ['No remedies needed.'],
    precautions: 'Maintain regular check-ups and a healthy diet to keep your dog in good condition.',
  },
  Hypersensitivity: {
    remedies: [
      'Use hypoallergenic shampoo.',
      'Introduce an anti-inflammatory diet.',
      'Provide omega-3 fatty acids to reduce inflammation.',
      'Minimize exposure to known allergens.',
      'Use prescribed antihistamines if needed.',
    ],
    precautions: 'Monitor food intake and avoid environmental triggers like pollen, dust, or household cleaners.',
  },
  Ringworm: {
    remedies: [
      'Apply antifungal creams prescribed by a vet.',
      'Use medicated shampoos regularly.',
      "Keep the dog's bedding and environment disinfected.",
      'Boost immunity with a healthy diet.',
      'Isolate the infected pet to prevent spreading.',
    ],
    precautions: 'Wear gloves when handling an infected pet and clean all surfaces regularly.',
  },
  Demodicosis: {
    remedies: [
      'Use prescribed medicated baths.',
      'Keep the skin clean and dry.',
      'Provide a high-quality diet to strengthen immunity.',
      'Apply vet-recommended topical treatments.',
      'Regular veterinary checkups to monitor progress.',
    ],
    precautions: 'Ensure your dog gets enough rest and a stress-free environment, as stress can worsen the condition.',
  },

  // ✅ Eye-related symptoms
  Corneal_Edema: {
    remedies: [
      'Apply prescribed lubricating eye drops to reduce dryness.',
      'Keep the eyes clean using a vet-recommended saline wash.',
      'Avoid exposing your dog to strong light or wind.',
      'Ensure your dog does not scratch its eyes by using a cone if needed.',
    ],
    precautions: 'Avoid trauma to the eyes and consult a vet if cloudiness or discomfort is noticed.',
  },
  Episcleral_Congestion: {
    remedies: [
      'Use cold compresses to reduce inflammation.',
      'Ensure your pet rests in a low-stress environment.',
      'Avoid exposure to allergens or irritants such as smoke.',
    ],
    precautions: 'Regular eye checkups and avoid dusty or polluted areas.',
  },
  Epiphora: {
    remedies: [
      'Gently wipe away tear stains with a damp cotton pad.',
      'Keep the fur around the eyes trimmed and clean.',
      'Use vet-recommended eye drops if advised.',
    ],
    precautions: 'Keep the eye area clean and dry. Identify and manage allergies if present.',
  },
  Cherry_Eye_Disease: {
    remedies: [
      'Apply warm compresses to reduce swelling temporarily.',
      'Use vet-prescribed lubricants or anti-inflammatory drops.',
    ],
    precautions: 'Seek early veterinary intervention to avoid surgical complications. Prevent your dog from rubbing its eyes.',
  },
};

export default function HomeRemediesScreen() {
  const { disease } = useLocalSearchParams();

  // Normalize disease name (replace spaces with underscores)
  const formattedDisease = disease ? disease.replace(/\s+/g, '_') : '';

  const remedyData = homeRemedies[formattedDisease] || {
    remedies: ['Consult a vet for specific guidance.'],
    precautions: '',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home Remedies for {disease}</Text>

      <View style={styles.remediesContainer}>
        {remedyData.remedies.map((remedy, index) => (
          <Text key={index} style={styles.text}>• {remedy}</Text>
        ))}
      </View>

      {remedyData.precautions && (
        <Text style={styles.precautions}>Precaution: {remedyData.precautions}</Text>
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
    marginBottom: 10,
    color: '#0D47A1',
    textAlign: 'center', // Center-aligns the heading
  },
  remediesContainer: {
    alignSelf: 'flex-start', // Left-aligns remedies
    paddingLeft: 20, // Adds spacing from the left
    width: '100%', // Ensures full width
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left', // Left-aligns text
  },
  precautions: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
  },
});
