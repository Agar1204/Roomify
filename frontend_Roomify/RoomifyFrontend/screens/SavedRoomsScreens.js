import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';

const BACKEND_URL = 'http://10.141.84.212:5001'; // Replace with your backend URL

const SavedRoomsScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedRooms();
  }, []);

  const fetchSavedRooms = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/items`);
      const data = await response.json();
      if (data.status === 'success') {
        setRooms(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch saved rooms.');
      }
    } catch (error) {
      console.error('Error fetching saved rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRoom = (room) => (
    <View key={room.id} style={styles.roomCard}>
      <Text style={styles.roomTitle}>Room: {room.capture_slug}</Text>
      <Text style={styles.roomStatus}>Status: {room.status}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {room.images?.map((base64Image, index) => (
          <Image 
            key={index} 
            source={{ uri: `data:image/jpeg;base64,${base64Image}` }} 
            style={styles.roomImage} 
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Saved Rooms</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : rooms.length === 0 ? (
          <Text style={styles.noRoomsText}>No saved rooms found.</Text>
        ) : (
          rooms.map(renderRoom)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContainer: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  noRoomsText: { fontSize: 18, color: '#888', textAlign: 'center', marginTop: 50 },
  roomCard: { marginBottom: 20, backgroundColor: '#FFF', borderRadius: 10, padding: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  roomTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  roomStatus: { fontSize: 16, color: '#888', marginBottom: 10 },
  roomImage: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
});

export default SavedRoomsScreen;
