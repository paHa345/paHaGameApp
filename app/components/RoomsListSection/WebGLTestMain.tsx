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

import halftoneVertexShader from "./shaders/halftone/vertex.glsl";
import halftoneFragmentShader from "./shaders/halftone/fragment.glsl";

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

      // // Axes helper

      // const axesHelper = new THREE.AxesHelper();
      // axesHelper.position.y += 0.25;
      // scene.add(axesHelper);

      // Loaders
      const textureLoader = new THREE.TextureLoader();
      const gltfLoader = new GLTFLoader();

      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Update materials
        material.uniforms.uResolution.value.set(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio,
        );

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
      camera.position.x = 7;
      camera.position.y = 7;
      camera.position.z = 7;

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
      renderer.setClearColor(rendererParameters.clearColor);
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);

      /**
       * Material
       */
      const materialParameters = {
        color: "#ff794d",
        shadeColor: "#ff794d",
        shadowColor: "#8e19b8",
        lightColor: "#e5ffe0",
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: halftoneVertexShader,
        fragmentShader: halftoneFragmentShader,
        uniforms: {
          uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
          uShadeColor: new THREE.Uniform(new THREE.Color(materialParameters.shadeColor)),
          uResolution: new THREE.Uniform(
            new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio),
          ),
          uShadowRepetitions: new THREE.Uniform(100),
          uShadowColor: new THREE.Uniform(new THREE.Color(materialParameters.shadowColor)),
          uLightRepetitions: new THREE.Uniform(130),
          uLightColor: new THREE.Uniform(new THREE.Color(materialParameters.lightColor)),
        },
      });

      gui.addColor(materialParameters, "color").onChange(() => {
        material.uniforms.uColor.value.set(materialParameters.color);
      });

      gui.add(material.uniforms.uShadowRepetitions, "value").min(1).max(300).step(1);

      gui.addColor(materialParameters, "shadowColor").onChange(() => {
        material.uniforms.uShadowColor.value.set(materialParameters.shadowColor);
      });
      gui.add(material.uniforms.uLightRepetitions, "value").min(1).max(300).step(1);

      gui.addColor(materialParameters, "lightColor").onChange(() => {
        material.uniforms.uLightColor.value.set(materialParameters.lightColor);
      });

      /**
       * Objects
       */
      // Torus knot
      const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32), material);
      torusKnot.position.x = 3;
      scene.add(torusKnot);

      // Sphere
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
      sphere.position.x = -3;
      scene.add(sphere);

      // Suzanne
      let suzanne: any = null;
      gltfLoader.load("./suzanne.glb", (gltf) => {
        suzanne = gltf.scene;
        suzanne.traverse((child: any) => {
          if (child.isMesh) child.material = material;
        });
        scene.add(suzanne);
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

        // Rotate objects
        if (suzanne) {
          suzanne.rotation.x = -elapsedTime * 0.1;
          suzanne.rotation.y = elapsedTime * 0.2;
        }

        sphere.rotation.x = -elapsedTime * 0.1;
        sphere.rotation.y = elapsedTime * 0.2;

        torusKnot.rotation.x = -elapsedTime * 0.1;
        torusKnot.rotation.y = elapsedTime * 0.2;

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
