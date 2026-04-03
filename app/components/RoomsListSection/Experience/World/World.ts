import { Scene } from "three";
import Experience from "../Experience";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";

export default class World {
  experience: Experience;
  scene: Scene | undefined;
  environment?: Environment;
  resources: any;
  floor?: Floor;
  fox?: Fox;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      console.log("resources is ready");
      //Setup
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }
  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
