import React, { Suspense, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls, useGLTF } from '@react-three/drei/native';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.5} position={[0, 0, 0]} />;
};

const ModelViewer = ({ route }) => {
  const { modelUrl } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (modelUrl) {
      setIsLoading(false);
    }
  }, [modelUrl]);

  if (!modelUrl) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No model URL provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas} camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Suspense>
      </Canvas>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading 3D Model...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6' },
  canvas: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#333' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#DC3545' },
});

export default ModelViewer;
