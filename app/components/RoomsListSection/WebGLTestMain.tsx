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

const WebGLTestMain = () => {
  const GLCanvasRef = useRef<HTMLCanvasElement>(null);

  // /** */
  // //Textures
  // /** */

  // const image = new Image();

  // const texture = new THREE.Texture(image);

  // image.onload = () => {
  //   texture.needsUpdate = true;
  // };

  // image.src = "/textures/Door_Wood_001_basecolor.jpg";

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
   *  Structuring code
   */

  useEffect(() => {
    if (typeof window !== "undefined") {
      const expirience = new Experience(GLCanvasRef.current);
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

      // /**
      //  * Loaders
      //  */
      // const gltfLoader = new GLTFLoader();
      // const textureLoader = new THREE.TextureLoader();
      // const cubeTextureLoader = new THREE.CubeTextureLoader();

      // /**
      //  * Base
      //  */
      // // Debug
      // const gui = new GUI({ width: 300 });
      // const debugObject = { envMapIntensity: 0.4 };

      // const scene = new THREE.Scene();

      // /**
      //  * Update all materials
      //  */
      // const updateAllMaterials = () => {
      //   scene.traverse((child) => {
      //     if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      //       // child.material.envMap = environmentMap
      //       child.material.envMapIntensity = debugObject.envMapIntensity;
      //       child.material.needsUpdate = true;
      //       child.castShadow = true;
      //       child.receiveShadow = true;
      //     }
      //   });
      // };

      // /**
      //  * Environment map
      //  */
      // const environmentMap = cubeTextureLoader.load([
      //   "/textures/environmentMap/px.jpg",
      //   "/textures/environmentMap/nx.jpg",
      //   "/textures/environmentMap/py.jpg",
      //   "/textures/environmentMap/ny.jpg",
      //   "/textures/environmentMap/pz.jpg",
      //   "/textures/environmentMap/nz.jpg",
      // ]);

      // environmentMap.colorSpace = THREE.SRGBColorSpace;

      // // scene.background = environmentMap
      // scene.environment = environmentMap;

      // debugObject.envMapIntensity = 0.4;
      // gui
      //   .add(debugObject, "envMapIntensity")
      //   .min(0)
      //   .max(4)
      //   .step(0.001)
      //   .onChange(updateAllMaterials);

      // /**
      //  * Models
      //  */
      // let foxMixer: null | THREE.AnimationMixer = null;

      // gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
      //   // Model
      //   gltf.scene.scale.set(0.02, 0.02, 0.02);
      //   scene.add(gltf.scene);

      //   // Animation
      //   foxMixer = new THREE.AnimationMixer(gltf.scene);
      //   const foxAction = foxMixer.clipAction(gltf.animations[0]);
      //   foxAction.play();

      //   // Update materials
      //   updateAllMaterials();
      // });

      // /**
      //  * Floor
      //  */
      // const floorColorTexture = textureLoader.load("textures/dirt/color.jpg");
      // floorColorTexture.colorSpace = THREE.SRGBColorSpace;
      // floorColorTexture.repeat.set(1.5, 1.5);
      // floorColorTexture.wrapS = THREE.RepeatWrapping;
      // floorColorTexture.wrapT = THREE.RepeatWrapping;

      // const floorNormalTexture = textureLoader.load("textures/dirt/normal.jpg");
      // floorNormalTexture.repeat.set(1.5, 1.5);
      // floorNormalTexture.wrapS = THREE.RepeatWrapping;
      // floorNormalTexture.wrapT = THREE.RepeatWrapping;

      // const floorGeometry = new THREE.CircleGeometry(5, 64);
      // const floorMaterial = new THREE.MeshStandardMaterial({
      //   map: floorColorTexture,
      //   normalMap: floorNormalTexture,
      // });
      // const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      // floor.rotation.x = -Math.PI * 0.5;
      // scene.add(floor);

      // /**
      //  * Lights
      //  */
      // const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
      // directionalLight.castShadow = true;
      // directionalLight.shadow.camera.far = 15;
      // directionalLight.shadow.mapSize.set(1024, 1024);
      // directionalLight.shadow.normalBias = 0.05;
      // directionalLight.position.set(3.5, 2, -1.25);
      // scene.add(directionalLight);

      // gui.add(directionalLight, "intensity").min(0).max(10).step(0.001).name("lightIntensity");
      // gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001).name("lightX");
      // gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001).name("lightY");
      // gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001).name("lightZ");

      // window.addEventListener("resize", () => {
      //   // Update sizes
      //   sizes.width = window.innerWidth;
      //   sizes.height = window.innerHeight;

      //   // Update camera
      //   camera.aspect = sizes.width / sizes.height;
      //   camera.updateProjectionMatrix();

      //   // Update renderer
      //   renderer.setSize(sizes.width, sizes.height);
      //   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // });

      // /**
      //  * Camera
      //  */
      // // Base camera
      // const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
      // camera.position.set(6, 4, 8);
      // scene.add(camera);

      // // Controls
      // const controls = new OrbitControls(camera, GLCanvasRef.current);
      // controls.enableDamping = true;

      // /**
      //  * Renderer
      //  */
      // const renderer = new THREE.WebGLRenderer({
      //   canvas: GLCanvasRef.current,
      //   antialias: true,
      // });
      // renderer.toneMapping = THREE.CineonToneMapping;
      // renderer.toneMappingExposure = 1.75;
      // renderer.shadowMap.enabled = true;
      // renderer.shadowMap.type = THREE.PCFShadowMap;
      // renderer.setClearColor("#211d20");
      // renderer.setSize(sizes.width, sizes.height);
      // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // /**
      //  * Animate
      //  */

      // const timer = new THREE.Timer();
      // let previousTime = 0;

      // let currentIntersect: null | THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>> =
      //   null;

      // const tick = () => {
      //   // controls.update();
      //   timer.update();

      //   const elapsedTime = timer.getElapsed();

      //   const deltaTime = elapsedTime - previousTime;
      //   previousTime = elapsedTime;

      //   // Update controls
      //   controls.update();

      //   if (foxMixer) {
      //     foxMixer.update(deltaTime);
      //   }

      //   // Render
      //   renderer.render(scene, camera);

      //   // Call tick again on the next frame
      //   window.requestAnimationFrame(tick);
      // };

      // tick();

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
