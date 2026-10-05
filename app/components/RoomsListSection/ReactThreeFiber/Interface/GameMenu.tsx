import localFont from "next/font/local";
import React, { useState } from "react";
import { Float, Text, useCursor } from "@react-three/drei";
import { BoxGeometry } from "three";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { ReactThreeFiberGameActions } from "@/app/store/ReactThreeFiberGameSlice";
import { useThree } from "@react-three/fiber";

const Shonen = localFont({
  src: "../../../../../public/fonts/Shonen.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const GameMenu = () => {
  const [hovered, setHovered] = useState(false);
  const { size, viewport } = useThree();

  useCursor(hovered);
  const dispatch = useDispatch<AppDispatch>();
  const startGameButtonHandler = () => {
    dispatch(ReactThreeFiberGameActions.setGamePauseStatus());
  };

  return (
    <>
      <mesh>
        <Float
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={startGameButtonHandler}
          floatIntensity={0.25}
          rotationIntensity={0.25}
        >
          <Text
            font="./fonts/Shonen.ttf"
            scale={size.width < 1024 ? 0.15 : 0.3}
            maxWidth={3}
            lineHeight={0.85}
            textAlign="right"
            position={[0, 0, 0]}
          >
            {" "}
            Начать
          </Text>
          <meshBasicMaterial toneMapped={false} />
        </Float>
        {size.width < 1024 ? (
          <mesh position={[0, 0, -0.3]} scale={[1, 1, 0.02]}>
            <boxGeometry />
            <meshStandardMaterial color={"red"} />
          </mesh>
        ) : (
          <mesh position={[0, 0, -0.3]} scale={[2, 2, 0.02]}>
            <boxGeometry />
            <meshStandardMaterial color={"red"} />
          </mesh>
        )}
      </mesh>
    </>
  );
};

export default GameMenu;
