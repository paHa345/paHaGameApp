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

import particlesMorphVertexShader from "./shaders/morphParticles/vertex.glsl";
import particlesMorphFragmentShader from "./shaders/morphParticles/fragment.glsl";

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

        sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

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
      const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
      camera.position.set(0, 0, 8 * 2);

      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, GLCanvasRef.current);
      controls.enableDamping = true;

      const debugObject = { clearColor: "#160920" };

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

      gui.addColor(debugObject, "clearColor").onChange(() => {
        renderer.setClearColor(debugObject.clearColor);
      });
      renderer.setClearColor(debugObject.clearColor);

      /**
       * Particles
       */

      let particles: {
        geometry: THREE.BufferGeometry;
        material: THREE.ShaderMaterial;
        points?: THREE.Points;
        maxCount: number;
        positions: THREE.Float32BufferAttribute[];
        index: number;
        morph?: any;
        morph0?: any;
        morph1?: any;
        morph2?: any;
        morph3?: any;
      } | null = null;

      // Load models

      gltfLoader.load("./models.glb", (gltf) => {
        particles = {
          geometry: new THREE.BufferGeometry(),

          material: new THREE.ShaderMaterial({
            vertexShader: particlesMorphVertexShader,
            fragmentShader: particlesMorphFragmentShader,
            uniforms: {
              uSize: new THREE.Uniform(0.2),
              uResolution: new THREE.Uniform(
                new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio),
              ),
              uProgress: new THREE.Uniform(0),
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
          maxCount: 0,
          positions: [],
          index: 0,
        };

        // Positions

        const positions = gltf.scene.children.map((child) => {
          const childObj = child as any;
          return childObj.geometry.attributes.position;
        });

        for (const position of positions) {
          if (position.count > particles.maxCount) {
            particles.maxCount = position.count;
          }
        }

        for (const position of positions) {
          const originalArray = position.array;
          const newArray = new Float32Array(particles.maxCount * 3);
          for (let i = 0; i < particles.maxCount; i++) {
            const i3 = i * 3;
            if (i3 < originalArray.length) {
              newArray[i3 + 0] = originalArray[i3 + 0];
              newArray[i3 + 1] = originalArray[i3 + 1];
              newArray[i3 + 2] = originalArray[i3 + 2];
            } else {
              const randomIndex = Math.floor(position.count * Math.random()) * 3;
              newArray[i3 + 0] = originalArray[randomIndex + 0];
              newArray[i3 + 1] = originalArray[randomIndex + 1];
              newArray[i3 + 2] = originalArray[randomIndex + 2];
            }
          }
          particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3));
        }

        // Geometry
        particles.geometry.setAttribute("position", particles.positions[particles.index]);
        particles.geometry.setAttribute("aPositionTarget", particles.positions[3]);
        // particles.geometry.setIndex(null);

        // Points
        particles.points = new THREE.Points(particles.geometry, particles.material);
        scene.add(particles.points);

        // Methods

        particles.morph = (index: number) => {
          if (!particles) return;
          particles.geometry.attributes.position = particles.positions[particles.index];
          particles.geometry.attributes.aPositionTarget = particles.positions[index];

          // Animate uProgress

          gsap.fromTo(
            particles.material.uniforms.uProgress,
            { value: 0 },
            { value: 1, duration: 3, ease: "linear" },
          );

          // Save index
          particles.index = index;
        };

        particles.morph0 = () => {
          particles?.morph(0);
        };
        particles.morph1 = () => {
          particles?.morph(1);
        };
        particles.morph2 = () => {
          particles?.morph(2);
        };
        particles.morph3 = () => {
          particles?.morph(3);
        };

        //Tweaks

        gui
          .add(particles.material.uniforms.uProgress, "value")
          .min(0)
          .max(1)
          .step(0.001)
          .name("Прогресс");

        gui.add(particles, "morph0");
        gui.add(particles, "morph1");
        gui.add(particles, "morph2");
        gui.add(particles, "morph3");
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
