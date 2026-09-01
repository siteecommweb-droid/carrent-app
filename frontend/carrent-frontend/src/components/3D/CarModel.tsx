import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
} from "@react-three/drei";

export default function CarModel() {
  const ref = useRef<any>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y =
        state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={1} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
      />

      <group ref={ref}>
        <mesh>
          <boxGeometry args={[2, 0.5, 4]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>

        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.4, 0.5, 2]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        <mesh position={[-1, -0.4, 1.2]}>
          <cylinderGeometry
            args={[0.4, 0.4, 0.3, 32]}
          />
          <meshStandardMaterial color="black" />
        </mesh>

        <mesh position={[1, -0.4, 1.2]}>
          <cylinderGeometry
            args={[0.4, 0.4, 0.3, 32]}
          />
          <meshStandardMaterial color="black" />
        </mesh>

        <mesh position={[-1, -0.4, -1.2]}>
          <cylinderGeometry
            args={[0.4, 0.4, 0.3, 32]}
          />
          <meshStandardMaterial color="black" />
        </mesh>

        <mesh position={[1, -0.4, -1.2]}>
          <cylinderGeometry
            args={[0.4, 0.4, 0.3, 32]}
          />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

      <Environment preset="sunset" />

      <OrbitControls
        enableZoom={false}
      />
    </>
  );
}