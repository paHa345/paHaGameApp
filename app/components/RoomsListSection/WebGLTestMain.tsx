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
import terrainVertexShader from "./shaders/terrain/vertex.glsl";
import terrainFragmentShader from "./shaders/terrain/fragment.glsl";
import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { RGBShiftShader } from "three/addons/shaders/RGBShiftShader.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import Stats from "stats.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

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
       * Stats
       */

      const stats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);

      /**
       * Base
       */
      // Debug
      const gui = new GUI();

      // Scene
      const scene = new THREE.Scene();

      // Loaders

      const loadingBarEl = document.querySelector(".loading-bar") as any;

      const loadingManager = new THREE.LoadingManager(
        // Loaded
        () => {
          gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 });
          loadingBarEl.style.transform = ``;
        },
        // Progress
        (itemUrl, itemsLoaded, itemTotal) => {
          const progressRatio = itemsLoaded / itemTotal;
          loadingBarEl.style.transform = `scalex(${progressRatio})`;
        },
      );
      const gltfLoader = new GLTFLoader(loadingManager);
      const cubeTextureLoader = new THREE.CubeTextureLoader();

      const debugObject = { envMapIntensity: 2.5 };

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

        // Update effect composer

        // effectComposer.setSize(sizes.width, sizes.height);
        // effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      /**
       * Overlay
       */

      const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
      const overlayMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uAlpha: { value: 1 },
        },
        transparent: true,
        // wireframe: true,
        vertexShader: `
        void main(){
        gl_Position = vec4(position, 1.0);
        }
        `,
        fragmentShader: `
              uniform float uAlpha;

                void main(){
                gl_FragColor = vec4(0.0,0.0,0.0, uAlpha);

        }`,
      });

      const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
      scene.add(overlay);

      /**
       * Update all materials
       */
      const updateAllMaterials = () => {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity;
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

      environmentMap.colorSpace = THREE.SRGBColorSpace;

      scene.background = environmentMap;
      scene.environment = environmentMap;

      /**
       * Models
       */
      gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(0, -4, 0);
        gltf.scene.rotation.y = Math.PI * 0.5;
        scene.add(gltf.scene);

        updateAllMaterials();
      });

      /**
       * Lights
       */
      const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.far = 15;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.normalBias = 0.05;
      directionalLight.position.set(0.25, 3, -2.25);
      scene.add(directionalLight);

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
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
        // powerPreference: "high-performance",
        antialias: true,
      });
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.toneMappingExposure = 3;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

        stats.begin();

        const elapsedTime = timer.getElapsed();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

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
      <div className="loading-bar z-20 absolute top-1/2 w-full h-1 bg-slate-50 scale-x-[0] origin-top-left transition duration-500"></div>
    </>
  );
};

export default WebGLTestMain;
