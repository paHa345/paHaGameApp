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
// import waterVertexShader from "./shaders/water/vertex.glsl";
// import waterFragmentShader from "./shaders/water/fragment.glsl";
// import galaxyVertexShader from "./shaders/galaxy/vertex.glsl";
// import galaxyFragmentShader from "./shaders/galaxy/fragment.glsl";

// import cofeeSmokeVertexShader from "./shaders/cofeeSmoke/vertex.glsl";
// import cofeeSmokeFragmentShader from "./shaders/cofeeSmoke/fragment.glsl";

// import holographicVertexShader from "./shaders/holographic/vertex.glsl";
// import holographicFragmentShader from "./shaders/holographic/fragment.glsl";
import fireworkVertexShader from "./shaders/firework/vertex.glsl";
import fireworkFragmentShader from "./shaders/firework/fragment.glsl";
import Sizes from "./Experience/Utils/Sizes";
import { Sky } from "three/addons/objects/Sky.js";

const WebGLTestMain = () => {
  const GLCanvasRef = useRef<HTMLCanvasElement>(null);

  const [sizes, setSizes] = useState({
    width: 800,
    height: 600,
    resolution: new THREE.Vector2(800, 600),
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  });

  const [cubeColor, setCubeColor] = useState({
    color: 0xff0000,
  });

  const [fullScreenSTatus, setFullScreenSTatus] = useState(1);

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

      // setSizes({
      //   width: 800,
      //   height: 600,
      //   resolution: new THREE.Vector2(
      //     sizes.width * sizes.pixelRatio,
      //     sizes.height * sizes.pixelRatio,
      //   ),
      //   pixelRatio: Math.min(window.devicePixelRatio, 2),
      // });

      // const sizes = {
      //   width: window.innerWidth,
      //   height: window.innerHeight,
      //   resolution: new THREE.Vector2(0, 0),
      // };

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
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
      camera.position.set(1.5, 0, 6);
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

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);

      /**
       * Textures
       */

      const textures = [
        textureLoader.load("./particles/1.png"),
        textureLoader.load("./particles/2.png"),
        textureLoader.load("./particles/3.png"),
        textureLoader.load("./particles/4.png"),
        textureLoader.load("./particles/5.png"),
        textureLoader.load("./particles/6.png"),
        textureLoader.load("./particles/7.png"),
        textureLoader.load("./particles/8.png"),
      ];

      /**
       * Fireworks
       */

      const createFirework = (
        count: number,
        position: THREE.Vector3,
        size: number,
        texture: THREE.Texture<HTMLImageElement>,
        radius: number,
        color: THREE.Color,
      ) => {
        // Geomentry

        const positionsArray = new Float32Array(count * 3);
        const sizesArray = new Float32Array(count);
        const timeMultipliersArray = new Float32Array(count);

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;

          const spherical = new THREE.Spherical(
            radius * (0.75 + Math.random() * 0.25),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2,
          );

          const position = new THREE.Vector3();
          position.setFromSpherical(spherical);

          positionsArray[i3] = position.x;
          positionsArray[i3 + 1] = position.y;
          positionsArray[i3 + 2] = position.z;

          sizesArray[i] = Math.random();
          timeMultipliersArray[i] = 1 + Math.random();
        }

        const geomentry = new THREE.BufferGeometry();
        geomentry.setAttribute("position", new THREE.Float32BufferAttribute(positionsArray, 3));
        geomentry.setAttribute("aSize", new THREE.Float32BufferAttribute(positionsArray, 1));
        geomentry.setAttribute(
          "aTimeMultiplier",
          new THREE.Float32BufferAttribute(timeMultipliersArray, 1),
        );

        // Material

        texture.flipY = false;

        const material = new THREE.ShaderMaterial({
          vertexShader: fireworkVertexShader,
          fragmentShader: fireworkFragmentShader,
          uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution),
            uTexture: new THREE.Uniform(texture),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0),
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        // Points

        const firework = new THREE.Points(geomentry, material);
        firework.position.copy(position);

        scene.add(firework);

        // Destroy

        const destroy = () => {
          scene.remove(firework);
          geomentry.dispose();
          material.dispose();
        };

        // Animate

        gsap.to(material.uniforms.uProgress, {
          value: 1,
          duration: 3,
          ease: "linear",
          onComplete: destroy,
        });
      };

      const createRandomFirework = () => {
        const count = Math.round(400 + Math.random() * 1000);
        const position = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          Math.random(),
          (Math.random() - 0.5) * 2,
        );
        const size = 0.1 + Math.random() * 0.1;
        const texure = textures[Math.floor(Math.random() * textures.length)];
        const radius = 0.5 + Math.random();
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, 0.7);

        createFirework(count, position, size, texure, radius, color);
      };

      window.addEventListener("click", createRandomFirework);

      createRandomFirework();

      /**
       * Sky
       */

      // Add Sky

      const sky = new Sky();
      sky.scale.setScalar(450000);
      scene.add(sky);

      const sun = new THREE.Vector3();

      /// GUI

      const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.95,
        elevation: -2.2,
        azimuth: 180,
        exposure: renderer.toneMappingExposure,
        cloudCoverage: 0.4,
        cloudDensity: 0.4,
        cloudElevation: 0.5,
        showSunDisc: true,
      };

      function guiChanged() {
        const uniforms = sky.material.uniforms;
        uniforms["turbidity"].value = effectController.turbidity;
        uniforms["rayleigh"].value = effectController.rayleigh;
        uniforms["mieCoefficient"].value = effectController.mieCoefficient;
        uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;
        uniforms["cloudCoverage"].value = effectController.cloudCoverage;
        uniforms["cloudDensity"].value = effectController.cloudDensity;
        uniforms["cloudElevation"].value = effectController.cloudElevation;
        // uniforms["showSunDisc"].value = effectController.showSunDisc;

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
        const theta = THREE.MathUtils.degToRad(effectController.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        uniforms["sunPosition"].value.copy(sun);

        renderer.toneMappingExposure = effectController.exposure;
      }

      gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange(guiChanged);
      gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
      gui.add(effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(guiChanged);
      gui.add(effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(guiChanged);
      gui.add(effectController, "elevation", -3, 90, 0.01).onChange(guiChanged);
      gui.add(effectController, "azimuth", -180, 180, 0.1).onChange(guiChanged);
      gui.add(effectController, "exposure", 0, 1, 0.0001).onChange(guiChanged);
      gui.add(effectController, "showSunDisc").onChange(guiChanged);

      const folderClouds = gui.addFolder("Clouds");
      folderClouds
        .add(effectController, "cloudCoverage", 0, 1, 0.01)
        .name("coverage")
        .onChange(guiChanged);
      folderClouds
        .add(effectController, "cloudDensity", 0, 1, 0.01)
        .name("density")
        .onChange(guiChanged);
      folderClouds
        .add(effectController, "cloudElevation", 0, 1, 0.01)
        .name("elevation")
        .onChange(guiChanged);

      guiChanged();

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
