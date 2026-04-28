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

import earthVertexShader from "./shaders/earth/vertex.glsl";
import earthFragmentShader from "./shaders/earth/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";

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

      /**
       * Earth
       */

      const earthParameters = {
        atmosphereDayColor: "#00aaff",
        atmosphereTwighlightColor: "#ff6600",
      };

      gui.addColor(earthParameters, "atmosphereDayColor").onChange(() => {
        earthMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor);
        atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
          earthParameters.atmosphereDayColor,
        );
      });
      gui.addColor(earthParameters, "atmosphereTwighlightColor").onChange(() => {
        earthMaterial.uniforms.uAtmosphereTwighlightColor.value.set(
          earthParameters.atmosphereTwighlightColor,
        );
        atmosphereMaterial.uniforms.uAtmosphereTwighlightColor.value.set(
          earthParameters.atmosphereTwighlightColor,
        );
      });

      // Textures

      const earthDayTexture = textureLoader.load("./earth/day.jpg");
      earthDayTexture.colorSpace = THREE.SRGBColorSpace;
      earthDayTexture.anisotropy = 8;

      const earthNightTexture = textureLoader.load("./earth/night.jpg");
      earthNightTexture.colorSpace = THREE.SRGBColorSpace;
      earthNightTexture.anisotropy = 8;

      const earthSpecularCloudsTexture = textureLoader.load("./earth/specularClouds.jpg");
      earthSpecularCloudsTexture.colorSpace = THREE.SRGBColorSpace;
      earthSpecularCloudsTexture.anisotropy = 8;

      // Mesh
      const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
      const earthMaterial = new THREE.ShaderMaterial({
        vertexShader: earthVertexShader,
        fragmentShader: earthFragmentShader,
        uniforms: {
          uDayTexture: new THREE.Uniform(earthDayTexture),
          uNightTexture: new THREE.Uniform(earthNightTexture),
          uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
          uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
          uAtmosphereDayColor: new THREE.Uniform(
            new THREE.Color(earthParameters.atmosphereDayColor),
          ),
          uAtmosphereTwighlightColor: new THREE.Uniform(
            new THREE.Color(earthParameters.atmosphereTwighlightColor),
          ),
        },
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      scene.add(earth);

      // Atmosphere

      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        uniforms: {
          uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
          uAtmosphereDayColor: new THREE.Uniform(
            new THREE.Color(earthParameters.atmosphereDayColor),
          ),
          uAtmosphereTwighlightColor: new THREE.Uniform(
            new THREE.Color(earthParameters.atmosphereTwighlightColor),
          ),
        },
        side: THREE.BackSide,
        transparent: true,
      });
      const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
      atmosphere.scale.set(1.04, 1.04, 1.04);

      scene.add(atmosphere);

      /**
       * Sun
       */

      const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
      const sunDirection = new THREE.Vector3();

      // Debug
      const debugSun = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.1, 2),
        new THREE.MeshBasicMaterial(),
      );

      scene.add(debugSun);

      // Update

      const updateSun = () => {
        //Sun direction
        sunDirection.setFromSpherical(sunSpherical);

        //Debug
        debugSun.position.copy(sunDirection).multiplyScalar(5);

        //Uniforms
        earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
        atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
      };

      updateSun();

      // Tweaks

      gui.add(sunSpherical, "phi").min(0).max(Math.PI).onChange(updateSun);
      gui.add(sunSpherical, "theta").min(-Math.PI).max(Math.PI).onChange(updateSun);

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
      camera.position.x = 12;
      camera.position.y = 5;
      camera.position.z = 4;

      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, GLCanvasRef.current);
      controls.enableDamping = true;

      /**
       * Renderer
       */

      const rendererParameters = {
        clearColor: "#26132f",
      };

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
      renderer.setClearColor("#000011");

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

        earth.rotation.y = elapsedTime * 0.1;

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
