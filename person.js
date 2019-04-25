import { mapGet, mapSet, mapDelete } from "./map-ops.js";

const names = new WeakMap();
const ages = new WeakMap();

export class Person {
  constructor(name) {
    this.name = name;
  }

  get name() {
    return mapGet(names, this);
  }

  set name(value) {
    mapSet(names, this, value, true);
  }

  get age() {
    return mapGet(ages, this);
  }

  set age(value) {
    mapSet(ages, this, value, true);
  }

  sayHi(to) {
    return `Hello${to ? " " + mapGet(names, to) : ""}, I am ${mapGet(
      names,
      this
    )}.`;
  }

  beAgeless() {
    mapDelete(ages, this, true);
  }
}
