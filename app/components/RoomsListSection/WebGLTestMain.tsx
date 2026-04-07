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

      // Scene
      const scene = new THREE.Scene();

      /**
       * Textures
       */
      const textureLoader = new THREE.TextureLoader();

      /**
       * Test mesh
       */
      // Geometry
      const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

      console.log(geometry);

      const count = geometry.attributes.position.count;

      const randoms = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        randoms[i] = Math.random();
      }

      geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

      // Material
      const material = new THREE.RawShaderMaterial({
        vertexShader: testVertexShaders,
        fragmentShader: testFragmentShaders,
        side: THREE.DoubleSide,
      });

      // Mesh
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

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
      camera.position.set(0.25, -0.25, 1);
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

        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

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
