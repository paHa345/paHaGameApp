"use client";

import { height } from "@fortawesome/free-regular-svg-icons/faSave";
import { body, canvas } from "framer-motion/client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Renderer from "three/src/renderers/common/Renderer.js";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
// import image from "../../../public/textures/Door_Wood_001_basecolor.jpg";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import * as CANNON from "cannon-es";

import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { paginateListObjectsV2 } from "@aws-sdk/client-s3";
import FlyingRobot from "./FlyingRobot";
import Robot from "./Robot";
import Experience from "./Experience/Experience";
import testVertexShaders from "./shaders/test/vertex.glsl";
import testFragmentShaders from "./shaders/test/fragment.glsl";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

const WebGLTestMain = () => {
  const GLCanvasRef = useRef<HTMLCanvasElement>(null);

  const [sizes, setSizes] = useState({
    width: 800,
    height: 600,
  });

  const [cubeColor, setCubeColor] = useState({
    color: 0xff0000,
  });

  const [fullScreenSTatus, setFullScreenSTatus] = useState(1);

  // const sizes = {
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // };

  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  });
  //   const cursor = {
  //     x: 0,
  //     y: 0,
  //   };
  //   const moveMouseHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
  //     setCursor({
  //       x: e.clientX / sizes.width - 0.5,
  //       y: e.clientY / sizes.height - 0.5,
  //     });
  //   };

  const doubleClickHandler = () => {
    if (fullScreenSTatus === 1) {
      setFullScreenSTatus(0);
    } else {
      setFullScreenSTatus(1);
    }
  };

  useEffect(() => {
    if (fullScreenSTatus === 0 && GLCanvasRef.current !== null) {
      GLCanvasRef.current.requestFullscreen();
    }
    if (fullScreenSTatus === 1 && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullScreenSTatus]);

  /**
   *  Shaders
   */

  useEffect(() => {
    if (typeof window !== "undefined") {
      // const expirience = new Experience(GLCanvasRef.current);
      // const handleResize = () => {
      //   setSizes({
      //     width: window.innerWidth,
      //     height: window.innerHeight,
      //   });
      //   camera.aspect = sizes.width / sizes.height;
      //   camera.updateProjectionMatrix();

      //   renderer.setSize(sizes.width, sizes.height);
      //   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // };

      /**
       * Base
       */
      // Debug
      const gui = new GUI();

      const debugObject: {
        depthColor?: string;
        surfaceColor?: string;
      } = {};

      // Scene
      const scene = new THREE.Scene();

      /**
       * Textures
       */
      const textureLoader = new THREE.TextureLoader();
      const flagTexture = textureLoader.load("/textures/Russia.jpg");

      /**
       * Water
       */
      // Geometry
      const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

      // Color

      debugObject.depthColor = "#186691";
      debugObject.surfaceColor = "#9bd8ff";

      // Material
      const waterMaterial = new THREE.ShaderMaterial({
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        // wireframe: true,
        uniforms: {
          uTime: { value: 0 },

          uBigWaveSpeed: { value: 0.5 },
          uBigWavesElevation: { value: 0.2 },
          uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },

          uSmallWavesElevation: { value: 0.15 },
          uSmallWavesFrequency: { value: 3 },
          uSmallWavesSpeed: { value: 0.2 },
          uSmallWavesIterations: { value: 4 },

          uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
          uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
          uColorOffset: { value: 0.08 },
          uColorMultiplier: { value: 5 },
        },
      });

      // Debug

      gui
        .add(waterMaterial.uniforms.uBigWavesElevation, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("Высота больших волн");

      gui
        .add(waterMaterial.uniforms.uBigWaveSpeed, "value")
        .min(0)
        .max(4)
        .step(0.001)
        .name("Скорость больших волн");

      gui
        .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
        .min(0)
        .max(10)
        .step(0.001)
        .name("Частота больших волн по X");

      gui
        .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
        .min(0)
        .max(10)
        .step(0.001)
        .name("Частота больших волн по Y");

      gui
        .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("Высота малых волн");
      gui
        .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
        .min(0)
        .max(30)
        .step(0.001)
        .name("Частота малых волн");
      gui
        .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
        .min(0)
        .max(4)
        .step(0.01)
        .name("Скорость малых волн");
      gui
        .add(waterMaterial.uniforms.uSmallWavesIterations, "value")
        .min(0)
        .max(4)
        .step(1)
        .name("Количество малых волн");

      gui
        .addColor(debugObject, "depthColor")
        .name("Цвет глубины")
        .onChange(() => {
          waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
        });

      gui
        .addColor(debugObject, "surfaceColor")
        .name("Цвет поверхности")
        .onChange(() => {
          waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
        });

      gui
        .add(waterMaterial.uniforms.uColorOffset, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("Смещение цвета");

      gui
        .add(waterMaterial.uniforms.uColorMultiplier, "value")
        .min(0)
        .max(10)
        .step(0.001)
        .name("Множитель цвета");

      // Mesh
      const water = new THREE.Mesh(waterGeometry, waterMaterial);
      water.rotation.x = -Math.PI * 0.5;
      scene.add(water);

      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
      camera.position.set(1, 1, 1);
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, GLCanvasRef.current);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      if (GLCanvasRef.current === null) {
        return;
      }
      const renderer = new THREE.WebGLRenderer({
        canvas: GLCanvasRef.current,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /**
       * Animate
       */

      const timer = new THREE.Timer();
      let previousTime = 0;

      let currentIntersect: null | THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>> =
        null;

      const tick = () => {
        // controls.update();
        timer.update();

        const elapsedTime = timer.getElapsed();

        // Update water

        waterMaterial.uniforms.uTime.value = elapsedTime;

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();

      // Cleanup
      // return () => window.removeEventListener("resize", handleResize);
    }
  });

  return (
    <>
      <div className=" relative">
        <canvas
          className="webgl fixed top-0 left-0 z-10"
          onDoubleClick={doubleClickHandler}
          ref={GLCanvasRef}
        ></canvas>
      </div>
    </>
  );
};

export default WebGLTestMain;
