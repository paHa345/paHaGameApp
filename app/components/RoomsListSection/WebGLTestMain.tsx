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
import { GPUComputationRenderer, Variable } from "three/addons/misc/GPUComputationRenderer.js";

// import FlyingRobot from "./FlyingRobot";
// import Robot from "./Robot";
// import Experience from "./Experience/Experience";

// import Sizes from "./Experience/Utils/Sizes";
// import { Sky } from "three/addons/objects/Sky.js";
import { Uniform } from "three/src/renderers/common/Uniform.js";
import { roughness, transmission, uniform } from "three/src/nodes/TSL.js";

import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { RGBShiftShader } from "three/addons/shaders/RGBShiftShader.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import Stats from "stats.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";

const WebGLTestMain = () => {
  const GLCanvasRef = useRef<HTMLCanvasElement>(null);

  // const [sizes, setSizes] = useState({
  //   width: 800,
  //   height: 600,
  //   resolution: new THREE.Vector2(800, 600),
  //   pixelRatio: Math.min(window.devicePixelRatio, 2),
  // });

  const [showTextStatus0, setShowTextStatus0] = useState(0);
  const [showTextStatus1, setShowTextStatus1] = useState(0);
  const [showTextStatus2, setShowTextStatus2] = useState(0);
  const [scalePoint, setScalePoint] = useState(0);

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
       * Stats
       */

      const stats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);

      // /**
      //  * Spector
      //  */

      // const SPECTOR = require("spectorjs");

      // const spector = new SPECTOR.Spector();
      // spector.displayUI();

      /**
       * Base
       */
      // Debug
      const gui = new GUI({ width: 400 });

      const debugObject = {
        clearColor: "#4f5f4e",
        portalColorStart: "#FDE7E7",
        portalColorEnd: "#F891EA",
      };

      // Scene
      const scene = new THREE.Scene();

      /**
       * Loaders
       */
      // Texture loader
      const textureLoader = new THREE.TextureLoader();

      // Draco loader
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("draco/");

      // GLTF loader
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      /**
       * Textures
       */

      const bakesTexture = textureLoader.load("baked.jpg");
      bakesTexture.flipY = false;
      bakesTexture.colorSpace = THREE.SRGBColorSpace;

      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

        sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

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
        // renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Update fireflies

        firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);

        // Update effect composer

        // effectComposer.setSize(sizes.width, sizes.height);
        // effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      /**
       * Material
       */

      const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakesTexture });

      // Pole lamp material

      const poleLampMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
      const portalLightMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColorStart: { value: new THREE.Color("#FDE7E7") },
          uColorEnd: { value: new THREE.Color("#F891EA") },
        },
        vertexShader: portalVertexShader,
        fragmentShader: portalFragmentShader,
      });

      gui.addColor(debugObject, "portalColorStart").onChange(() => {
        portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart);
      });
      gui.addColor(debugObject, "portalColorEnd").onChange(() => {
        portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd);
      });

      /**
       * Model
       */

      gltfLoader.load("./portal.glb", (gltf) => {
        // gltf.scene.traverse((child) => {
        //   const GLTFEl = child as THREE.Mesh;
        //   GLTFEl.material = bakedMaterial;
        // });

        const bakedMesh = gltf.scene.children.find((child) => {
          return child.name === "baked";
        }) as THREE.Mesh;

        const poleLightAMesh = gltf.scene.children.find((child) => {
          return child.name === "poleLightA";
        }) as THREE.Mesh;
        const poleLightBMesh = gltf.scene.children.find((child) => {
          return child.name === "poleLightB";
        }) as THREE.Mesh;
        const portalLightMesh = gltf.scene.children.find((child) => {
          return child.name === "portalLight";
        }) as THREE.Mesh;

        bakedMesh.material = bakedMaterial;
        poleLightAMesh.material = poleLampMaterial;
        poleLightBMesh.material = poleLampMaterial;
        portalLightMesh.material = portalLightMaterial;

        scene.add(gltf.scene);
      });

      /**
       * Fireflies
       */

      const firefliesGeometry = new THREE.BufferGeometry();
      const firefliesCount = 30;
      const positionsArray = new Float32Array(firefliesCount * 3);

      const scaleArray = new Float32Array(firefliesCount);

      for (let i = 0; i < firefliesCount; i++) {
        positionsArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
        positionsArray[i * 3 + 1] = Math.random() * 1.5;
        positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

        scaleArray[i] = Math.random();
      }
      firefliesGeometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));
      firefliesGeometry.setAttribute("aScale", new THREE.BufferAttribute(scaleArray, 1));

      //Material
      const firefliesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uSize: { value: 100 },
        },
        fragmentShader: firefliesFragmentShader,
        vertexShader: firefliesVertexShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      gui.add(firefliesMaterial.uniforms.uSize, "value").min(0).max(500).step(1);

      // Points

      const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
      scene.add(fireflies);

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
      camera.position.x = 4;
      camera.position.y = 2;
      camera.position.z = 4;
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
        // powerPreference: "high-performance",
        antialias: true,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      renderer.setClearColor(debugObject.clearColor);

      gui.addColor(debugObject, "clearColor").onChange(() => {
        renderer.setClearColor(debugObject.clearColor);
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

        stats.begin();

        const elapsedTime = timer.getElapsed();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        // Update fireflys material
        firefliesMaterial.uniforms.uTime.value = elapsedTime;
        portalLightMaterial.uniforms.uTime.value = elapsedTime;

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);

        stats.end();
      };

      tick();

      // Cleanup
      // return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <>
      <div className=" relative">
        <canvas
          className="webgl fixed top-0 left-0 z-10"
          onDoubleClick={doubleClickHandler}
          ref={GLCanvasRef}
        ></canvas>
      </div>
      <div className="loading-bar z-20 absolute top-1/2 w-full h-1 bg-slate-50 scale-x-[0] origin-top-left transition duration-500"></div>

      <div
        className={` point point-0 z-20 
      absolute top-2/4 left-2/4
       hidden
      
      `}
        onMouseEnter={() => {
          setShowTextStatus0(60);
        }}
        onMouseLeave={() => {
          setShowTextStatus0(0);
        }}
      >
        <div
          className="label absolute w-10 h-10 bg-gray-700 opacity-70
           font-thin font-serif text-center text-2xl
 text-slate-100 top-[-20px] left-[-20px] border rounded-full cursor-help "
        >
          1
        </div>
        <div
          className={` absolute top-[30px] left-[-120px] w-[200px] p-5 rounded 
         bg-gray-700 opacity-${showTextStatus0} font-thin font-serif text-center text-sm 
          text-slate-100 pointer-events-none `}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      </div>
      <div
        className={` point point-1 z-20 
      absolute top-2/4 left-2/4 hidden
      
      `}
        onMouseEnter={() => {
          setShowTextStatus1(60);
        }}
        onMouseLeave={() => {
          setShowTextStatus1(0);
        }}
      >
        <div
          className="label absolute w-10 h-10 bg-gray-700 opacity-70
           font-thin font-serif text-center text-2xl
 text-slate-100 top-[-20px] left-[-20px] border rounded-full cursor-help "
        >
          2
        </div>
        <div
          className={` absolute top-[30px] left-[-120px] w-[200px] p-5 rounded 
         bg-gray-700 opacity-${showTextStatus1} font-thin font-serif text-center text-sm 
          text-slate-100 pointer-events-none `}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      </div>
      <div
        className={` point point-2 z-20 
      absolute top-2/4 left-2/4 hidden
      
      `}
        onMouseEnter={() => {
          setShowTextStatus2(60);
        }}
        onMouseLeave={() => {
          setShowTextStatus2(0);
        }}
      >
        <div
          className="label absolute w-10 h-10 bg-gray-700 opacity-70
           font-thin font-serif text-center text-2xl
 text-slate-100 top-[-20px] left-[-20px] border rounded-full cursor-help "
        >
          3
        </div>
        <div
          className={` absolute top-[30px] left-[-120px] w-[200px] p-5 rounded 
         bg-gray-700 opacity-${showTextStatus2} font-thin font-serif text-center text-sm 
          text-slate-100 pointer-events-none `}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      </div>
    </>
  );
};

export default WebGLTestMain;
