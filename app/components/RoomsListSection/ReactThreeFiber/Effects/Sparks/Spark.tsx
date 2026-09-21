import React, { useMemo, useRef } from "react";

import * as THREE from "three";
import sparksFragmentShader from "./../../shaders/SparksShader/fragment.glsl";
import sparksVertexShader from "./../../shaders/SparksShader/vertex.glsl";
import { useFrame } from "@react-three/fiber";
import { useSelector } from "react-redux";

interface ISparkProps {
  id: string;
  position: [number, number, number];
  timestamp: number;
  rotation: [number, number, number, number];
}

const Spark = ({ id, position, timestamp, rotation }: ISparkProps) => {
  //   const materialRef = useRef<THREE.ShaderMaterial>(null);

  const pointRef = useRef(null);
  const particlesCount = 50;

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      colors[i * 3 + 0] = 0.88 + (Math.random() - 0.5 / 5);
      colors[i * 3 + 1] = 0.54 + (Math.random() - 0.5 / 5);
      colors[i * 3 + 2] = 0.03 + (Math.random() - 0.5 / 5);

      sizes[i] = Math.random();
    }

    return { positions, colors, sizes };
  }, []);

  const materialRef = useRef<THREE.ShaderMaterial>(
    new THREE.ShaderMaterial({
      uniforms: {
        uScale: { value: 1 },
        uTime: { value: 0 },
      },
      vertexShader: sparksVertexShader,
      fragmentShader: sparksFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    }),
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime - timestamp;
    }
  });

  /**
   * Смещаем искры немного вперёд и влевоо (localOffset) тносительно модели игрока
   * при этом учитываем поворот модели
   * чтобы правильно рассчитать смещение
   */
  const point = new THREE.Vector3(position[0], position[1], position[2]);
  const quat = new THREE.Quaternion(rotation[0], rotation[1], rotation[2], rotation[3]);
  const localOffset = new THREE.Vector3(0.4, 0, 0.8);
  localOffset.applyQuaternion(quat);
  const newPoint = point.clone().add(localOffset);

  return (
    <>
      {/* <mesh position={[newPoint.x, newPoint.y + 0.7, newPoint.z]}>
        <sphereGeometry args={[0.2]}></sphereGeometry>
        <meshBasicMaterial color={"red"}></meshBasicMaterial>
      </mesh> */}

      <points position={[newPoint.x, newPoint.y + 0.5, newPoint.z]} ref={pointRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[positions, 3]}
            attach="attributes-position"
            count={particlesCount}
          />
          <bufferAttribute args={[colors, 3]} attach="attributes-color" count={particlesCount} />
          <bufferAttribute args={[sizes, 1]} attach="attributes-size" count={particlesCount} />
        </bufferGeometry>

        <primitive object={materialRef.current} attach="material"></primitive>
      </points>

      {/* <mesh position-z={-5} scale={10}>
//           <planeGeometry />
//           <meshBasicMaterial color={[10, 0, 0]} />
//         </mesh> */}
    </>
  );
};

export default Spark;
