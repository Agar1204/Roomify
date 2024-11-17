import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BACKEND_URL = 'http://10.138.234.66:5001'; // Replace with your actual backend URL

const ExpandableCard = ({ title, icon, content }) => {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.spring(animation, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardHeader} 
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeaderLeft}>
          <MaterialIcons name={icon} size={24} color="#2D3748" />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#2D3748" />
        </Animated.View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.cardContent}>
          <Text style={styles.content} numberOfLines={expanded ? undefined : 2}>
            {content}
          </Text>
        </View>
      )}
    </View>
  );
};

const RecommendationsScreen = ({ route }) => {
  const { recommendations, images } = route.params;
  const windowWidth = Dimensions.get('window').width;
  const [isSaving, setIsSaving] = useState(false);

  // Example of how to parse recommendations for each category
  const getRecommendationByCategory = (category) => {
    const sections = {
      'Layout': 'Consider rearranging furniture to create better flow...',
      'Furniture': 'Add a comfortable accent chair in the corner...',
      'Lighting': 'Install indirect lighting under cabinets...',
      'Color & Decor': 'Introduce warm earth tones through accessories...'
    };
    return sections[category] || 'No specific recommendations available.';
  };

  const categories = [
    { title: 'Layout', icon: 'grid-on' },
    { title: 'Furniture', icon: 'chair' },
    { title: 'Lighting', icon: 'lightbulb-outline' },
    { title: 'Color & Decor', icon: 'palette' }
  ];

  const saveToDatabase = async () => {
    setIsSaving(true);

    try {
      const formData = new FormData();

      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        });
      });

      formData.append('recommendations', recommendations);

      const response = await fetch(`${BACKEND_URL}/save-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Save response:', data);

      if (data.success) {
        Alert.alert('Success', 'Room data saved successfully!');
      } else {
        throw new Error(data.message || 'Failed to save room data.');
      }
    } catch (error) {
      console.error('Error saving room data:', error);
      Alert.alert('Error', 'Failed to save room data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Room Analysis</Text>
        </View>

        {/* Image Gallery */}
        <ScrollView 
          horizontal 
          style={styles.imageGallery} 
          showsHorizontalScrollIndicator={false}
        >
          {images?.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={styles.galleryImage}
            />
          ))}
        </ScrollView>

        {/* Overview Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="home" size={24} color="#2D3748" />
            <Text style={styles.cardTitle}>Current Style Overview</Text>
          </View>
          <Text style={styles.content}>{recommendations}</Text>
        </View>

        {/* Expandable Recommendation Cards */}
        {categories.map((category, index) => (
          <ExpandableCard
            key={index}
            title={category.title}
            icon={category.icon}
            content={getRecommendationByCategory(category.title)}
          />
        ))}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveToDatabase} 
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Room Data</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  imageGallery: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  galleryImage: {
    width: 280,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  cardContent: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E4E7EB',
    marginTop: 8,
    width: '100%',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A5568',
    flexWrap: 'wrap',
  },
  saveButtonContainer: {
    padding: 20,
    backgroundColor: '#F5F7FA',
    borderTopWidth: 1,
    borderTopColor: '#E4E7EB',
  },
  saveButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default RecommendationsScreen;
