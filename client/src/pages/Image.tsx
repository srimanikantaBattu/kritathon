import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import IMAGE_URL from "../assets/hello.jpg"

// Self-contained AR viewer component with built-in image
const ARViewer = () => {
  // Hard-coded image URL - embedded directly in the component
  
  // The 3D model with the texture
  const TexturedPlane = () => {
    const texture = useLoader(TextureLoader, IMAGE_URL);
    
    return (
      <mesh>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial map={texture} side={2} />
      </mesh>
    );
  };
  
  // Loading placeholder
  const LoadingFallback = () => {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    );
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        
        <Suspense fallback={<LoadingFallback />}>
          <TexturedPlane />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
};

export default ARViewer;