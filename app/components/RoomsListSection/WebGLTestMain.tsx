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

import particlesVertexShader from "./shaders/40_gpgpuParticles/vertex.glsl";
import particlesFragmentShader from "./shaders/40_gpgpuParticles/fragment.glsl";
import gpgpuParticlesShader from "./shaders/gpgpu/particles.glsl";

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
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("./draco/");
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

        sizes.resolution.set(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio,
        );

        // Materials
        if (particles) {
          particles.material.uniforms.uResolution.value.set(
            sizes.width * sizes.pixelRatio,
            sizes.height * sizes.pixelRatio,
          );
        }

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
      camera.position.set(4.5, 4, 11);

      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, GLCanvasRef.current);
      controls.enableDamping = true;

      const debugObject = {
        clearColor: "#160920",
      };

      /**
       * Renderer
       */

      if (GLCanvasRef.current === null) {
        return;
      }
      const renderer = new THREE.WebGLRenderer({
        canvas: GLCanvasRef.current,
        // antialias: true,
      });
      // renderer.toneMapping = THREE.ACESFilmicToneMapping
      // renderer.toneMappingExposure = 3
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);
      renderer.setClearColor(debugObject.clearColor);

      /**
       * Base geometry
       */

      const baseGeometry = {
        instance: new THREE.SphereGeometry(3),
        count: 0,
      };

      baseGeometry.count = baseGeometry.instance.attributes.position.count;

      /**
       * GPU compute
       */
      // Setup
      const gpgpu: {
        size: number;
        computation?: GPUComputationRenderer;
        particlesVariable?: Variable;
      } = { size: Math.ceil(Math.sqrt(baseGeometry.count)) };
      gpgpu.computation = new GPUComputationRenderer(
        gpgpu.size,
        gpgpu.size,
        renderer,
      );

      // Base particles

      const baseParticlesTexture = gpgpu.computation.createTexture();

      // Particles variable
      gpgpu.particlesVariable = gpgpu.computation.addVariable(
        "uParticles",
        gpgpuParticlesShader,
        baseParticlesTexture,
      );

      gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [
        gpgpu.particlesVariable,
      ]);

      // Init
      gpgpu.computation.init();

      /**
       * Particles
       */

      let particles: {
        material: THREE.ShaderMaterial;
        points?: THREE.Points;
      } | null = null;

      particles = {
        material: new THREE.ShaderMaterial({
          vertexShader: particlesVertexShader,
          fragmentShader: particlesFragmentShader,
          uniforms: {
            uSize: new THREE.Uniform(0.4),
            uResolution: new THREE.Uniform(
              new THREE.Vector2(
                sizes.width * sizes.pixelRatio,
                sizes.height * sizes.pixelRatio,
              ),
            ),
          },
        }),
      };

      // Points
      particles.points = new THREE.Points(
        baseGeometry.instance,
        particles.material,
      );
      scene.add(particles.points);

      /**
       * Tweaks
       */
      gui.addColor(debugObject, "clearColor").onChange(() => {
        renderer.setClearColor(debugObject.clearColor);
      });
      gui
        .add(particles.material.uniforms.uSize, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("uSize");

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

        // Update controls
        controls.update();

        // GPGPU Update

        gpgpu.computation?.compute();

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
