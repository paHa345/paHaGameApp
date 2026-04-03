import Robot from "./Robot";

export default class FlyingRobot extends Robot {
  constructor(name: string, legs: number) {
    super(name, legs);
  }
  sayHi() {
    console.log(`Hello. My name is ${this.name}. And im a flying robot`);
  }
  takeOFF() {
    console.log(`Have a good flight ${this.name}`);
  }
  land() {
    console.log(`Welcome back ${this.name}`);
  }
}
