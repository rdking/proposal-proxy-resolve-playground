import { Person } from "./person.js";
import { monitor, stopMonitoring } from "./monitor.js";

const user1 = "User 1";
const user2 = "User 2";

const john = new Person("John");
const jane = new Person("Jane");

const proxy1John = monitor(john, "john", user1);
const proxy2John = monitor(john, "john", user2);

const proxy1Jane = monitor(jane, "jane", user1);
const proxy2Jane = monitor(proxy1Jane, "jane", user2);

proxy1John.name = "Johnny";
console.log(proxy2John.name);

console.log(proxy1John.sayHi(proxy2Jane));

proxy1Jane.age = 30;
console.log(proxy2Jane.age);
proxy2Jane.beAgeless();
console.log(proxy1Jane.age);

console.log(stopMonitoring(proxy2John));
console.log(stopMonitoring(proxy2John));
console.log(stopMonitoring(proxy2Jane));
