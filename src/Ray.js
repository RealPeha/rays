import Vec2 from "./Vec2.js";

class Ray {
  constructor(options) {
    this.len = Vec2.ZERO;
    this.dir = options.dir;

    Object.assign(this, options);
  }

  move() {
    this.len.add(this.dir);
  }
}

export default Ray;
