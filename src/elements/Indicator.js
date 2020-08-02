import world from "../world.js";
import Element from "./Element.js";

class Indicator extends Element {
  constructor(props) {
    super(props);

    this.isActivated = false;
  }

  powerUp() {
    this.isActivated = true;
  }

  powerDown() {
    this.isActivated = false;
  }

  draw() {
    const { ctx, cellSize } = world;
    const { pos, isActivated } = this;

    ctx.fillStyle = "tomato";

    if (isActivated) {
      ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
    } else {
      ctx.globalAlpha = 0.2;
      ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "black";
  }

  get type() {
    return Indicator.type;
  }

  static get type() {
    return "Indicator";
  }
}

export default Indicator;
