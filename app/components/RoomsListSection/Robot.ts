export default class Robot {
  name: string;
  legs: number;
  constructor(name: string, legs: number) {
    this.legs = legs;
    this.name = name;
    console.log(`I am ${this.name}. Thank you creator.`);
    this.sayHi();
  }
  sayHi() {
    console.log(`Hello. My name is ${this.name}`);
  }
}
