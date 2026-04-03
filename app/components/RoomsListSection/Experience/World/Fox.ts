import Experience from "../Experience";
import { Scene } from "three";
import Resources from "../Utils/Resources";
import * as THREE from "three";
import Time from "../Utils/Time";

export default class Fox {
  experience: Experience;
  scene: Scene | undefined;
  resources: Resources | undefined;
  resource: any;
  model: any;
  animation?: {
    mixer?: THREE.AnimationMixer;
    action?: THREE.AnimationAction;
  };
  time?: Time;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.resource = this.resources?.items.foxModel;

    console.log(this.resource);

    this.setModel();
    this.setAnimation();
  }
  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene?.add(this.model);
    this.model.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }
  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.action = this.animation.mixer.clipAction(this.resource.animations[0]);
    this.animation.action.play();
  }
  update() {
    if (!this.animation) return;
    if (!this.time) return;

    this.animation.mixer?.update(this.time.delta * 0.01);
  }
}
