import localFont from "next/font/local";
import React, { useState } from "react";
import { Float, Text, useCursor } from "@react-three/drei";
import { BoxGeometry } from "three";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { ReactThreeFiberGameActions } from "@/app/store/ReactThreeFiberGameSlice";

const Shonen = localFont({
  src: "../../../../public/fonts/Shonen.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const GameMenu = () => {
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);
  const dispatch = useDispatch<AppDispatch>();
  const startGameButtonHandler = () => {
    console.log("Start game");
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
            scale={0.3}
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
        <mesh position={[0, 0, -0.3]} scale={[2, 2, 0.02]}>
          <boxGeometry />
          <meshStandardMaterial color={"red"} />
        </mesh>
      </mesh>
    </>
  );
};

export default GameMenu;
