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

const WebGLTestMain = () => {
  const GLCanvasRef = useRef(null) as any;

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
    if (fullScreenSTatus === 0) {
      GLCanvasRef.current.requestFullscreen();
    }
    if (fullScreenSTatus === 1 && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullScreenSTatus]);

  /**Blender model
   *
   */

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setSizes({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      const gui = new GUI({ width: 300 });

      const debugObj = {
        envMapIntensity: 0,
      };

      const scene = new THREE.Scene();

      /**
       * update all materials
       */

      const updateAllMaterials = () => {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMap = environmentMap;
            child.material.envMapIntensity = debugObj.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      };

      /**
       * Models
       */
      // const dracoLoader = new DRACOLoader();
      // dracoLoader.setDecoderPath("/draco/");

      // const gltfLoader = new GLTFLoader();
      // gltfLoader.setDRACOLoader(dracoLoader);

      // let mixer = null;

      // gltfLoader.load("/models/burger.glb", (gltf) => {
      //   scene.add(gltf.scene);
      // });

      /**
       * Loaders
       */

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");

      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      const cubeTextureLoader = new THREE.CubeTextureLoader();

      /**
       * Environment map
       */

      const environmentMap = cubeTextureLoader.load([
        "textures/environmentMaps/0/px.png",
        "textures/environmentMaps/0/nx.png",
        "textures/environmentMaps/0/py.png",
        "textures/environmentMaps/0/ny.png",
        "textures/environmentMaps/0/pz.png",
        "textures/environmentMaps/0/nz.png",
      ]);
      environmentMap.colorSpace = THREE.SRGBColorSpace;
      scene.background = environmentMap;
      scene.environment = environmentMap;

      debugObj.envMapIntensity = 2;

      gui
        .add(debugObj, "envMapIntensity")
        .min(0)
        .max(5)
        .step(0.001)
        .onChange(() => {
          updateAllMaterials();
        });

      /**
       * Models
       */

      gltfLoader.load("/models/burger.glb", (gltf) => {
        gltf.scene.scale.set(0.3, 0.3, 0.3);
        gltf.scene.position.set(0, -4, 0);
        gltf.scene.rotation.y = Math.PI * 0.5;

        scene.add(gltf.scene);
        gui.add(gltf.scene.rotation, "y").min(-Math.PI).max(Math.PI).step(0.001).name("Поворот");

        updateAllMaterials();
      });

      /**
//      * Lights
//      */
      // const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
      // scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
      directionalLight.position.set(0.25, 3, -2.2);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.far = 15;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.normalBias = 0.05;
      scene.add(directionalLight);

      const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
      scene.add(directionalLightCameraHelper);

      gui.add(directionalLight, "intensity").min(0).max(10).step(0.01).name("Интенсивность света");
      gui
        .add(directionalLight.position, "x")
        .min(-5)
        .max(5)
        .step(0.01)
        .name("Положение света по X");
      gui
        .add(directionalLight.position, "y")
        .min(-5)
        .max(5)
        .step(0.01)
        .name("Положение всета по Y");
      gui
        .add(directionalLight.position, "z")
        .min(-5)
        .max(5)
        .step(0.01)
        .name("Положение всета по Z");

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
       * Floor
       */
      // const floor = new THREE.Mesh(
      //   new THREE.PlaneGeometry(50, 50),
      //   new THREE.MeshStandardMaterial({
      //     color: "#444444",
      //     metalness: 0,
      //     roughness: 0.5,
      //   }),
      // );
      // floor.receiveShadow = true;
      // floor.rotation.x = -Math.PI * 0.5;
      // scene.add(floor);

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
      camera.position.set(-3, 3, 3);
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, GLCanvasRef.current);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: GLCanvasRef.current,
        antialias: true,
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 3;

      gui
        .add(renderer, "toneMapping", {
          NO: THREE.NoToneMapping,
          Linear: THREE.LinearToneMapping,
          Reinhard: THREE.ReinhardToneMapping,
          Cineon: THREE.CineonToneMapping,
          ACESFilming: THREE.ReinhardToneMapping,
        })
        .onFinishChange(() => {
          // renderer.toneMapping = Number(renderer.toneMapping)
          updateAllMaterials();
        });

      gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

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
      return () => window.removeEventListener("resize", handleResize);
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
