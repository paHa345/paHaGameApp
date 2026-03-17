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

      //   // /** */
      //   // //Textures
      //   // /** */

      const textureLoader = new THREE.TextureLoader();
      const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

      //   // /** */
      //   // //Fonts
      //   // /** */

      const fontLoader = new FontLoader();
      const font = fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
        const textGeomentry = new TextGeometry("AKA_9000", {
          font: font,
          size: 0.5,
          depth: 0.3,
          curveSegments: 5,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSegments: 4,
          bevelSize: 0.02,
          bevelOffset: 0,
        });

        textGeomentry.computeBoundingBox();

        // textGeomentry.translate(
        //   textGeomentry.boundingBox ? -(textGeomentry.boundingBox?.max?.x - 0.02) * 0.5 : 0,
        //   textGeomentry.boundingBox ? -(textGeomentry.boundingBox?.max?.y - 0.02) * 0.5 : 0,
        //   textGeomentry.boundingBox ? -(textGeomentry.boundingBox?.max?.z - 0.03) * 0.5 : 0,
        // );

        textGeomentry.center();

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
        // textMaterial.wireframe = true;
        const text = new THREE.Mesh(textGeomentry, material);
        scene.add(text);

        for (let i = 0; i < 100; i++) {
          const donut = new THREE.Mesh(donutGeometry, material);

          donut.position.x = (Math.random() - 0.5) * 10;
          donut.position.y = (Math.random() - 0.5) * 10;
          donut.position.z = (Math.random() - 0.5) * 10;

          donut.rotation.x = Math.random() * Math.PI;
          donut.rotation.y = Math.random() * Math.PI;

          const scale = Math.random();
          donut.scale.set(scale, scale, scale);

          scene.add(donut);
        }
      });

      //   // /** */
      //   // //Lights
      //   // /** */
      const scene = new THREE.Scene();

      const axesHelper = new THREE.AxesHelper();
      scene.add(axesHelper);
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 30);
      pointLight.position.x = 2;
      pointLight.position.y = 3;
      pointLight.position.z = 4;
      scene.add(pointLight);

      // const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());

      // scene.add(cube);

      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

      camera.position.z = 3;

      // camera.lookAt(text.position);

      scene.add(camera);

      window.addEventListener("resize", handleResize);

      //render

      const renderer = new THREE.WebGLRenderer({
        canvas: GLCanvasRef.current,
      });

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      //controls

      const controls = new OrbitControls(camera, GLCanvasRef.current);

      controls.enableDamping = true;

      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        controls.update();

        // update objects

        //render
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
      };

      tick();

      // Cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  });

  return (
    <>
      <canvas className="webgl" onDoubleClick={doubleClickHandler} ref={GLCanvasRef}></canvas>
      {/* 
      <canvas ref={GLCanvasRef} width={300} height={300}>
        <code>&lt;canvas&gt;</code> element.
      </canvas> */}
    </>
  );
};

export default WebGLTestMain;
