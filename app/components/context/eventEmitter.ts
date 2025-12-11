// app/utils/eventEmitter.ts
import EventEmitter from 'events';

const eventEmitter = new EventEmitter();
eventEmitter.on("authChange", () => console.log("authChange capté !"));
eventEmitter.on("panierChange", () => console.log("panierChange capté !"));
export default eventEmitter;