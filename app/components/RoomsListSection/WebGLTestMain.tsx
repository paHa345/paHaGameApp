import { height } from "@fortawesome/free-regular-svg-icons/faSave";
import { canvas } from "framer-motion/client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Renderer from "three/src/renderers/common/Renderer.js";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

const WebGLTestMain = () => {
  const GLCanvasRef = useRef(null) as any;

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

  useEffect(() => {
    /**
     *
     *
     * debug
     */
    const gui = new GUI();

    /**
     *
     */
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

      window.addEventListener("resize", handleResize);

      const scene = new THREE.Scene();

      //geometry

      // const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
      // const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
      // geometry.setAttribute("position", positionsAttribute);

      // const geometry = new THREE.BufferGeometry();

      // const count = 100;
      // const positionsArray = new Float32Array(count * 3 * 3);

      // for (let i = 0; i < count * 3 * 3; i++) {
      //   positionsArray[i] = Math.random() - 0.5;
      // }

      // const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
      // geometry.setAttribute("position", positionsAttribute);

      //red cube
      const geomentry = new THREE.BoxGeometry(1, 1, 1, 6, 6, 6);
      const material = new THREE.MeshBasicMaterial({
        color: cubeColor.color,
        // wireframe: true,
      });
      const mesh = new THREE.Mesh(geomentry, material);

      scene.add(mesh);

      const parameters = {
        spin: () => {
          gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
        },
      };

      //Debug

      gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Положение по Y");

      gui.add(mesh, "visible").name("Видимость");

      gui.add(material, "wireframe").name("Каркас");
      gui
        .addColor(material, "color")
        .name("Цвет")
        .onChange((value: any) => {
          setCubeColor({
            color: value,
          });
        });

      gui.add(parameters, "spin").name("Вращение");
      // mesh.position.set(0.7, -0.6, 1);

      //objects

      // const group = new THREE.Group();
      // scene.add(group);

      // const cube1 = new THREE.Mesh(
      //   new THREE.BoxGeometry(1, 1, 1),
      //   new THREE.MeshBasicMaterial({
      //     color: 0xff0000,
      //   })
      // );

      // group.add(cube1);
      // const cube2 = new THREE.Mesh(
      //   new THREE.BoxGeometry(1, 1, 1),
      //   new THREE.MeshBasicMaterial({
      //     color: 0x00ff00,
      //   })
      // );
      // cube2.position.x = -2;

      // group.add(cube2);

      // const cube3 = new THREE.Mesh(
      //   new THREE.BoxGeometry(1, 1, 1),
      //   new THREE.MeshBasicMaterial({
      //     color: 0x00ff00,
      //   })
      // );
      // cube3.position.x = 2;

      // group.add(cube3);

      // group.position.y = 1;
      // group.scale.y = 2;
      // group.rotation.y = 1;

      // scale
      // mesh.scale.x = 2;
      // mesh.scale.y = 0.5;
      // mesh.scale.z = 0.5;

      // mesh.scale.set(2, 0.5, 0.5);

      // //rotation

      // mesh.rotation.reorder("YXZ");
      // mesh.rotation.y = (Math.PI / 2) * 0.25;
      // mesh.rotation.x = (Math.PI / 2) * 0.25;

      //axis helper

      const axisHelper = new THREE.AxesHelper(1);
      scene.add(axisHelper);

      //sizes

      //camera

      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

      // cameraRef.current = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
      // const aspectRatio = sizes.width / sizes.height;
      // const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
      // camera.position.x = 2;
      // camera.position.y = 2;
      camera.position.z = 3;
      // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
      // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
      // camera.position.y = cursor.y * 5;
      camera.lookAt(mesh.position);

      scene.add(camera);

      //controls

      const controls = new OrbitControls(camera, GLCanvasRef.current);

      controls.enableDamping = true;

      //render

      const renderer = new THREE.WebGLRenderer({
        canvas: GLCanvasRef.current,
      });

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // renderer.render(scene, camera);

      //clock

      // const clock = new THREE.Clock();
      // timer.connect(canvas);
      //animations

      const tick = () => {
        // const elapsedTime = clock.getElapsedTime();
        //   console.log(elapsedTime);
        //update objects
        //   mesh.rotation.y = elapsedTime / 2;
        //   mesh.rotation.z = elapsedTime * Math.PI * 2;
        //   camera.position.y = Math.sin(elapsedTime);
        //   camera.position.x = Math.cos(elapsedTime);
        //   camera.lookAt(mesh.position);

        //update Controls

        controls.update();
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
