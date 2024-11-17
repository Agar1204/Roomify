import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const HomeScreen = ({ navigation }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelGenerated, setModelGenerated] = useState(false);
  const [modelUrl, setModelUrl] = useState(null); // Placeholder for the 3D model URL

  // Handle opening image picker for multiple images
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 5, // Allow up to 5 images
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error: ', response.errorMessage);
      } else if (response.assets) {
        setSelectedImages((prev) => [...prev, ...response.assets.map((asset) => asset.uri)]);
      }
    });
  };

  // Simulate sending images to the backend for processing
  const generate3DModel = async () => {
    if (selectedImages.length < 3) {
      alert('Please select at least 3 images to generate a 3D model.');
      return;
    }

    setIsProcessing(true);

    // Simulating backend processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setModelGenerated(true);
      setModelUrl('https://example.com/model.gltf'); // Replace with actual URL from backend
      alert('3D Model generated successfully!');
    }, 5000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Roomify</Text>
      </View>

      {/* Selected Images */}
      <Text style={styles.sectionTitle}>Selected Images</Text>
      <FlatList
        data={selectedImages}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.imageThumbnail} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No images selected yet.</Text>}
      />

      {/* Buttons */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={openImagePicker}
      >
        <Text style={styles.buttonText}>Add Images from Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: '#28A745' }]}
        onPress={generate3DModel}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? 'Processing...' : 'Generate 3D Model'}
        </Text>
      </TouchableOpacity>

      {/* 3D Model Status */}
      {modelGenerated && (
        <View style={styles.modelContainer}>
          <Text style={styles.successText}>3D Model is ready!</Text>
          <TouchableOpacity
            style={styles.viewModelButton}
            onPress={() => navigation.navigate('ModelViewer', { modelUrl })}
          >
            <Text style={styles.buttonText}>View Model</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  modelContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28A745',
    marginBottom: 10,
  },
  viewModelButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default HomeScreen;
