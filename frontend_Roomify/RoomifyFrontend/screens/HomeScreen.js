import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const API_KEY = 'AIzaSyBAeJlJ36TVJl_PhYqBnkw-KxGP5hPSshs'; // Replace with your actual API key

const HomeScreen = ({ navigation }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        type: 'image/jpeg',
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      }));

      setSelectedImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const generateRecommendations = async () => {
    if (selectedImages.length < 3) {
      alert('Please select at least 3 images for analysis.');
      return;
    }

    setIsProcessing(true);

    try {
      const imagePromises = selectedImages.map(async (image) => {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      // Updated request body format for Gemini API
      const requestBody = {
        contents: [{
          parts: [
            { text: "You are an interior design expert. Please analyze these room images and provide: 1) A brief overview of the current style and feel 2) Specific recommendations for improvement in these categories: Layout, Furniture, Lighting, Color/Decor 3) A summary of the potential impact these changes would make. If the images are not of interior spaces, please kindly request interior room photos instead." },
            ...base64Images.map(base64 => ({
              inline_data: {
                mime_type: "image/jpeg",
                data: base64
              }
            }))
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        }
      };

      console.log('Making API request to:', GEMINI_API_URL);

      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response:', errorText);
        throw new Error(`API Error: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini API response:', data);

      // In generateRecommendations function:
      navigation.navigate('Recommendations', {
        recommendations: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No recommendations available',
        images: selectedImages // Pass the selected images
      });

    } catch (error) {
      console.error('Error generating recommendations with Gemini API:', error);
      alert(`Failed to generate recommendations: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.imageThumbnail} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => {
          setSelectedImages(current =>
            current.filter(img => img.uri !== item.uri)
          );
        }}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Roomify</Text>
      </View>

      <View style={styles.imageSection}>
        <FlatList
          data={selectedImages}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderImage}
          ListEmptyComponent={<Text style={styles.emptyText}>No images selected yet.</Text>}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={openImagePicker}
        >
          <Text style={styles.buttonText}>Add Images</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateRecommendations}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Generate Recommendations</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6', padding: 20 },
  header: { marginTop: 40, marginBottom: 20 },
  headerText: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  imageSection: { marginBottom: 20 },
  imageContainer: { position: 'relative', marginRight: 10 },
  imageThumbnail: { width: 100, height: 100, borderRadius: 8 },
  removeButton: { position: 'absolute', right: -5, top: -5, backgroundColor: '#FF4444', borderRadius: 12 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  addButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  generateButton: { backgroundColor: '#28A745', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 10 },
});

export default HomeScreen;
