import { Billboard } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import * as THREE from "three";

const DynamicNPCHealthBar = () => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 20;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    // Функция отрисовки
    function drawIcon() {
      if (!ctx) return;
      // Очищаем canvas
      ctx.clearRect(0, 0, 20, 200);

      // Фон
      ctx.fillStyle = "rgba(20, 20, 40, 0.8)";
      ctx.fillRect(0, 0, 20, 200);

      //   const image = new HTMLImageElement();
      //   image.src = "/RPGUI/character_pannel2.2.png";
      //   ctx.drawImage(image, 50, 50, 50, 50, 50, 50, 50, 50);

      // Обновляем текстуру
      if (texture) {
        texture.needsUpdate = true;
      }
    }

    // Создаем текстуру
    const newTexture = new THREE.CanvasTexture(canvas);
    setTexture(newTexture);

    // Рисуем первый раз
    drawIcon();

    return () => {
      newTexture.dispose();
    };
  }, []);

  return (
    <>
      <Billboard position={[0, 1.8, 0]}>
        <mesh>
          <planeGeometry args={[1, 0.2]} />
          <meshBasicMaterial map={texture} transparent={true} />
        </mesh>
      </Billboard>
    </>
  );
};

export default DynamicNPCHealthBar;
