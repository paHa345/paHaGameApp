import React, { useMemo, useRef } from "react";

import * as THREE from "three";
import { BufferAttribute } from "three";

interface ISparkProps {
  id: string;
  position: [number, number, number];
}

const Spark = ({ id, position }: ISparkProps) => {
  const pointRef = useRef(null);
  const particlesCount = 50;

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      colors[i * 3 + 0] = 0.88 + (Math.random() - 0.5 / 5);
      colors[i * 3 + 1] = 0.54 + (Math.random() - 0.5 / 5);
      colors[i * 3 + 2] = 0.03 + (Math.random() - 0.5 / 5);

      sizes[i] = 0.01;
    }

    return { positions, colors, sizes };
  }, []);

  return (
    <>
      {/* <mesh position={[position[0], position[1], position[2]]}>
        <sphereGeometry args={[1]}></sphereGeometry>
        <meshBasicMaterial color={"red"}></meshBasicMaterial>
      </mesh> */}

      <points position={[position[0], position[1], position[2]]} ref={pointRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[positions, 3]}
            attach="attributes-position"
            count={particlesCount}
          />
          <bufferAttribute args={[colors, 3]} attach="attributes-color" count={particlesCount} />
          {/* <bufferAttribute args={[sizes, 1]} attach="attributes-size" count={particlesCount} /> */}
        </bufferGeometry>

        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* <mesh position-z={-5} scale={10}>
//           <planeGeometry />
//           <meshBasicMaterial color={[10, 0, 0]} />
//         </mesh> */}
    </>
  );
};

export default Spark;
