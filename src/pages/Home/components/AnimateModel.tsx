import { Canvas } from '@react-three/fiber';

const AnimateModel = () => {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
      <ambientLight />
      <spotLight
      // position={[10, 10, 10]}
      // angle={0.15}
      // penumbra={1}
      // shadow-mapSize={[512, 512]}
      // castShadow
      />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
};

export default AnimateModel;
