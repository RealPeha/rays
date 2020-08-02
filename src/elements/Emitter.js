import Vec2, { vec2 } from "../Vec2.js";
import world from "../world.js";
import { isBehindScreen } from "../utils.js";
import Ray from "../Ray.js";
import Element from "./Element.js";

class Emitter extends Element {
  constructor(props) {
    super({
      ...props,
      isActive: "isActive" in props ? props.isActive : true
    });

    this.rays = [
      new Ray({
        dir: this.baseDir.clone().multiply(world.cellSize)
      })
    ];
  }

  update() {
    if (!this.isActive) {
      return;
    }

    const { rays, pos } = this;

    for (const ray of rays) {
      const rayPos = pos.clone().add(ray.len);

      if (isBehindScreen(rayPos)) {
        continue;
      }

      const element = world.getElementByPos(rayPos);

      if (element && element !== this) {
        element.isPowered = true;
        element.powerSource = ray;
        element.connecting += 1;
      } else {
        ray.move();
      }
    }
  }

  powerUp() {
    this.rays.forEach(ray => (ray.len = Vec2.ZERO));
  }

  toggle() {
    this.isActive = !this.isActive;

    if (this.isActive) {
      this.powerDown();
    } else {
      this.powerUp();
    }
  }

  rotate(sunwise = false) {
    const ray = this.rays[0];

    if (sunwise) {
      ray.dir = vec2(-ray.dir.y, ray.dir.x);
    } else {
      ray.dir = vec2(ray.dir.y, -ray.dir.x);
    }

    ray.pos = this.pos.clone();
    ray.len = Vec2.ZERO;
  }

  draw() {
    const { ctx, cellSize } = world;
    const { pos, rays } = this;
    const ray = rays[0];

    ctx.strokeRect(pos.x, pos.y, cellSize, cellSize);

    const center = vec2(pos.x + cellSize / 2, pos.y + cellSize / 2);
    const halfDir = ray.dir.clone().divide(2);

    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(center.x + halfDir.x, center.y + halfDir.y);

    if (ray.len.x !== 0 || ray.len.y !== 0) {
      ctx.strokeStyle = "black";
      ctx.moveTo(center.x + halfDir.x, center.y + halfDir.y);
      if (ray.len.x === 0 && ray.len.y === 0) {
        ctx.lineTo(
          center.x + ray.len.x + halfDir.x,
          center.y + ray.len.y + halfDir.y
        );
      } else {
        ctx.lineTo(
          center.x + ray.len.x - halfDir.x,
          center.y + ray.len.y - halfDir.y
        );
      }
    }

    ctx.stroke();
    ctx.strokeStyle = "black";
  }

  get type() {
    return Emitter.type;
  }

  static get type() {
    return "Emitter";
  }
}

export default Emitter;
