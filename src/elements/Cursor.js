import Vec2 from "../Vec2.js";
import world from "../world.js";

class Cursor {
  constructor() {
    this.pos = Vec2.ZERO;
    this.clickPos = null;
    this.offset = Vec2.ZERO;
    this.isMove = false;
    this.objects = [];

    this.onMove = this.onMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.addListeners();
  }

  onMove(e) {
    this.pos.set(e.clientX, e.clientY);

    if (this.clickPos) {
      this.offset.set(e.clientX - this.clickPos.x, e.clientY - this.clickPos.y);
    }

    if (this.isMove) {
      this.objects.forEach(obj => {
        obj.pos.add(this.pos.clone().substract(this.clickPos));
      });
    }
  }

  onMouseDown() {
    this.clickPos = this.pos.clone();
    this.offset = Vec2.ZERO;

    if (this.isMove) {
      this.isMove = false;
      this.objects = [];
      this.clickPos = null;
    }
  }

  onMouseUp() {
    this.isMove = true;
    this.objects = world.getObjectsInRect(this.clickPos, this.offset);
  }

  draw() {
    const { ctx } = world;
    if (this.clickPos) {
      ctx.globalAlpha = 0.5;
      ctx.strokeRect(
        this.clickPos.x,
        this.clickPos.y,
        this.offset.x,
        this.offset.y
      );
      ctx.globalAlpha = 1;
    }
  }

  addListeners() {
    world.canvas.addEventListener("mousemove", this.onMove);
    world.canvas.addEventListener("mousedown", this.onMouseDown);
    world.canvas.addEventListener("mouseup", this.onMouseUp);
  }

  removeListeners() {
    world.canvas.removeEventListener("mousemove", this.onMove);
    world.canvas.addEventListener("mousedown", this.onMouseDown);
    world.canvas.addEventListener("mouseup", this.onMouseUp);
  }
}

export default Cursor;
