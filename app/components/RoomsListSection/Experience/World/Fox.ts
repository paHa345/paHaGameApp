import Experience from "../Experience";
import { Scene } from "three";
import Resources from "../Utils/Resources";
import * as THREE from "three";
import Time from "../Utils/Time";
import Debug from "../Utils/Debug";
import { throws } from "assert";
import GUI from "lil-gui";

export default class Fox {
  experience: Experience;
  scene: Scene | undefined;
  resources: Resources | undefined;
  resource: any;
  model: any;
  animation?: {
    mixer?: THREE.AnimationMixer;
    action?: THREE.AnimationAction;
    actions?: {
      idle?: THREE.AnimationAction;
      walking?: THREE.AnimationAction;
      running?: THREE.AnimationAction;
      current?: THREE.AnimationAction;
    };
    play?: (name: "idle" | "walking" | "running" | "current") => void;
  };
  time?: Time;
  debug?: Debug;
  debugFolder?: GUI;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    //Debug
    if (this.debug?.active) {
      this.debugFolder = this.debug.ui?.addFolder("Лиса");
    }

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
    this.animation.actions = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
    this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);
    // this.animation.action = this.animation.mixer.clipAction(this.resource.animations[0]);
    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();
    this.animation.play = (name: "idle" | "walking" | "running" | "current") => {
      if (!this.animation) {
        return;
      }
      if (!this.animation.actions) {
        return;
      }
      const newAction = this.animation?.actions[name];
      const oldAction = this.animation.actions.current;

      if (!oldAction) {
        return;
      }
      newAction?.reset();
      newAction?.play();
      newAction?.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };
    if (this.debug?.active) {
      const debugObject = {
        playIdle: () => {
          if (!this.animation) return;
          if (!this.animation.play) return;
          this.animation?.play("idle");
        },
        playWalking: () => {
          if (!this.animation) return;
          if (!this.animation.play) return;
          this.animation?.play("walking");
        },
        playRunning: () => {
          if (!this.animation) return;
          if (!this.animation.play) return;
          this.animation?.play("running");
        },
      };
      this.debugFolder?.add(debugObject, "playIdle").name("Стоит");
      this.debugFolder?.add(debugObject, "playWalking").name("Идёт");
      this.debugFolder?.add(debugObject, "playRunning").name("Бежит");
    }
  }
  update() {
    if (!this.animation) return;
    if (!this.time) return;

    this.animation.mixer?.update(this.time.delta * 0.001);
  }
}
