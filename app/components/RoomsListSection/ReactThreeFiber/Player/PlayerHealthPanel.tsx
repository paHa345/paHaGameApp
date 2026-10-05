import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useThree } from "@react-three/fiber";
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setHealth((playerStat.currentHP / playerStat.baseHP) * 100);

    const canvas = document.createElement("canvas");
    canvas.width = 550;
    canvas.height = 250;
    const ctx = canvas.getContext("2d");

    console.log(window.innerWidth);
    // Функция отрисовки
    function drawIcon() {
      if (!ctx) return;
      // Очищаем canvas
      ctx.clearRect(0, 0, 550, 250);

      const img = new Image();
      img.src = "/RPGUI/PlayerHealthPanel.png";

      img.onload = () => {
        // Отрисовываем изображение на canvas
        ctx.drawImage(
          img,
          0,
          0,
          window.innerWidth < 1024 ? 530 / 2 : 530,
          window.innerWidth < 1024 ? 230 / 2 : 230,
          0,
          0,
          window.innerWidth < 1024 ? 530 / 2 : 530,
          window.innerWidth < 1024 ? 230 / 2 : 230,
        );
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
        className="  lg:w-52 lg:h-52 w-[112px] h-[112px]  absolute bottom-[6px] left-[3px] lg:bottom-[15px] lg:left-[14.5px] rounded-full bg-red-900  "
      ></div>
      <div className=" absolute bottom-[-140px] lg:bottom-[-280px] left-0">
        <img
          height={isMobile ? 530 / 2 : 530}
          width={isMobile ? 550 / 2 : 550}
          src="/RPGUI/PlayerHealthPanel.png"
          alt=""
        />
      </div>
    </>
  );
};

export default PlayerHealthPanel;
