import Experience from "./Experience";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Sizes from "./Utils/Sizes";

export default class Camera {
  sizes: Sizes | undefined;
  scene?: THREE.Scene;
  experience: Experience;
  canvas?: HTMLCanvasElement | null;
  instance: THREE.PerspectiveCamera | undefined;
  controls: OrbitControls | undefined;
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    if (!this.sizes?.width) return;
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
    this.instance.position.set(6, 4, 8);
    this.scene?.add(this.instance);
  }
  setOrbitControls() {
    if (!this.instance) return;
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }
  resize() {
    console.log("Resize");
    if (!this.sizes?.width) return;
    if (!this.instance) return;
    if (!this.instance.aspect) return;

    this.instance.aspect = this.sizes?.width / this.sizes?.height;
    this.instance.updateProjectionMatrix();
  }
  update() {
    this.controls?.update();
  }
}
