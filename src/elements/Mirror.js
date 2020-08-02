import Vec2, { vec2 } from "../Vec2.js";
import world from "../world.js";
import Emitter from "./Emitter.js";

class Mirror extends Emitter {
  constructor(props) {
    super({
      ...props,
      isIndicator: "isIndicator" in props ? props.isIndicator : false
    });
  }

  powerUp() {}

  powerDown() {
    this.rays.forEach(ray => (ray.len = Vec2.ZERO));
  }

  toggle() {
    this.isIndicator = !this.isIndicator;
  }

  draw() {
    const { ctx, cellSize } = world;
    const { pos, rays } = this;
    const ray = rays[0];

    ctx.strokeStyle = "tomato";
    if (this.isIndicator) {
      ctx.fillStyle = "tomato";
      if (this.isPowered) {
        ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
      } else {
        ctx.globalAlpha = 0.2;
        ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = "black";
    } else {
      ctx.strokeRect(pos.x, pos.y, cellSize, cellSize);
    }

    const center = vec2(pos.x + cellSize / 2, pos.y + cellSize / 2);

    ctx.strokeStyle = "green";
    ctx.beginPath();
    rays.forEach(ray => {
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + ray.dir.x / 2, center.y + ray.dir.y / 2);
    });

    ctx.strokeStyle = "black";

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

    ctx.stroke();
    ctx.strokeStyle = "black";
  }

  get type() {
    return Mirror.type;
  }

  static get type() {
    return "Mirror";
  }
}

export default Mirror;
