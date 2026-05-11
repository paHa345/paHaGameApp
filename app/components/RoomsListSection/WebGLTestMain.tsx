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
// import { paginateListObjectsV2 } from "@aws-sdk/client-s3";
import {
  GPUComputationRenderer,
  Variable,
} from "three/addons/misc/GPUComputationRenderer.js";

// import FlyingRobot from "./FlyingRobot";
// import Robot from "./Robot";
// import Experience from "./Experience/Experience";

// import Sizes from "./Experience/Utils/Sizes";
// import { Sky } from "three/addons/objects/Sky.js";
import { Uniform } from "three/src/renderers/common/Uniform.js";
import { roughness, transmission } from "three/src/nodes/TSL.js";

import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import terrainVertexShader from "./shaders/terrain/vertex.glsl";
import terrainFragmentShader from "./shaders/terrain/fragment.glsl";
import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";

const WebGLTestMain = () => {
  const GLCanvasRef = useRef<HTMLCanvasElement>(null);

  // const [sizes, setSizes] = useState({
  //   width: 800,
  //   height: 600,
  //   resolution: new THREE.Vector2(800, 600),
  //   pixelRatio: Math.min(window.devicePixelRatio, 2),
  // });

  const [cubeColor, setCubeColor] = useState({
    color: 0xff0000,
  });

  const modelRef = useRef<any>(null);

  const [fullScreenSTatus, setFullScreenSTatus] = useState(1);

  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  });

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

      const sizes = {
        width: 800,
        height: 600,
        resolution: new THREE.Vector2(800, 600),
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      };

      // sizes.resolution = new THREE.Vector2(sizes.width, sizes.height);

      /**
       * Base
       */
      // Debug
      const gui = new GUI();

      // Scene
      const scene = new THREE.Scene();

      // Loaders
      const gltfLoader = new GLTFLoader();
      const cubeTextureLoader = new THREE.CubeTextureLoader();
      const textureLoader = new THREE.TextureLoader();

      const debugObject = {};

      /**
       * Update all materials
       */
      const updateAllMaterials = () => {
        scene.traverse((child) => {
          if (
            child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
          ) {
            child.material.envMapIntensity = 2.5;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      };

      /**
       * Environment map
       */
      const environmentMap = cubeTextureLoader.load([
        "/textures/environmentMaps/0/px.jpg",
        "/textures/environmentMaps/0/nx.jpg",
        "/textures/environmentMaps/0/py.jpg",
        "/textures/environmentMaps/0/ny.jpg",
        "/textures/environmentMaps/0/pz.jpg",
        "/textures/environmentMaps/0/nz.jpg",
      ]);

      scene.background = environmentMap;
      scene.environment = environmentMap;

      /**
       * Models
       */
      gltfLoader.load(
        "/models/DamagedHelmet/glTF/DamagedHelmet.gltf",
        (gltf) => {
          gltf.scene.scale.set(2, 2, 2);
          gltf.scene.rotation.y = Math.PI * 0.5;
          scene.add(gltf.scene);

          updateAllMaterials();
        },
      );

      /**
       * Lights
       */
      const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.camera.far = 15;
      directionalLight.shadow.normalBias = 0.05;
      directionalLight.position.set(0.25, 3, -2.25);
      scene.add(directionalLight);

      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

        sizes.resolution.set(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio,
        );

        // // Materials
        // if (particles) {
        //   particles.material.uniforms.uResolution.value.set(
        //     sizes.width * sizes.pixelRatio,
        //     sizes.height * sizes.pixelRatio,
        //   );
        // }

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(
        25,
        sizes.width / sizes.height,
        0.1,
        100,
      );
      camera.position.set(4, 1, -4);
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
        antialias: true,
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.toneMappingExposure = 1.5;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /**
       * Post processing
       */

      const effectComposer = new EffectComposer(renderer);
      effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      effectComposer.setSize(sizes.width, sizes.height);

      const renderPass = new RenderPass(scene, camera);
      effectComposer.addPass(renderPass);

      const dotScreenPass = new DotScreenPass();
      dotScreenPass.enabled = false;
      effectComposer.addPass(dotScreenPass);

      const glitchPass = new GlitchPass();
      glitchPass.goWild = false;
      glitchPass.enabled = false;
      effectComposer.addPass(glitchPass);

      /**
       * Animate
       */

      const timer = new THREE.Timer();
      let previousTime = 0;

      let currentIntersect: null | THREE.Intersection<
        THREE.Object3D<THREE.Object3DEventMap>
      > = null;

      const tick = () => {
        // controls.update();
        timer.update();

        const elapsedTime = timer.getElapsed();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        // Update controls
        controls.update();

        // Render
        // renderer.render(scene, camera);
        effectComposer.render();

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
