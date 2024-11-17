import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PortfolioScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Portfolio Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PortfolioScreen;
