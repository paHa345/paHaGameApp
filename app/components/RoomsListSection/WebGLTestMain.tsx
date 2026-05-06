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
import { GPUComputationRenderer, Variable } from "three/addons/misc/GPUComputationRenderer.js";

// import FlyingRobot from "./FlyingRobot";
// import Robot from "./Robot";
// import Experience from "./Experience/Experience";
// import testVertexShaders from "./shaders/test/vertex.glsl";
// import testFragmentShaders from "./shaders/test/fragment.glsl";
// import galaxyVertexShader from "./shaders/galaxy/vertex.glsl";
// import galaxyFragmentShader from "./shaders/galaxy/fragment.glsl";
// import cofeeSmokeVertexShader from "./shaders/cofeeSmoke/vertex.glsl";
// import cofeeSmokeFragmentShader from "./shaders/cofeeSmoke/fragment.glsl";
// import holographicVertexShader from "./shaders/holographic/vertex.glsl";
// import holographicFragmentShader from "./shaders/holographic/fragment.glsl";
// import fireworkVertexShader from "./shaders/firework/vertex.glsl";
// import fireworkFragmentShader from "./shaders/firework/fragment.glsl";
// import Sizes from "./Experience/Utils/Sizes";
// import { Sky } from "three/addons/objects/Sky.js";
// import shadingVertexShader from "./shaders/shading/vertex.glsl";
// import shadingFragmentShader from "./shaders/shading/fragment.glsl";
// import waterVertexShader from "./shaders/water/vertex.glsl";
// import waterFragmentShader from "./shaders/water/fragment.glsl";
// import halftoneVertexShader from "./shaders/halftone/vertex.glsl";
// import halftoneFragmentShader from "./shaders/halftone/fragment.glsl";
// import earthVertexShader from "./shaders/earth/vertex.glsl";
// import earthFragmentShader from "./shaders/earth/fragment.glsl";
// import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
// import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";
// import particlesMorphVertexShader from "./shaders/morphParticles/vertex.glsl";
// import particlesMorphFragmentShader from "./shaders/morphParticles/fragment.glsl";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

import CustomShaderMaterial from "three-custom-shader-material/vanilla";

// import particlesVertexShader from "./shaders/40_gpgpuParticles/vertex.glsl";
// import particlesFragmentShader from "./shaders/40_gpgpuParticles/fragment.glsl";
// import gpgpuParticlesShader from "./shaders/gpgpu/particles.glsl";
import wobbleVertexShader from "./shaders/wobble/vertex.glsl";
import wobbleFragmentShader from "./shaders/wobble/fragment.glsl";

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
      const rgbeLoader = new HDRLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("./draco/");
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      /**
       * Environment map
       */
      rgbeLoader.load("./urban_alley_01_1k.hdr", (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = environmentMap;
        scene.environment = environmentMap;
      });

      const debugObject = {
        clearColor: "#160920",
        colorA: "#0000ff",
        colorB: "#ff0000",
      };

      /**
       * Wobble
       */

      const uniforms = {
        uTime: new THREE.Uniform(0),
        uPositionFrequency: new THREE.Uniform(0.5),
        uTimeFrequency: new THREE.Uniform(0.4),
        uStrength: new THREE.Uniform(0.3),

        uWarpPositionFrequency: new THREE.Uniform(0.38),
        uWarpTimeFrequency: new THREE.Uniform(0.12),
        uWarpStrength: new THREE.Uniform(1.7),

        uColorA: new THREE.Uniform(new THREE.Color(debugObject.colorA)),
        uColorB: new THREE.Uniform(new THREE.Color(debugObject.colorB)),
      };

      // Material
      const material = new CustomShaderMaterial({
        // CSM
        baseMaterial: THREE.MeshPhysicalMaterial,
        vertexShader: wobbleVertexShader,
        fragmentShader: wobbleFragmentShader,
        uniforms: uniforms,
        // MeshPhysicalMaterial
        metalness: 0,
        roughness: 0.5,
        color: "#ffffff",
        transmission: 0,
        ior: 1.5,
        thickness: 1.5,
        transparent: true,
        wireframe: false,
      });

      const depthMaterial = new CustomShaderMaterial({
        // CSM
        baseMaterial: THREE.MeshDepthMaterial,
        vertexShader: wobbleVertexShader,
        uniforms: uniforms,

        // MeshDepthMaterial
        depthPacking: THREE.RGBADepthPacking,
      });

      // Tweaks

      gui.add(uniforms.uPositionFrequency, "value", 0, 2, 0.001).name("Частота");
      gui.add(uniforms.uTimeFrequency, "value", 0, 2, 0.001).name("Частота по времени");
      gui.add(uniforms.uStrength, "value", 0, 2, 0.001).name("Сила");

      gui.add(uniforms.uWarpPositionFrequency, "value", 0, 2, 0.001).name("Частота деформации");
      gui
        .add(uniforms.uWarpTimeFrequency, "value", 0, 2, 0.001)
        .name("Частота деформации по времени");
      gui.add(uniforms.uWarpStrength, "value", 0, 2, 0.001).name("Сила деформации");

      gui.addColor(debugObject, "colorA").onChange(() => {
        uniforms.uColorA.value.set(debugObject.colorA);
      });
      gui.addColor(debugObject, "colorB").onChange(() => {
        uniforms.uColorB.value.set(debugObject.colorB);
      });

      // gui.add(material, "metalness", 0, 1, 0.001);
      // gui.add(material, "roughness", 0, 1, 0.001);
      // gui.add(material, "transmission", 0, 1, 0.001);
      // gui.add(material, "ior", 0, 10, 0.001);
      // gui.add(material, "thickness", 0, 10, 0.001);
      // gui.addColor(material, "color");

      // // Geometry
      // let geometry = new THREE.IcosahedronGeometry(2.5, 50) as any;
      // geometry = mergeVertices(geometry);
      // geometry.computeTangents();

      // // Mesh
      // const wobble = new THREE.Mesh(geometry, material);
      // wobble.customDepthMaterial = depthMaterial;
      // wobble.receiveShadow = true;
      // wobble.castShadow = true;
      // scene.add(wobble);

      // Model
      gltfLoader.load("./suzanne.glb", (gltf) => {
        const wobble = gltf.scene.children[0] as any;
        wobble.castShadow = true;
        wobble.material = material;
        wobble.customDepthMaterial = depthMaterial;
        scene.add(wobble);
      });

      /**
       * Plane
       */
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 15, 15),
        new THREE.MeshStandardMaterial(),
      );
      plane.receiveShadow = true;
      plane.rotation.y = Math.PI;
      plane.position.y = -5;
      plane.position.z = 5;
      scene.add(plane);

      /**
       * Lights
       */
      const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.camera.far = 15;
      directionalLight.shadow.normalBias = 0.05;
      directionalLight.position.set(0.25, 2, -2.25);
      scene.add(directionalLight);

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
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
      camera.position.set(13, -3, -5);
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

      let currentIntersect: null | THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>> =
        null;

      const tick = () => {
        // controls.update();
        timer.update();

        const elapsedTime = timer.getElapsed();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        // Materials

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
