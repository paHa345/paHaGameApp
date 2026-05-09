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
import {
  GPUComputationRenderer,
  Variable,
} from "three/addons/misc/GPUComputationRenderer.js";

// import FlyingRobot from "./FlyingRobot";
// import Robot from "./Robot";
// import Experience from "./Experience/Experience";

// import Sizes from "./Experience/Utils/Sizes";
// import { Sky } from "three/addons/objects/Sky.js";

import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import terrainVertexShader from "./shaders/terrain/vertex.glsl";
import terrainFragmentShader from "./shaders/terrain/fragment.glsl";
import { Uniform } from "three/src/renderers/common/Uniform.js";
import { roughness, transmission } from "three/src/nodes/TSL.js";

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

  // useEffect(() => {
  //   if (fullScreenSTatus === 0 && GLCanvasRef.current !== null) {
  //     GLCanvasRef.current.requestFullscreen();
  //   }
  //   if (fullScreenSTatus === 1 && document.fullscreenElement) {
  //     document.exitFullscreen();
  //   }
  // }, [fullScreenSTatus]);

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
      const rgbeLoader = new HDRLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("./draco/");
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      const debugObject = {
        colorWaterDeep: "#002b3d",
        colorWaterSurface: "#66a8ff",
        colorSand: "#ffe894",
        colorGrass: "#85d534",
        colorSnow: "#ffffff",
        colorRock: "#bfbd8d",
      };

      /**
       * Environment map
       */
      rgbeLoader.load("/spruit_sunrise.hdr", (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = environmentMap;
        scene.backgroundBlurriness = 0.5;
        scene.environment = environmentMap;
      });

      /**
       * Terrain
       */

      // Geometry

      const geometry = new THREE.PlaneGeometry(10, 10, 500, 500);
      geometry.deleteAttribute("uv");
      geometry.deleteAttribute("normal");
      geometry.rotateX(-Math.PI * 0.5);

      // Material
      const uniforms = {
        uTime: new THREE.Uniform(0),
        uPositionFrequency: new THREE.Uniform(0.2),
        uStrength: new THREE.Uniform(2.0),
        uWarpFrequency: new THREE.Uniform(5),
        uWarpStrength: new THREE.Uniform(0.5),

        ucColorWaterDeep: new THREE.Uniform(
          new THREE.Color(debugObject.colorWaterDeep),
        ),
        uColorWaterSurface: new THREE.Uniform(
          new THREE.Color(debugObject.colorWaterSurface),
        ),
        uColorSand: new THREE.Uniform(new THREE.Color(debugObject.colorSand)),
        uColorGrass: new THREE.Uniform(new THREE.Color(debugObject.colorGrass)),
        uColorSnow: new THREE.Uniform(new THREE.Color(debugObject.colorSnow)),
        uColorRock: new THREE.Uniform(new THREE.Color(debugObject.colorRock)),
      };

      gui
        .add(uniforms.uPositionFrequency, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("uPositionFrequency");
      gui
        .add(uniforms.uStrength, "value")
        .min(0)
        .max(10)
        .step(0.001)
        .name("uStrength");
      gui
        .add(uniforms.uWarpFrequency, "value")
        .min(0)
        .max(10)
        .step(0.001)
        .name("uWarpFrequency");
      gui
        .add(uniforms.uWarpStrength, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("uWarpStrength");

      gui.addColor(debugObject, "colorWaterDeep").onChange(() => {
        uniforms.ucColorWaterDeep.value.set(debugObject.colorWaterDeep);
      });
      gui.addColor(debugObject, "colorWaterSurface").onChange(() => {
        uniforms.uColorWaterSurface.value.set(debugObject.colorWaterSurface);
      });
      gui.addColor(debugObject, "colorSand").onChange(() => {
        uniforms.uColorSand.value.set(debugObject.colorSand);
      });
      gui.addColor(debugObject, "colorGrass").onChange(() => {
        uniforms.uColorGrass.value.set(debugObject.colorGrass);
      });
      gui.addColor(debugObject, "colorSnow").onChange(() => {
        uniforms.uColorSnow.value.set(debugObject.colorSnow);
      });
      gui.addColor(debugObject, "colorRock").onChange(() => {
        uniforms.uColorRock.value.set(debugObject.colorRock);
      });

      const material = new CustomShaderMaterial({
        // CSM
        baseMaterial: THREE.MeshStandardMaterial,
        vertexShader: terrainVertexShader,
        fragmentShader: terrainFragmentShader,
        uniforms: uniforms,

        // Mesh Standart Material
        metalness: 0,
        roughness: 0.5,
        color: "#85d534",
      });

      const depthMaterial = new CustomShaderMaterial({
        // CSM
        baseMaterial: THREE.MeshDepthMaterial,
        vertexShader: terrainVertexShader,
        uniforms: uniforms,

        // Mesh Depth Material
        depthPacking: THREE.RGBADepthPacking,
      });

      // Mesh
      const terrain = new THREE.Mesh(geometry, material);
      terrain.customDepthMaterial = depthMaterial;

      terrain.receiveShadow = true;
      terrain.castShadow = true;

      scene.add(terrain);

      /**
       * Water
       */
      const water = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 1, 1),
        new THREE.MeshPhysicalMaterial({
          transmission: 1,
          roughness: 0.3,
        }),
      );
      water.rotation.x = -Math.PI * 0.5;
      water.position.y = -0.1;
      scene.add(water);

      /**
       * Board
       */

      const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11));
      const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10));
      // boardHole.position.y = 0.2;
      // boardHole.updateMatrixWorld();

      // Evaluate

      const evaluator = new Evaluator();
      const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION);
      board.geometry.clearGroups();
      board.material = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        metalness: 0,
        roughness: 0.3,
      });

      board.castShadow = true;
      board.receiveShadow = true;

      scene.add(board);

      /**
       * Lights
       */
      const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
      directionalLight.position.set(6.25, 3, 4);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 30;
      directionalLight.shadow.camera.top = 8;
      directionalLight.shadow.camera.right = 8;
      directionalLight.shadow.camera.bottom = -8;
      directionalLight.shadow.camera.left = -8;
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
      camera.position.set(-10, 6, -2);
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
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);

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

        uniforms.uTime.value = elapsedTime;

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
