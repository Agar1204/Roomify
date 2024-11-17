// RecommendationsScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const RecommendationsScreen = ({ route }) => {
  const { recommendations } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recommendations</Text>
        <Text style={styles.text}>{recommendations}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default RecommendationsScreen;