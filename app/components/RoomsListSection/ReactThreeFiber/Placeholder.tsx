import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Mesh } from "three";

const Placeholder = (props: any) => {
  const placeholderRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (placeholderRef.current) {
      placeholderRef.current.rotation.y += delta;
    }
  });
  return (
    <mesh ref={placeholderRef} {...props}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshBasicMaterial color={"red"} wireframe />
    </mesh>
  );
};

export default Placeholder;
