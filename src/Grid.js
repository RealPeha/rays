import { vec2 } from "./Vec2.js";
import world from "./world.js";

class Grid {
  constructor(options) {
    Object.assign(this, options);
  }
  
  draw() {
    const { ctx, width, height, cellSize, offset, zoom } = world;

    ctx.globalAlpha = this.opacity;
    ctx.beginPath();

    const roundedOffset = vec2(
      -Math.round(offset.x / zoom / cellSize) * cellSize,
      -Math.round(offset.y / zoom / cellSize) * cellSize
    );

    for (
      let y = roundedOffset.y;
      y < height / zoom + roundedOffset.y + cellSize;
      y += cellSize
    ) {
      ctx.moveTo(-offset.x / zoom, y);
      ctx.lineTo(width / zoom + roundedOffset.x + cellSize, y);
    }

    for (
      let x = roundedOffset.x;
      x < width / zoom + roundedOffset.x + cellSize;
      x += cellSize
    ) {
      ctx.moveTo(x, -offset.y / zoom);
      ctx.lineTo(x, height / zoom + roundedOffset.y + cellSize);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

export default Grid;
