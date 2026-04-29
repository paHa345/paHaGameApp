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

import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

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
      const textureLoader = new THREE.TextureLoader();
      const gltfLoader = new GLTFLoader();

      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

        sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

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
      camera.position.set(0, 0, 18);

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
        // antialias: true,
      });
      // renderer.toneMapping = THREE.ACESFilmicToneMapping
      // renderer.toneMappingExposure = 3
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);
      renderer.setClearColor("#181818");

      /**
       * Displacement
       */

      const displacement: {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D | null;
        glowImage: HTMLImageElement;
        interactivePlane: THREE.Mesh<
          THREE.PlaneGeometry,
          THREE.MeshBasicMaterial,
          THREE.Object3DEventMap
        >;
        rayCaster: THREE.Raycaster;
        screenCursor: THREE.Vector2;
        canvasCursor: THREE.Vector2;
        canvasCursorPrevious: THREE.Vector2;
        texture: null | THREE.CanvasTexture<HTMLCanvasElement>;
      } = {
        canvas: document.createElement("canvas"),
        context: null,
        glowImage: new Image(),
        interactivePlane: new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide }),
        ),
        rayCaster: new THREE.Raycaster(),
        screenCursor: new THREE.Vector2(9999, 9999),
        canvasCursor: new THREE.Vector2(9999, 9999),
        canvasCursorPrevious: new THREE.Vector2(9999, 9999),
        texture: null,
      };

      displacement.canvas.width = 128;
      displacement.canvas.height = 128;
      displacement.canvas.style.position = "fixed";
      displacement.canvas.style.width = "512px";
      displacement.canvas.style.height = "512px";
      displacement.canvas.style.top = "0px";
      displacement.canvas.style.left = "0px";
      displacement.canvas.style.zIndex = "10";
      document.body.append(displacement.canvas);

      // Context

      displacement.context = displacement.canvas.getContext("2d");

      if (displacement.context === null) return;
      displacement.context?.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

      // Glow image
      displacement.glowImage.src = "./glow.png";

      // Interactive plane
      displacement.interactivePlane.visible = false;
      scene.add(displacement.interactivePlane);

      // Coordinates

      window.addEventListener("pointermove", (event) => {
        displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
        displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1;
      });

      // Texture

      displacement.texture = new THREE.CanvasTexture(displacement.canvas);

      /**
       * Particles
       */
      const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
      particlesGeometry.setIndex(null);
      particlesGeometry.deleteAttribute("normal");

      const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count);
      const anglesArray = new Float32Array(particlesGeometry.attributes.position.count);

      for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
        intensitiesArray[i] = Math.random();
        anglesArray[i] = Math.random() * Math.PI * 2;
      }
      particlesGeometry.setAttribute("aIntensity", new THREE.BufferAttribute(intensitiesArray, 1));
      particlesGeometry.setAttribute("aAngle", new THREE.BufferAttribute(anglesArray, 1));

      const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        uniforms: {
          uResolution: new THREE.Uniform(
            new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio),
          ),
          uPictureTexture: new THREE.Uniform(textureLoader.load("./picture-3.png")),
          uDisplacementTexture: new THREE.Uniform(displacement.texture),
        },
      });
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

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

        /**
         * Raycaster
         */

        displacement.rayCaster.setFromCamera(displacement.screenCursor, camera);

        const intersections = displacement.rayCaster.intersectObject(displacement.interactivePlane);

        if (intersections.length) {
          const uv = intersections[0].uv;
          if (!uv) return;
          displacement.canvasCursor.x = uv.x * displacement.canvas.width;
          displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
        }

        /**
         * Displacement
         */

        if (!displacement.context) return;
        displacement.context.globalCompositeOperation = "source-over";
        displacement.context.globalAlpha = 0.02;

        displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

        // Speed alpha
        const cursorDistance = displacement.canvasCursorPrevious.distanceTo(
          displacement.canvasCursor,
        );
        displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
        const alpha = Math.min(cursorDistance * 0.1, 1);

        // Draw glow
        const glowSize = displacement.canvas.width * 0.25;

        displacement.context.globalCompositeOperation = "lighten";
        displacement.context.globalAlpha = alpha;

        displacement.context?.drawImage(
          displacement.glowImage,
          displacement.canvasCursor.x - glowSize * 0.5,
          displacement.canvasCursor.y - glowSize * 0.5,
          glowSize,
          glowSize,
        );

        //Texture

        if (!displacement.texture) return;
        displacement.texture.needsUpdate = true;

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
