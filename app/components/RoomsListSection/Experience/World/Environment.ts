import * as THREE from "three";
import Experience from "../Experience";
import { Scene } from "three";
import Debug from "../Utils/Debug";
import GUI from "lil-gui";

export default class Environment {
  experience: Experience;
  scene: Scene | undefined;
  sunLight?: THREE.DirectionalLight;
  resources: any;
  environmentMap?: any;
  debug?: Debug;
  debugFolder?: GUI;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.debug = this.experience.debug;

    // Debug

    if (this.debug?.active) {
      this.debugFolder = this.debug.ui?.addFolder("Окружение");
    }

    this.setSunlight();
    this.setEnvironmentMap();
  }
  setSunlight() {
    if (!this.scene) return;
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);

    if (this.debug?.active) {
      this.debugFolder
        ?.add(this.sunLight, "intensity")
        .min(0)
        .max(10)
        .step(0.001)
        .name("Интенсивность света");
      this.debugFolder
        ?.add(this.sunLight.position, "x")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("Позиция света по X");
      this.debugFolder
        ?.add(this.sunLight.position, "y")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("Позиция света по Y");
      this.debugFolder
        ?.add(this.sunLight.position, "z")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("Позиция света по Z");
    }
  }
  setEnvironmentMap(): any {
    if (!this.scene) return;
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.SRGBColorSpace;
    this.scene.environment = this.environmentMap.texture;

    // this.environmentMap.updateMaterial = () => {
    this.scene?.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMap = this.environmentMap.texture;
        child.material.envMapIntensity = this.environmentMap.intensity;
        child.material.needsUpdate = true;
      }
    });
    if (this.debug?.active) {
      this.debugFolder
        ?.add(this.environmentMap, "intensity")
        .name("Интенсивность")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(() => {
          this.scene?.traverse((child) => {
            if (
              child instanceof THREE.Mesh &&
              child.material instanceof THREE.MeshStandardMaterial
            ) {
              child.material.envMap = this.environmentMap.texture;
              child.material.envMapIntensity = this.environmentMap.intensity;
              child.material.needsUpdate = true;
            }
          });
        });
    }
  }

  //   this.setEnvironmentMap.updateMaterial();
  // }
}
