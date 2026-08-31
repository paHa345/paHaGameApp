import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { polygon } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

const PlayerHealthPanel = () => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  const [health, setHealth] = useState(100);

  const playerStat = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerStat,
  );

  useEffect(() => {
    setHealth((playerStat.currentHP / playerStat.baseHP) * 100);
    console.log(health);
  }, [playerStat]);

  useEffect(() => {
    setHealth((playerStat.currentHP / playerStat.baseHP) * 100);

    const canvas = document.createElement("canvas");
    canvas.width = 550;
    canvas.height = 250;
    const ctx = canvas.getContext("2d");

    // Функция отрисовки
    function drawIcon() {
      if (!ctx) return;
      // Очищаем canvas
      ctx.clearRect(0, 0, 550, 250);

      const img = new Image();
      img.src = "/RPGUI/PlayerHealthPanel.png";

      img.onload = () => {
        // Отрисовываем изображение на canvas
        ctx.drawImage(img, 0, 0, 530, 230, 0, 0, 530, 230);
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
      <div
        style={{
          clipPath: `polygon(0 ${100 - health}%, 100% ${100 - health}%, 100% 100%, 0 100%)`,
        }}
        className=" absolute bottom-3 left-2 w-52 h-52 rounded-full bg-red-900  "
      ></div>
      <div className=" absolute bottom-[-270px] left-0">
        <img src="/RPGUI/PlayerHealthPanel.png" alt="" />
      </div>
    </>
  );
};

export default PlayerHealthPanel;
