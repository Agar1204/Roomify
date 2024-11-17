import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls, useGLTF } from '@react-three/drei/native';

const ModelViewer = ({ route }) => {
  const { modelUrl } = route.params;

  const Scene = () => {
    const { scene } = useGLTF(modelUrl); // Load 3D model
    return <primitive object={scene} scale={0.5} />;
  };

  return (
    <View style={styles.container}>
      <GLView style={styles.viewer}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <OrbitControls />
          <Scene />
        </Canvas>
      </GLView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  viewer: {
    flex: 1,
  },
});

export default ModelViewer;
