import { Billboard } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import * as THREE from "three";

const DynamicNPCHealthBar = () => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");

    // Функция отрисовки
    function drawIcon() {
      if (!ctx) return;
      // Очищаем canvas
      ctx.clearRect(0, 0, 400, 40);

      // // Фон
      // ctx.fillStyle = "rgba(20, 20, 40, 0.8)";
      // ctx.fillRect(0, 0, 200, 20);

      const img = new Image();
      img.src = "/RPGUI/NPCHealthBar.png";
      //   ctx.drawImage(image, 50, 50, 50, 50, 50, 50, 50, 50);

      img.onload = () => {
        // Отрисовываем изображение на canvas
        ctx.drawImage(img, 20, 14, 250, 30, 0, 0, 400, 40);
        ctx.drawImage(img, 24, 55, 250, 16, 9, 12, 390, 20);

        // Создаем текстуру
        const newTexture = new THREE.CanvasTexture(canvas);
        newTexture.needsUpdate = true;
        setTexture(newTexture);
      };

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
