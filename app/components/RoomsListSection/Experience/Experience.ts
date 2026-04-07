import { faDiceThree } from "@fortawesome/free-solid-svg-icons";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Rendrer";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Debug from "./Utils/Debug";

let instance: any = null;

export default class Experience {
  canvas?: HTMLCanvasElement | null;
  sizes?: Sizes;
  time?: Time;
  scene?: THREE.Scene;
  camera?: Camera;
  renderer?: Renderer;
  world?: World;
  resources?: Resources;
  debug?: Debug;
  constructor(canvas?: HTMLCanvasElement | null) {
    if (instance) {
      console.log("b");
      return instance;
    }

    console.log("a");
    instance = this;
    //Global access
    // window.experience = this;

    this.canvas = canvas;

    //Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();

    this.resources = new Resources(sources);

    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    //Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });
    //Time tick update
    this.time.on("tick", () => {
      this.update();
    });
  }
  resize() {
    this.camera?.resize();
    this.renderer?.resize();
  }
  update() {
    this.camera?.update();
    this.world?.update();
    this.renderer?.update();
  }
  destroy() {
    this.sizes?.off("resize");
    this.time?.off("tick");

    // Traverse the whole scene

    this.scene?.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });
    this.camera?.controls?.dispose();
    this.renderer?.instance?.dispose();
    if (this.debug?.active) {
      this.debug.ui?.destroy();
    }
  }
}
