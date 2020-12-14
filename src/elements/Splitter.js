import Vec2, { vec2 } from "../Vec2.js";
import world from "../world.js";
import Emitter from "./Emitter.js";
import Ray from "../Ray.js";

class Splitter extends Emitter {
  constructor(props) {
    super(props);

    this.rays.push(
      new Ray({
        dir: Vec2.ZERO
      })
    );
  }

  powerUp() {
    if (!this.isPowered) {
      return
    }

    const mainRay = this.rays[0];
    const ray = this.rays[1];

    if (this.connecting >= 2) {
      ray.len.set(0);
      ray.dir.set(0);

      return;
    }

    if (mainRay.dir.equal(this.powerSource.dir.clone().reverse())) {
      this.isPowered = false

      return
    }

    if (mainRay.dir.equal(this.powerSource.dir)) {
      ray.dir.set(0);
    } else {
      ray.dir.set(this.powerSource.dir);
    }
  }

  powerDown() {
    this.rays.forEach(ray => ray.len.set(0));
    this.rays[1].dir.set(0);
  }

  toggle() {}

  draw() {
    const { ctx, cellSize } = world;
    const { pos, rays } = this;

    ctx.strokeStyle = "#FFD600";
    ctx.strokeRect(pos.x, pos.y, cellSize, cellSize);

    const center = vec2(pos.x + cellSize / 2, pos.y + cellSize / 2);

    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(center.x + rays[0].dir.x / 2, center.y + rays[0].dir.y / 2);

    ctx.strokeStyle = "black";

    rays.forEach(ray => {
      ctx.moveTo(center.x + ray.dir.x / 2, center.y + ray.dir.y / 2);
      if (ray.len.x === 0 && ray.len.y === 0) {
        ctx.lineTo(
          center.x + ray.len.x + ray.dir.x / 2,
          center.y + ray.len.y + ray.dir.y / 2
        );
      } else {
        ctx.lineTo(
          center.x + ray.len.x - ray.dir.x / 2,
          center.y + ray.len.y - ray.dir.y / 2
        );
      }
    });

    ctx.stroke();
    ctx.strokeStyle = "black";
  }

  get type() {
    return Splitter.type;
  }

  static get type() {
    return "Splitter";
  }
}

export default Splitter;
