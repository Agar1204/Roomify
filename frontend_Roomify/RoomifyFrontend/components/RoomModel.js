import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';
import { View, ActivityIndicator } from 'react-native';

const RoomModel = () => {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <Canvas
        style={{
          flex: 1,
        }}
      >
        <Suspense fallback={<ActivityIndicator size="large" color="#007BFF" />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <OrbitControls />
        </Suspense>
      </Canvas>
    </View>
  );
};

export default RoomModel;
