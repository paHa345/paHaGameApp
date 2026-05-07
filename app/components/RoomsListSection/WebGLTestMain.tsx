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
// import wobbleVertexShader from "./shaders/wobble/vertex.glsl";
// import wobbleFragmentShader from "./shaders/wobble/fragment.glsl";
import slicedVertexShader from "./shaders/sliced/vertex.glsl";
import slicedFragmentShader from "./shaders/sliced/fragment.glsl";

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

      const debugObject = {
        clearColor: "#160920",
        colorA: "#0000ff",
        colorB: "#ff0000",
      };

      /**
       * Environment map
       */
      rgbeLoader.load("./aerodynamics_workshop.hdr", (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = environmentMap;
        scene.backgroundBlurriness = 0.5;
        scene.environment = environmentMap;
      });

      /**
       * Sliced model
       */

      const uniforms = {
        uSliceStart: new THREE.Uniform(1.75),
        uSliceArc: new THREE.Uniform(1.25),
      };

      gui.add(uniforms.uSliceStart, "value", -Math.PI, Math.PI, 0.001).name("Начало разреза");
      gui.add(uniforms.uSliceArc, "value", 0, Math.PI * 2, 0.001).name("Конец разреза");

      const patchMap = {
        csm_Slice: {
          "#include <colorspace_fragment>": `
          #include <colorspace_fragment>
          if(!gl_FrontFacing){
            gl_FragColor = vec4(0.75,0.15,0.3,1.0);
          }
          `,
        },
      };

      // Material
      const material = new THREE.MeshStandardMaterial({
        metalness: 0.5,
        roughness: 0.25,
        envMapIntensity: 0.5,
        color: "#858080",
      });

      const slicedMaterial = new CustomShaderMaterial({
        // CSM
        baseMaterial: THREE.MeshStandardMaterial,
        vertexShader: slicedVertexShader,
        fragmentShader: slicedFragmentShader,
        uniforms: uniforms,
        patchMap: patchMap,

        // Mesh standert material
        metalness: 0.5,
        roughness: 0.25,
        envMapIntensity: 0.5,
        color: "#858080",
        side: THREE.DoubleSide,
      });

      const slicedDepthMaterial = new CustomShaderMaterial({
        // CSM
        baseMaterial: THREE.MeshDepthMaterial,
        vertexShader: slicedVertexShader,
        fragmentShader: slicedFragmentShader,
        uniforms: uniforms,
        patchMap: patchMap,

        // MeshDepthMaterial
        depthPacking: THREE.RGBADepthPacking,
      });

      // Model
      let model: null | THREE.Group<THREE.Object3DEventMap> = null;
      gltfLoader.load("./gears.glb", (gltf) => {
        model = gltf.scene;

        model.traverse((child) => {
          const object = child as any;
          if (object.isMesh) {
            if (object.name === "outerHull") {
              object.material = slicedMaterial;
              object.customDepthMaterial = slicedDepthMaterial;
            } else {
              object.material = material;
            }
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });

        scene.add(model);
      });

      /**
       * Plane
       */
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 10),
        new THREE.MeshStandardMaterial({ color: "#aaaaaa" }),
      );
      plane.receiveShadow = true;
      plane.position.x = -4;
      plane.position.y = -3;
      plane.position.z = -4;
      plane.lookAt(new THREE.Vector3(0, 0, 0));
      scene.add(plane);

      /**
       * Lights
       */
      const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
      directionalLight.position.set(6.25, 3, 4);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 30;
      directionalLight.shadow.normalBias = 0.05;
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
      camera.position.set(-5, 5, 12);
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

        // Update model
        if (model !== null) {
          model.rotation.y = elapsedTime * 0.1;
        }

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
