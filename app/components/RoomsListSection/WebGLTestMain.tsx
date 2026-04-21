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
// import FlyingRobot from "./FlyingRobot";
// import Robot from "./Robot";
// import Experience from "./Experience/Experience";
// import testVertexShaders from "./shaders/test/vertex.glsl";
// import testFragmentShaders from "./shaders/test/fragment.glsl";
// import waterVertexShader from "./shaders/water/vertex.glsl";
// import waterFragmentShader from "./shaders/water/fragment.glsl";
// import galaxyVertexShader from "./shaders/galaxy/vertex.glsl";
// import galaxyFragmentShader from "./shaders/galaxy/fragment.glsl";

// import cofeeSmokeVertexShader from "./shaders/cofeeSmoke/vertex.glsl";
// import cofeeSmokeFragmentShader from "./shaders/cofeeSmoke/fragment.glsl";

import holographicVertexShader from "./shaders/holographic/vertex.glsl";
import holographicFragmentShader from "./shaders/holographic/fragment.glsl";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      // const expirience = new Experience(GLCanvasRef.current);

      /**
       * Base
       */
      // Debug
      const gui = new GUI();

      // Scene
      const scene = new THREE.Scene();

      // Loaders
      const textureLoader = new THREE.TextureLoader();
      const gltfLoader = new GLTFLoader();

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
      const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
      camera.position.set(7, 7, 7);
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, GLCanvasRef.current);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const rendererParameters = { clearColor: "#1d1f2a" };

      if (GLCanvasRef.current === null) {
        return;
      }
      const renderer = new THREE.WebGLRenderer({
        canvas: GLCanvasRef.current,
        antialias: true,
      });

      renderer.setClearColor(rendererParameters.clearColor);
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      gui.addColor(rendererParameters, "clearColor").onChange(() => {
        renderer.setClearColor(rendererParameters.clearColor);
      });

      /**
       * Material
       */

      const materialParameters = {
        color: "#70c1ff",
      };

      gui.addColor(materialParameters, "color").onChange(() => {
        material.uniforms.uColor.value.set(materialParameters.color);
      });

      const material = new THREE.ShaderMaterial({
        vertexShader: holographicVertexShader,
        fragmentShader: holographicFragmentShader,
        uniforms: {
          uTime: new THREE.Uniform(0),
          uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      /**
       * Objects
       */
      // Torus knot
      const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32), material);
      torusKnot.position.x = 3;
      scene.add(torusKnot);

      // Sphere
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
      sphere.position.x = -3;
      scene.add(sphere);

      // Suzanne
      let suzanne: any = null;
      gltfLoader.load("./suzanne.glb", (gltf) => {
        suzanne = gltf.scene;
        suzanne.traverse((child: any) => {
          const childModel = child as any;

          if (childModel.isMesh) childModel.material = material;
        });
        scene.add(suzanne);
      });

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

        material.uniforms.uTime.value = elapsedTime;

        // Rotate objects
        if (suzanne) {
          suzanne.rotation.x = -elapsedTime * 0.1;
          suzanne.rotation.y = elapsedTime * 0.2;
        }

        sphere.rotation.x = -elapsedTime * 0.1;
        sphere.rotation.y = elapsedTime * 0.2;

        torusKnot.rotation.x = -elapsedTime * 0.1;
        torusKnot.rotation.y = elapsedTime * 0.2;

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
