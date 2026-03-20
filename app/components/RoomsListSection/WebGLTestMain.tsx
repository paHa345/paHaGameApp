"use client";

import { height } from "@fortawesome/free-regular-svg-icons/faSave";
import { canvas } from "framer-motion/client";
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

const WebGLTestMain = () => {
  const GLCanvasRef = useRef(null) as any;

  // /** */
  // //Textures
  // /** */

  // const image = new Image();

  // const texture = new THREE.Texture(image);

  // image.onload = () => {
  //   texture.needsUpdate = true;
  // };

  // image.src = "/textures/Door_Wood_001_basecolor.jpg";

  const [sizes, setSizes] = useState({
    width: 800,
    height: 600,
  });

  const [cubeColor, setCubeColor] = useState({
    color: 0xff0000,
  });

  const [fullScreenSTatus, setFullScreenSTatus] = useState(1);

  // const sizes = {
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // };

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
    if (fullScreenSTatus === 0) {
      GLCanvasRef.current.requestFullscreen();
    }
    if (fullScreenSTatus === 1 && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullScreenSTatus]);

  // useEffect(() => {
  //   /**
  //    *
  //    *
  //    * debug
  //    */
  //   const gui = new GUI();

  //   // /** */
  //   // //Textures
  //   // /** */

  //   const loadingManager = new THREE.LoadingManager();

  //   loadingManager.onStart = () => {
  //     console.log("Start");
  //   };
  //   loadingManager.onLoad = () => {
  //     console.log("Load");
  //   };
  //   loadingManager.onProgress = () => {
  //     console.log("Progress");
  //   };
  //   loadingManager.onError = () => {
  //     console.log("Error");
  //   };

  //   const textureLoader = new THREE.TextureLoader(loadingManager);
  //   const colorTexture = textureLoader.load("/textures/3968513118.png");
  //   const alphaTexture = textureLoader.load("/textures/Door_Wood_001_opacity.jpg");
  //   const heightTexture = textureLoader.load("/textures/Door_Wood_001_height.png");
  //   const normalTexture = textureLoader.load("/textures/Door_Wood_001_normal.jpg");
  //   const ambientOcclusionTexture = textureLoader.load(
  //     "/textures/Door_Wood_001_ambientOcclusion.jpg",
  //   );
  //   const metalnessTexture = textureLoader.load("/textures/Door_Wood_001_metallic.jpg");
  //   const rougnessTexture = textureLoader.load("/textures/Door_Wood_001_roughness.jpg");

  //   // colorTexture.repeat.x = 2;
  //   // colorTexture.repeat.y = 3;
  //   // colorTexture.wrapS = THREE.RepeatWrapping;
  //   // colorTexture.wrapT = THREE.RepeatWrapping;
  //   // colorTexture.offset.x = 0.5;
  //   // colorTexture.offset.y = 0.5;
  //   // colorTexture.center.x = 0.5;
  //   // colorTexture.center.y = 0.5;
  //   // colorTexture.rotation = Math.PI / 4;

  //   colorTexture.generateMipmaps = false;
  //   colorTexture.minFilter = THREE.NearestFilter;
  //   colorTexture.magFilter = THREE.NearestFilter;

  //   /**
  //    *
  //    */
  //   if (typeof window !== "undefined") {
  //     const handleResize = () => {
  //       setSizes({
  //         width: window.innerWidth,
  //         height: window.innerHeight,
  //       });
  //       camera.aspect = sizes.width / sizes.height;
  //       camera.updateProjectionMatrix();

  //       renderer.setSize(sizes.width, sizes.height);
  //       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     };

  //     window.addEventListener("resize", handleResize);

  //     const scene = new THREE.Scene();

  //     //geometry

  //     // const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
  //     // const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
  //     // geometry.setAttribute("position", positionsAttribute);

  //     // const geometry = new THREE.BufferGeometry();

  //     // const count = 100;
  //     // const positionsArray = new Float32Array(count * 3 * 3);

  //     // for (let i = 0; i < count * 3 * 3; i++) {
  //     //   positionsArray[i] = Math.random() - 0.5;
  //     // }

  //     // const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
  //     // geometry.setAttribute("position", positionsAttribute);

  //     //red cube
  //     const geomentry = new THREE.BoxGeometry(1, 1, 1, 6, 6, 6);
  //     const material = new THREE.MeshBasicMaterial({
  //       map: colorTexture,
  //       // wireframe: true,
  //     });
  //     const mesh = new THREE.Mesh(geomentry, material);

  //     scene.add(mesh);

  //     const parameters = {
  //       spin: () => {
  //         gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
  //       },
  //     };

  //     //Debug

  //     gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Положение по Y");

  //     gui.add(mesh, "visible").name("Видимость");

  //     gui.add(material, "wireframe").name("Каркас");
  //     gui
  //       .addColor(material, "color")
  //       .name("Цвет")
  //       .onChange((value: any) => {
  //         setCubeColor({
  //           color: value,
  //         });
  //       });

  //     gui.add(parameters, "spin").name("Вращение");
  //     // mesh.position.set(0.7, -0.6, 1);

  //     //objects

  //     // const group = new THREE.Group();
  //     // scene.add(group);

  //     // const cube1 = new THREE.Mesh(
  //     //   new THREE.BoxGeometry(1, 1, 1),
  //     //   new THREE.MeshBasicMaterial({
  //     //     color: 0xff0000,
  //     //   })
  //     // );

  //     // group.add(cube1);
  //     // const cube2 = new THREE.Mesh(
  //     //   new THREE.BoxGeometry(1, 1, 1),
  //     //   new THREE.MeshBasicMaterial({
  //     //     color: 0x00ff00,
  //     //   })
  //     // );
  //     // cube2.position.x = -2;

  //     // group.add(cube2);

  //     // const cube3 = new THREE.Mesh(
  //     //   new THREE.BoxGeometry(1, 1, 1),
  //     //   new THREE.MeshBasicMaterial({
  //     //     color: 0x00ff00,
  //     //   })
  //     // );
  //     // cube3.position.x = 2;

  //     // group.add(cube3);

  //     // group.position.y = 1;
  //     // group.scale.y = 2;
  //     // group.rotation.y = 1;

  //     // scale
  //     // mesh.scale.x = 2;
  //     // mesh.scale.y = 0.5;
  //     // mesh.scale.z = 0.5;

  //     // mesh.scale.set(2, 0.5, 0.5);

  //     // //rotation

  //     // mesh.rotation.reorder("YXZ");
  //     // mesh.rotation.y = (Math.PI / 2) * 0.25;
  //     // mesh.rotation.x = (Math.PI / 2) * 0.25;

  //     //axis helper

  //     const axisHelper = new THREE.AxesHelper(1);
  //     scene.add(axisHelper);

  //     //sizes

  //     //camera

  //     const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

  //     // cameraRef.current = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  //     // const aspectRatio = sizes.width / sizes.height;
  //     // const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
  //     // camera.position.x = 2;
  //     // camera.position.y = 2;
  //     camera.position.z = 3;
  //     // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  //     // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  //     // camera.position.y = cursor.y * 5;
  //     camera.lookAt(mesh.position);

  //     scene.add(camera);

  //     //controls

  //     const controls = new OrbitControls(camera, GLCanvasRef.current);

  //     controls.enableDamping = true;

  //     //render

  //     const renderer = new THREE.WebGLRenderer({
  //       canvas: GLCanvasRef.current,
  //     });

  //     renderer.setSize(sizes.width, sizes.height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //     // renderer.render(scene, camera);

  //     //clock

  //     // const clock = new THREE.Clock();
  //     // timer.connect(canvas);
  //     //animations

  //     const tick = () => {
  //       // const elapsedTime = clock.getElapsedTime();
  //       //   console.log(elapsedTime);
  //       //update objects
  //       //   mesh.rotation.y = elapsedTime / 2;
  //       //   mesh.rotation.z = elapsedTime * Math.PI * 2;
  //       //   camera.position.y = Math.sin(elapsedTime);
  //       //   camera.position.x = Math.cos(elapsedTime);
  //       //   camera.lookAt(mesh.position);

  //       //update Controls

  //       controls.update();
  //       //render
  //       renderer.render(scene, camera);
  //       window.requestAnimationFrame(tick);
  //     };

  //     tick();

  //     // Cleanup
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleResize = () => {
  //       setSizes({
  //         width: window.innerWidth,
  //         height: window.innerHeight,
  //       });
  //       camera.aspect = sizes.width / sizes.height;
  //       camera.updateProjectionMatrix();

  //       renderer.setSize(sizes.width, sizes.height);
  //       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     };

  //     //   // /** */
  //     //   // //Base
  //     //   // /** */

  //     //   // /** */
  //     //   // //Debug
  //     //   // /** */

  //     const gui = new GUI();

  //     //   // /** */
  //     //   // //Textures
  //     //   // /** */

  //     const textureLoader = new THREE.TextureLoader();
  //     const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
  //     const alphaTexture = textureLoader.load("/textures/Door_Wood_001_opacity.jpg");
  //     const heightTexture = textureLoader.load("/textures/Door_Wood_001_height.png");
  //     const normalTexture = textureLoader.load("/textures/Door_Wood_001_normal.jpg");
  //     const ambientOcclusionTexture = textureLoader.load(
  //       "/textures/Door_Wood_001_ambientOcclusion.jpg",
  //     );
  //     const metalnessTexture = textureLoader.load("/textures/Door_Wood_001_metallic.jpg");
  //     const rougnessTexture = textureLoader.load("/textures/Door_Wood_001_roughness.jpg");

  //     const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
  //     const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
  //     gradientTexture.minFilter = THREE.NearestFilter;
  //     gradientTexture.magFilter = THREE.NearestFilter;

  //     const scene = new THREE.Scene();
  //     const loaderHDR = new HDRLoader();

  //     loaderHDR.loadAsync("/textures/environmentMap/2k.hdr").then(function (environmentMapTexture) {
  //       environmentMapTexture.mapping = THREE.EquirectangularReflectionMapping;
  //       scene.background = environmentMapTexture;
  //     });
  //     //   // /** */
  //     //   // //Lights
  //     //   // /** */

  //     const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  //     scene.add(ambientLight);

  //     const pointLight = new THREE.PointLight(0xffffff, 30);
  //     pointLight.position.x = 2;
  //     pointLight.position.y = 3;
  //     pointLight.position.z = 4;
  //     scene.add(pointLight);

  //     window.addEventListener("resize", handleResize);

  //     // const material = new THREE.MeshBasicMaterial();
  //     // material.map = doorColorTexture;
  //     // // material.color = new THREE.Color("green");
  //     // // material.wireframe = true;
  //     // material.transparent = true;
  //     // // material.opacity = 0.5;
  //     // material.alphaMap = alphaTexture;
  //     // material.side = THREE.DoubleSide;

  //     // const material = new THREE.MeshNormalMaterial();
  //     // material.flatShading = true;

  //     // const material = new THREE.MeshMatcapMaterial();
  //     // material.matcap = matcapTexture;

  //     // const material = new THREE.MeshDepthMaterial();

  //     // const material = new THREE.MeshLambertMaterial();
  //     // const material = new THREE.MeshPhongMaterial();
  //     // material.shininess = 1000;
  //     // material.specular = new THREE.Color("red");

  //     // const material = new THREE.MeshToonMaterial();
  //     // material.gradientMap = gradientTexture;

  //     // const material = new THREE.MeshStandardMaterial();
  //     // material.metalness = 0;
  //     // material.roughness = 1;
  //     // material.map = doorColorTexture;
  //     // material.aoMap = ambientOcclusionTexture;
  //     // material.aoMapIntensity = 1;
  //     // material.displacementMap = heightTexture;
  //     // material.displacementScale = 0.05;
  //     // material.metalnessMap = metalnessTexture;
  //     // material.roughnessMap = rougnessTexture;
  //     // material.normalMap = normalTexture;
  //     // material.normalScale.set(0.5, 0.5);
  //     // material.alphaMap = alphaTexture;
  //     // material.transparent = true;

  //     const material = new THREE.MeshStandardMaterial();
  //     material.metalness = 0.7;
  //     material.roughness = 0.2;
  //     // material.envMap = environmentMapTexture;

  //     gui.add(material, "metalness").min(0).max(1).step(0.0001);
  //     gui.add(material, "roughness").min(0).max(1).step(0.0001);
  //     gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
  //     gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

  //     const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);

  //     sphere.geometry.setAttribute(
  //       "uv2",
  //       new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2),
  //     );

  //     sphere.position.x = -1.5;

  //     const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

  //     plane.geometry.setAttribute(
  //       "uv2",
  //       new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2),
  //     );

  //     const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material);

  //     torus.geometry.setAttribute(
  //       "uv2",
  //       new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2),
  //     );

  //     torus.position.x = 1.5;

  //     scene.add(sphere, plane, torus);

  //     const axisHelper = new THREE.AxesHelper(1);
  //     scene.add(axisHelper);

  //     const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

  //     camera.position.z = 3;

  //     camera.lookAt(sphere.position);

  //     scene.add(camera);

  //     //controls

  //     const controls = new OrbitControls(camera, GLCanvasRef.current);

  //     controls.enableDamping = true;

  //     //render

  //     const renderer = new THREE.WebGLRenderer({
  //       canvas: GLCanvasRef.current,
  //     });

  //     renderer.setSize(sizes.width, sizes.height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //     const clock = new THREE.Clock();

  //     const tick = () => {
  //       const elapsedTime = clock.getElapsedTime();
  //       controls.update();

  //       // update objects

  //       sphere.rotation.y = 0.15 * elapsedTime;
  //       torus.rotation.y = 0.15 * elapsedTime;
  //       plane.rotation.y = 0.15 * elapsedTime;

  //       sphere.rotation.x = 0.15 * elapsedTime;
  //       torus.rotation.x = 0.15 * elapsedTime;
  //       plane.rotation.x = 0.15 * elapsedTime;

  //       //render
  //       renderer.render(scene, camera);
  //       window.requestAnimationFrame(tick);
  //     };

  //     tick();

  //     // Cleanup
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // });

  //3d text

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleResize = () => {
  //       setSizes({
  //         width: window.innerWidth,
  //         height: window.innerHeight,
  //       });
  //       camera.aspect = sizes.width / sizes.height;
  //       camera.updateProjectionMatrix();

  //       renderer.setSize(sizes.width, sizes.height);
  //       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     };

  //     //   // /** */
  //     //   // //Textures
  //     //   // /** */

  //     const textureLoader = new THREE.TextureLoader();
  //     const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

  //     //   // /** */
  //     //   // //Fonts
  //     //   // /** */

  //     const fontLoader = new FontLoader();
  //     const font = fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  //       const textGeomentry = new TextGeometry("AKA_9000", {
  //         font: font,
  //         size: 0.5,
  //         depth: 0.3,
  //         curveSegments: 5,
  //         bevelEnabled: true,
  //         bevelThickness: 0.03,
  //         bevelSegments: 4,
  //         bevelSize: 0.02,
  //         bevelOffset: 0,
  //       });

  //       textGeomentry.computeBoundingBox();

  //       // textGeomentry.translate(
  //       //   textGeomentry.boundingBox ? -(textGeomentry.boundingBox?.max?.x - 0.02) * 0.5 : 0,
  //       //   textGeomentry.boundingBox ? -(textGeomentry.boundingBox?.max?.y - 0.02) * 0.5 : 0,
  //       //   textGeomentry.boundingBox ? -(textGeomentry.boundingBox?.max?.z - 0.03) * 0.5 : 0,
  //       // );

  //       textGeomentry.center();

  //       const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  //       const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  //       // textMaterial.wireframe = true;
  //       const text = new THREE.Mesh(textGeomentry, material);
  //       scene.add(text);

  //       for (let i = 0; i < 100; i++) {
  //         const donut = new THREE.Mesh(donutGeometry, material);

  //         donut.position.x = (Math.random() - 0.5) * 10;
  //         donut.position.y = (Math.random() - 0.5) * 10;
  //         donut.position.z = (Math.random() - 0.5) * 10;

  //         donut.rotation.x = Math.random() * Math.PI;
  //         donut.rotation.y = Math.random() * Math.PI;

  //         const scale = Math.random();
  //         donut.scale.set(scale, scale, scale);

  //         scene.add(donut);
  //       }
  //     });

  //     //   // /** */
  //     //   // //Lights
  //     //   // /** */
  //     const scene = new THREE.Scene();

  //     const axesHelper = new THREE.AxesHelper();
  //     scene.add(axesHelper);
  //     const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  //     scene.add(ambientLight);

  //     const pointLight = new THREE.PointLight(0xffffff, 30);
  //     pointLight.position.x = 2;
  //     pointLight.position.y = 3;
  //     pointLight.position.z = 4;
  //     scene.add(pointLight);

  //     // const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());

  //     // scene.add(cube);

  //     const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

  //     camera.position.z = 3;

  //     // camera.lookAt(text.position);

  //     scene.add(camera);

  //     window.addEventListener("resize", handleResize);

  //     //render

  //     const renderer = new THREE.WebGLRenderer({
  //       canvas: GLCanvasRef.current,
  //     });

  //     renderer.setSize(sizes.width, sizes.height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //     //controls

  //     const controls = new OrbitControls(camera, GLCanvasRef.current);

  //     controls.enableDamping = true;

  //     const clock = new THREE.Clock();

  //     const tick = () => {
  //       const elapsedTime = clock.getElapsedTime();
  //       controls.update();

  //       // update objects

  //       //render
  //       renderer.render(scene, camera);
  //       window.requestAnimationFrame(tick);
  //     };

  //     tick();

  //     // Cleanup
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // });

  //light

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleResize = () => {
  //       setSizes({
  //         width: window.innerWidth,
  //         height: window.innerHeight,
  //       });
  //       camera.aspect = sizes.width / sizes.height;
  //       camera.updateProjectionMatrix();

  //       renderer.setSize(sizes.width, sizes.height);
  //       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     };

  //     const gui = new GUI();

  //     const scene = new THREE.Scene();

  //     /**
  //      * Lights
  //      */

  //     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  //     scene.add(ambientLight);
  //     gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);

  //     const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
  //     directionalLight.position.set(1, 0.25, 0);
  //     scene.add(directionalLight);
  //     gui.add(directionalLight, "intensity").min(0).max(1).step(0.01);

  //     const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x000fff, 0.5);
  //     scene.add(hemisphereLight);

  //     const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
  //     pointLight.position.set(1, -0.5, 1);
  //     scene.add(pointLight);

  //     const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
  //     rectAreaLight.position.set(-1.5, 0, 1.5);
  //     rectAreaLight.lookAt(new THREE.Vector3());
  //     scene.add(rectAreaLight);

  //     const spotLight = new THREE.SpotLight(0x78ff00, 0.9, 10, Math.PI * 0.1, 0.25, 1);
  //     spotLight.position.set(0, 1, 1);

  //     scene.add(spotLight);

  //     spotLight.target.position.x = -0.75;
  //     scene.add(spotLight.target);

  //     /**
  //      * Helpers
  //      */

  //     const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
  //     scene.add(hemisphereLightHelper);

  //     const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
  //     scene.add(directionalLightHelper);

  //     const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
  //     scene.add(pointLightHelper);

  //     const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  //     scene.add(spotLightHelper);

  //     const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
  //     scene.add(rectAreaLightHelper);

  //     /**
  //      * Objects
  //      */
  //     // Material

  //     const material = new THREE.MeshStandardMaterial();
  //     material.roughness = 0.4;

  //     // Objects

  //     // Objects
  //     const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
  //     sphere.position.x = -1.5;

  //     const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

  //     const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
  //     torus.position.x = 1.5;

  //     const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
  //     plane.rotation.x = -Math.PI * 0.5;
  //     plane.position.y = -0.65;

  //     scene.add(sphere, cube, torus, plane);

  //     const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

  //     camera.position.z = 3;

  //     camera.lookAt(cube.position);

  //     scene.add(camera);

  //     window.addEventListener("resize", handleResize);

  //     const axesHelper = new THREE.AxesHelper(1); // 5 — длина осей в единицах
  //     scene.add(axesHelper);

  //     //render

  //     const renderer = new THREE.WebGLRenderer({
  //       canvas: GLCanvasRef.current,
  //     });

  //     renderer.setSize(sizes.width, sizes.height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //     //controls

  //     const controls = new OrbitControls(camera, GLCanvasRef.current);

  //     controls.enableDamping = true;
  //     const timer = new THREE.Timer();

  //     const tick = () => {
  //       controls.update();
  //       timer.update();

  //       const elapsedTime = timer.getElapsed();
  //       // update objects

  //       sphere.rotation.y = 0.1 * elapsedTime;
  //       cube.rotation.y = 0.1 * elapsedTime;
  //       torus.rotation.y = 0.1 * elapsedTime;

  //       sphere.rotation.x = 0.15 * elapsedTime;
  //       cube.rotation.x = 0.15 * elapsedTime;
  //       torus.rotation.x = 0.15 * elapsedTime;

  //       //render
  //       renderer.render(scene, camera);
  //       window.requestAnimationFrame(tick);
  //     };

  //     tick();

  //     // Cleanup
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // });

  //shadows

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleResize = () => {
  //       setSizes({
  //         width: window.innerWidth,
  //         height: window.innerHeight,
  //       });
  //       camera.aspect = sizes.width / sizes.height;
  //       camera.updateProjectionMatrix();

  //       renderer.setSize(sizes.width, sizes.height);
  //       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     };

  //     const gui = new GUI();

  //     const scene = new THREE.Scene();

  //     //Textures

  //     const textureLoader = new THREE.TextureLoader();
  //     const bakedTexture = textureLoader.load("/textures/bakedShadow.jpg");
  //     const sipmleShadow = textureLoader.load("/textures/simpleShadow.jpg");

  //     /**
  //      * Lights
  //      */
  //     // Ambient light
  //     const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  //     gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
  //     scene.add(ambientLight);

  //     // Directional light
  //     const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  //     directionalLight.castShadow = false;

  //     directionalLight.shadow.mapSize.width = 1024;
  //     directionalLight.shadow.mapSize.height = 1024;

  //     directionalLight.shadow.camera.top = 2;
  //     directionalLight.shadow.camera.right = 2;
  //     directionalLight.shadow.camera.bottom = -2;
  //     directionalLight.shadow.camera.left = -2;
  //     directionalLight.shadow.camera.near = 1;
  //     directionalLight.shadow.camera.far = 6;
  //     directionalLight.shadow.radius = 10;

  //     const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  //     directionalLightCameraHelper.visible = false;
  //     scene.add(directionalLightCameraHelper);

  //     directionalLight.position.set(2, 2, -1);
  //     gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
  //     gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
  //     gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
  //     gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
  //     scene.add(directionalLight);

  //     //Spot light

  //     const spotLight = new THREE.SpotLight("red", 6, 10, Math.PI * 0.3);
  //     spotLight.castShadow = false;

  //     spotLight.shadow.mapSize.width = 1024;
  //     spotLight.shadow.mapSize.height = 1024;
  //     spotLight.shadow.camera.fov = 30;

  //     spotLight.shadow.camera.near = 1;
  //     spotLight.shadow.camera.far = 6;

  //     spotLight.position.set(0, 2, 2);
  //     scene.add(spotLight);
  //     scene.add(spotLight.target);

  //     const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  //     spotLightCameraHelper.visible = false;
  //     scene.add(spotLightCameraHelper);

  //     //pointLight

  //     const pointLight = new THREE.PointLight("blue", 6);
  //     pointLight.castShadow = false;
  //     pointLight.shadow.mapSize.width = 1024;
  //     pointLight.shadow.mapSize.height = 1024;
  //     pointLight.position.set(-1, 1, 0);
  //     pointLight.shadow.camera.near = 0.1;
  //     pointLight.shadow.camera.far = 5;

  //     scene.add(pointLight);

  //     const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
  //     pointLightCameraHelper.visible = false;
  //     scene.add(pointLightCameraHelper);

  //     /**
  //      * Materials
  //      */
  //     const material = new THREE.MeshStandardMaterial();
  //     material.roughness = 0.7;
  //     gui.add(material, "metalness").min(0).max(1).step(0.001);
  //     gui.add(material, "roughness").min(0).max(1).step(0.001);

  //     /**
  //      * Objects
  //      */
  //     const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

  //     sphere.castShadow = true;

  //     const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
  //     plane.rotation.x = -Math.PI * 0.5;
  //     plane.position.y = -0.5;
  //     plane.receiveShadow = true;

  //     const sphereShadow = new THREE.Mesh(
  //       new THREE.PlaneGeometry(1.5, 1.5),
  //       new THREE.MeshBasicMaterial({
  //         color: 0x000000,
  //         transparent: true,
  //         alphaMap: sipmleShadow,
  //       }),
  //     );
  //     sphereShadow.rotation.x = -Math.PI * 0.5;
  //     sphereShadow.position.y = plane.position.y + 0.01;
  //     scene.add(sphereShadow);

  //     scene.add(sphere, plane);

  //     const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

  //     camera.position.x = 1;
  //     camera.position.y = 1;
  //     camera.position.z = 2;

  //     scene.add(camera);

  //     window.addEventListener("resize", handleResize);

  //     const axesHelper = new THREE.AxesHelper(1); // 5 — длина осей в единицах
  //     scene.add(axesHelper);

  //     //render

  //     const renderer = new THREE.WebGLRenderer({
  //       canvas: GLCanvasRef.current,
  //     });

  //     renderer.setSize(sizes.width, sizes.height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //     renderer.shadowMap.enabled = true;
  //     renderer.shadowMap.type = THREE.PCFShadowMap;

  //     //controls

  //     const controls = new OrbitControls(camera, GLCanvasRef.current);

  //     controls.enableDamping = true;
  //     const timer = new THREE.Timer();

  //     const tick = () => {
  //       controls.update();
  //       timer.update();

  //       const elapsedTime = timer.getElapsed();
  //       // update the sphere

  //       sphere.position.x = Math.cos(elapsedTime) * 1.5;
  //       sphere.position.z = Math.sin(elapsedTime) * 1.5;
  //       sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  //       sphereShadow.position.x = sphere.position.x;
  //       sphereShadow.position.z = sphere.position.z;
  //       sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  //       //render
  //       renderer.render(scene, camera);
  //       window.requestAnimationFrame(tick);
  //     };

  //     tick();

  //     // Cleanup
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // });

  //house

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleResize = () => {
  //       setSizes({
  //         width: window.innerWidth,
  //         height: window.innerHeight,
  //       });
  //       camera.aspect = sizes.width / sizes.height;
  //       camera.updateProjectionMatrix();

  //       renderer.setSize(sizes.width, sizes.height);
  //       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     };

  //     const gui = new GUI();

  //     const scene = new THREE.Scene();

  //     /**
  //      * Textures
  //      */
  //     const textureLoader = new THREE.TextureLoader();

  //     const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
  //     const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
  //     const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
  //     const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
  //     const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
  //     const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
  //     const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

  //     const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
  //     const bricksAmbientOcclusionTexture = textureLoader.load(
  //       "/textures/bricks/ambientOcclusion.jpg",
  //     );
  //     const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
  //     const bricksRoughnessTexture = textureLoader.load("/textures/bricks/roughness.jpg");

  //     const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
  //     const grassAmbientOcclusionTexture = textureLoader.load(
  //       "/textures/grass/ambientOcclusion.jpg",
  //     );
  //     const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
  //     const grassRoughnessTexture = textureLoader.load("/textures/grass/roughness.jpg");

  //     grassColorTexture.repeat.set(8, 8);
  //     grassAmbientOcclusionTexture.repeat.set(8, 8);
  //     grassNormalTexture.repeat.set(8, 8);
  //     grassRoughnessTexture.repeat.set(8, 8);

  //     grassColorTexture.wrapS = THREE.RepeatWrapping;
  //     grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  //     grassNormalTexture.wrapS = THREE.RepeatWrapping;
  //     grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
  //     grassColorTexture.wrapT = THREE.RepeatWrapping;
  //     grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  //     grassNormalTexture.wrapT = THREE.RepeatWrapping;
  //     grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

  //     //fog

  //     const fog = new THREE.Fog("#262837", 1, 15);

  //     scene.fog = fog;
  //     /**
  //      * House
  //      */

  //     //group
  //     const house = new THREE.Group();

  //     scene.add(house);

  //     //walls

  //     const walls = new THREE.Mesh(
  //       new THREE.BoxGeometry(4, 2.5, 4),
  //       new THREE.MeshStandardMaterial({
  //         map: bricksColorTexture,
  //         aoMap: bricksAmbientOcclusionTexture,
  //         normalMap: bricksNormalTexture,
  //         roughnessMap: bricksRoughnessTexture,
  //       }),
  //     );

  //     walls.geometry.setAttribute(
  //       "uv2",
  //       new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2),
  //     );
  //     walls.position.y = 2.5 / 2;
  //     house.add(walls);

  //     //roof
  //     const roof = new THREE.Mesh(
  //       new THREE.ConeGeometry(3.5, 1, 4),
  //       new THREE.MeshStandardMaterial({ color: "#b35f45" }),
  //     );

  //     //door

  //     const door = new THREE.Mesh(
  //       new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  //       new THREE.MeshStandardMaterial({
  //         map: doorColorTexture,
  //         transparent: true,
  //         alphaMap: doorAlphaTexture,
  //         aoMap: doorAmbientOcclusionTexture,
  //         displacementMap: doorHeightTexture,
  //         displacementScale: 0.1,
  //         normalMap: doorNormalTexture,
  //         metalnessMap: doorMetalnessTexture,
  //         roughnessMap: doorRoughnessTexture,
  //       }),
  //     );
  //     door.geometry.setAttribute(
  //       "uv2",
  //       new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
  //     );
  //     door.position.y = 1;
  //     door.position.z = 4 / 2 + 0.01;
  //     house.add(door);

  //     roof.position.y = 2.5 + 0.5;
  //     roof.rotation.y = Math.PI * 0.25;
  //     house.add(roof);

  //     //bushes

  //     const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
  //     const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

  //     const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  //     bush1.scale.set(0.5, 0.5, 0.5);
  //     bush1.position.set(0.8, 0.2, 2.2);

  //     const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  //     bush2.scale.set(0.25, 0.25, 0.25);
  //     bush2.position.set(1.4, 0.1, 2.1);

  //     const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  //     bush3.scale.set(0.4, 0.4, 0.4);
  //     bush3.position.set(-0.8, 0.1, 2.2);

  //     const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
  //     bush4.scale.set(0.15, 0.15, 0.15);
  //     bush4.position.set(-1, 0.05, 2.6);
  //     house.add(bush1, bush2, bush3, bush4);

  //     //graves

  //     const graves = new THREE.Group();
  //     scene.add(graves);

  //     const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  //     const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

  //     for (let i = 0; i < 50; i++) {
  //       const angle = Math.random() * Math.PI * 2;
  //       const radius = 3 + Math.random() * 6;
  //       const x = Math.sin(angle) * radius;
  //       const z = Math.cos(angle) * radius;

  //       const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  //       grave.position.set(x, 0.3, z);
  //       grave.rotation.y = (Math.random() - 0.5) * 0.4;
  //       grave.rotation.z = (Math.random() - 0.5) * 0.4;
  //       grave.castShadow = true;
  //       graves.add(grave);
  //     }

  //     // Floor
  //     const floor = new THREE.Mesh(
  //       new THREE.PlaneGeometry(20, 20),
  //       new THREE.MeshStandardMaterial({
  //         map: grassColorTexture,
  //         aoMap: grassAmbientOcclusionTexture,
  //         normalMap: grassNormalTexture,
  //         roughnessMap: grassRoughnessTexture,
  //       }),
  //     );

  //     floor.geometry.setAttribute(
  //       "uv2",
  //       new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2),
  //     );
  //     floor.rotation.x = -Math.PI * 0.5;
  //     floor.position.y = 0;
  //     scene.add(floor);

  //     /**
  //      * Lights
  //      */
  //     // Ambient light
  //     const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
  //     gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
  //     scene.add(ambientLight);

  //     // Directional light
  //     const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
  //     moonLight.position.set(4, 5, -2);
  //     gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
  //     gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
  //     gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
  //     gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
  //     scene.add(moonLight);

  //     const doorLight = new THREE.PointLight("#ff7b46", 1, 7);

  //     doorLight.position.set(0, 2.2, 2.7);

  //     house.add(doorLight);

  //     /**
  //      * Ghosts
  //      */

  //     const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
  //     scene.add(ghost1);
  //     const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
  //     scene.add(ghost2);
  //     const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
  //     scene.add(ghost3);

  //     window.addEventListener("resize", handleResize);

  //     const axesHelper = new THREE.AxesHelper(1);
  //     scene.add(axesHelper);

  //     /**
  //      * Camera
  //      */
  //     // Base camera
  //     const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  //     camera.position.x = 4;
  //     camera.position.y = 2;
  //     camera.position.z = 5;
  //     scene.add(camera);

  //     // Controls
  //     const controls = new OrbitControls(camera, GLCanvasRef.current);
  //     controls.enableDamping = true;

  //     /**
  //      * Renderer
  //      */
  //     const renderer = new THREE.WebGLRenderer({
  //       canvas: GLCanvasRef.current,
  //     });
  //     renderer.setSize(sizes.width, sizes.height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     renderer.setClearColor("#262837");

  //     /**
  //      * Shadows
  //      */

  //     moonLight.castShadow = true;
  //     doorLight.castShadow = true;
  //     ghost1.castShadow = true;
  //     ghost2.castShadow = true;
  //     ghost3.castShadow = true;

  //     walls.castShadow = true;

  //     bush1.castShadow = true;
  //     bush2.castShadow = true;
  //     bush3.castShadow = true;
  //     bush4.castShadow = true;
  //     floor.receiveShadow = true;

  //     renderer.shadowMap.enabled = true;
  //     renderer.shadowMap.type = THREE.PCFShadowMap;

  //     doorLight.shadow.mapSize.width = 256;
  //     doorLight.shadow.mapSize.height = 256;
  //     doorLight.shadow.camera.far = 7;

  //     ghost1.shadow.mapSize.width = 256;
  //     ghost1.shadow.mapSize.height = 256;
  //     ghost1.shadow.camera.far = 7;

  //     ghost2.shadow.mapSize.width = 256;
  //     ghost2.shadow.mapSize.height = 256;
  //     ghost2.shadow.camera.far = 7;

  //     ghost3.shadow.mapSize.width = 256;
  //     ghost3.shadow.mapSize.height = 256;
  //     ghost3.shadow.camera.far = 7;

  //     const timer = new THREE.Timer();

  //     const tick = () => {
  //       controls.update();
  //       timer.update();

  //       const elapsedTime = timer.getElapsed();
  //       // update the ghost position

  //       const ghost1Angle = elapsedTime * 0.5;

  //       ghost1.position.x = Math.cos(ghost1Angle) * 4;
  //       ghost1.position.z = Math.sin(ghost1Angle) * 4;
  //       ghost1.position.y = Math.sin(elapsedTime * 3);

  //       const ghost2Angle = -elapsedTime * 0.32;

  //       ghost2.position.x = Math.cos(ghost2Angle) * 5;
  //       ghost2.position.z = Math.sin(ghost2Angle) * 5;
  //       ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  //       const ghost3Angle = -elapsedTime * 0.18;

  //       ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  //       ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  //       ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);
  //       //render
  //       renderer.render(scene, camera);
  //       window.requestAnimationFrame(tick);
  //     };

  //     tick();

  //     // Cleanup
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // });

  //particles

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleResize = () => {
  //       setSizes({
  //         width: window.innerWidth,
  //         height: window.innerHeight,
  //       });
  //       camera.aspect = sizes.width / sizes.height;
  //       camera.updateProjectionMatrix();

  //       renderer.setSize(sizes.width, sizes.height);
  //       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     };

  //     const gui = new GUI();

  //     const scene = new THREE.Scene();

  //     /**
  //      * Textures
  //      */
  //     const textureLoader = new THREE.TextureLoader();

  //     const particleTexture = textureLoader.load("/textures/particles/2.png");

  //     /**
  //      * Particles
  //      */

  //     const particlesGeomentry = new THREE.BufferGeometry();
  //     const count = 500;

  //     const positions = new Float32Array(count * 3);
  //     const colors = new Float32Array(count * 3);

  //     for (let i = 0; i < count * 3; i++) {
  //       positions[i] = (Math.random() - 0.5) * 10;
  //       colors[i] = Math.random();
  //     }

  //     particlesGeomentry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  //     particlesGeomentry.setAttribute("color", new THREE.BufferAttribute(positions, 3));

  //     const particlesMaterial = new THREE.PointsMaterial();
  //     particlesMaterial.size = 0.1;
  //     particlesMaterial.transparent = true;
  //     particlesMaterial.alphaMap = particleTexture;
  //     particlesMaterial.sizeAttenuation = true;
  //     particlesMaterial.color = new THREE.Color("#ff88cc");
  //     // particlesMaterial.alphaTest = 0.001;
  //     // particlesMaterial.depthTest = false;
  //     particlesMaterial.depthWrite = false;
  //     // particlesMaterial.blending = THREE.AdditiveBlending;
  //     particlesMaterial.vertexColors = true;

  //     const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());

  //     scene.add(cube);
  //     //Points

  //     const particles = new THREE.Points(particlesGeomentry, particlesMaterial);

  //     scene.add(particles);

  //     /**
  //      * Camera
  //      */
  //     // Base camera
  //     const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  //     camera.position.z = 3;
  //     scene.add(camera);

  //     // Controls
  //     const controls = new OrbitControls(camera, GLCanvasRef.current);
  //     controls.enableDamping = true;

  //     /**
  //      * Renderer
  //      */
  //     const renderer = new THREE.WebGLRenderer({
  //       canvas: GLCanvasRef.current,
  //     });
  //     renderer.setSize(sizes.width, sizes.height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     renderer.setClearColor("#262837");

  //     const timer = new THREE.Timer();

  //     const tick = () => {
  //       controls.update();
  //       timer.update();

  //       const elapsedTime = timer.getElapsed();
  //       // update the particles

  //       for (let i = 0; i < count; i++) {
  //         const i3 = i * 3;
  //         const x = particlesGeomentry.attributes.position.array[i3];
  //         particlesGeomentry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
  //       }

  //       particlesGeomentry.attributes.position.needsUpdate = true;
  //       // particles.rotation.y = elapsedTime * 0.2;

  //       //render
  //       renderer.render(scene, camera);
  //       window.requestAnimationFrame(tick);
  //     };

  //     tick();

  //     // Cleanup
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // });

  //Galaxy generator

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setSizes({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      const gui = new GUI({ width: 300 });

      const scene = new THREE.Scene();

      /**
       * Textures
       */
      const textureLoader = new THREE.TextureLoader();

      /**
       * Galaxy
       */

      const parameters: {
        count: number;
        size: number;
        radius: number;
        branches: number;
        spin: number;
        randomness: number;
        randomnessPower: number;
        insideColor: string;
        outsideColor: string;
      } = {
        count: 0,
        size: 0.01,
        radius: 1,
        branches: 2,
        spin: 1,
        randomness: 0.2,
        randomnessPower: 3,
        insideColor: "#ff6030",
        outsideColor: "#1b3984",
      };

      parameters.count = 100000;
      parameters.size = 0.01;
      parameters.radius = 5;
      parameters.branches = 3;
      parameters.spin = 1;
      parameters.randomness = 0.2;
      parameters.randomnessPower = 3;

      let particlsGeometry: THREE.BufferGeometry<
        THREE.NormalBufferAttributes,
        THREE.BufferGeometryEventMap
      > | null = null;
      let particlesMaterial: THREE.PointsMaterial | null = null;
      let points: THREE.Points<
        THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>,
        THREE.PointsMaterial,
        THREE.Object3DEventMap
      > | null = null;

      const generateGalaxy = () => {
        if (points !== null) {
          particlsGeometry?.dispose();
          particlesMaterial?.dispose();
          scene.remove(points);
        }
        /**
         * Geometry
         */
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        particlsGeometry = new THREE.BufferGeometry();

        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        for (let i = 0; i < parameters.count; i++) {
          const i3 = i * 3;
          //position
          const radius = Math.random() * parameters.radius;
          const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
          const spinAngle = radius * parameters.spin;

          const randomX =
            Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
          const randomY =
            Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
          const randomZ =
            Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

          positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
          positions[i3 + 1] = randomY;
          positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

          //color

          const mixedColor = colorInside.clone();
          mixedColor.lerp(colorOutside, radius / parameters.radius);
          colors[i3] = mixedColor.r;
          colors[i3 + 1] = mixedColor.g;
          colors[i3 + 2] = mixedColor.b;
        }
        particlsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        particlsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        /**
         * Material
         */

        particlesMaterial = new THREE.PointsMaterial({
          size: parameters.size,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true,
        });

        points = new THREE.Points(particlsGeometry, particlesMaterial);
        scene.add(points);
      };

      generateGalaxy();

      gui.add(parameters, "count").min(100).max(100000).step(100).onFinishChange(generateGalaxy);
      gui.add(parameters, "size").min(0.01).max(0.1).step(0.001).onFinishChange(generateGalaxy);
      gui.add(parameters, "radius").min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
      gui.add(parameters, "branches").min(2).max(20).step(1).onFinishChange(generateGalaxy);
      gui.add(parameters, "spin").min(-5).max(5).step(0.01).onFinishChange(generateGalaxy);
      gui.add(parameters, "randomness").min(0).max(2).step(0.01).onFinishChange(generateGalaxy);
      gui
        .add(parameters, "randomnessPower")
        .min(1)
        .max(10)
        .step(0.01)
        .onFinishChange(generateGalaxy);
      gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
      gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
      camera.position.z = 3;
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, GLCanvasRef.current);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: GLCanvasRef.current,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor("#262837");

      const timer = new THREE.Timer();

      const tick = () => {
        controls.update();
        timer.update();

        const elapsedTime = timer.getElapsed();
        // update the particles

        //render
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
      };

      tick();

      // Cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  });

  //scroll based animation

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleResize = () => {
  //       setSizes({
  //         width: window.innerWidth,
  //         height: window.innerHeight,
  //       });
  //       camera.aspect = sizes.width / sizes.height;
  //       camera.updateProjectionMatrix();

  //       renderer.setSize(sizes.width, sizes.height);
  //       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     };

  //     const gui = new GUI({ width: 300 });

  //     const parameters = {
  //       materialColor: "#ffeded",
  //     };

  //     gui.addColor(parameters, "materialColor");

  //     const scene = new THREE.Scene();

  //     /**
  //      * Textures
  //      */
  //     const textureLoader = new THREE.TextureLoader();

  //     /**
  //      * Test cube
  //      */
  //     const cube = new THREE.Mesh(
  //       new THREE.BoxGeometry(1, 1, 1),
  //       new THREE.MeshBasicMaterial({ color: "#ff0000" }),
  //     );
  //     scene.add(cube);
  //     /**
  //      * Camera
  //      */
  //     // Base camera
  //     const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  //     camera.position.z = 3;
  //     scene.add(camera);

  //     // Controls
  //     // const controls = new OrbitControls(camera, GLCanvasRef.current);
  //     // controls.enableDamping = true;

  //     /**
  //      * Renderer
  //      */
  //     const renderer = new THREE.WebGLRenderer({
  //       canvas: GLCanvasRef.current,
  //     });
  //     renderer.setSize(sizes.width, sizes.height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //     renderer.setClearColor("#262837");

  //     const timer = new THREE.Timer();

  //     const tick = () => {
  //       // controls.update();
  //       timer.update();

  //       const elapsedTime = timer.getElapsed();
  //       // update the particles

  //       //render
  //       renderer.render(scene, camera);
  //       window.requestAnimationFrame(tick);
  //     };

  //     tick();

  //     // Cleanup
  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // });

  return (
    <>
      <div className=" relative">
        <canvas
          className="webgl fixed top-0 left-0 z-10"
          onDoubleClick={doubleClickHandler}
          ref={GLCanvasRef}
        ></canvas>

        <div className=" text-slate-300 z-20 absolute text-[7vmin] pt-20">
          <section className="section h-[100vh]">
            <h1>My Portfolio</h1>
          </section>
          <section className="section h-[100vh]">
            <h2>My projects</h2>
          </section>
          <section className="section h-[100vh]">
            <h2>Contact me</h2>
          </section>
        </div>
      </div>
      {/* 
      <canvas ref={GLCanvasRef} width={300} height={300}>
        <code>&lt;canvas&gt;</code> element.
      </canvas> */}
    </>
  );
};

export default WebGLTestMain;
