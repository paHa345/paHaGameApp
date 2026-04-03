import { Scene } from "three";
import Experience from "./Experience";
import Sizes from "./Utils/Sizes";
import Camera from "./Camera";
import * as THREE from "three";

export default class Renderer {
  experience: Experience;
  canvas: HTMLCanvasElement | null | undefined;
  sizes?: Sizes | undefined;
  scene?: Scene | undefined;
  camera?: Camera | undefined;
  instance?: THREE.WebGLRenderer;
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();
  }
  setInstance() {
    if (!this.canvas) return;
    if (!this.sizes) return;
    this.instance = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFShadowMap;
    this.instance.setClearColor("#211d20");
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    console.log(this.instance);
  }
  resize() {
    if (!this.instance) return;
    if (!this.sizes) return;
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }
  update() {
    if (!this.scene) return;
    if (!this.camera) return;
    if (!this.camera.instance) return;
    this.instance?.render(this.scene, this.camera.instance);
  }
}
