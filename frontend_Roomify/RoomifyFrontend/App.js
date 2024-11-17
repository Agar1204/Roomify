import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RecommendationsScreen from './screens/RecommendationsScreen';
import SavedRoomsScreen from './screens/SavedRoomsScreens';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Recommendations" component={RecommendationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SavedRoomsScreen" component={SavedRoomsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
