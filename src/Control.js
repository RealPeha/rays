import Vec2 from "./Vec2.js";
import world from "./world.js";
import Emitter from "./elements/Emitter.js";
import elements from "./elements/index.js";

const arrayElements = [...elements.values()];

class Control {
  constructor() {
    this.pos = Vec2.ZERO;
    this.mouse = Vec2.ZERO;
    this.mouseLast = Vec2.ZERO;
    this.element = new Emitter({
      pos: this.pos
    });
    this.currentElement = Emitter;
    this.drag = false;
    this.pressedKeys = {};

    this.onMove = this.onMove.bind(this);
    this.onLeftClick = this.onLeftClick.bind(this);
    this.onLeftClickUp = this.onLeftClickUp.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
    this.onMouseScroll = this.onMouseScroll.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.addListeners();
  }

  onMove(e) {
    const { cellSize, offset, zoom } = world;

    this.mouse.set(e.clientX, e.clientY);

    this.pos.set(
      Math.round(
        (e.clientX / zoom - offset.x / zoom - cellSize / 2) / cellSize
      ) * cellSize,
      Math.round(
        (e.clientY / zoom - offset.y / zoom - cellSize / 2) / cellSize
      ) * cellSize
    );
  }

  onLeftClick(e) {
    if (e.which !== 1) {
      return;
    }

    if (this.pressedKeys[16]) {
      this.drag = true;

      return;
    }

    const element = world.getElementByPos(this.pos);

    if (!element) {
      const rays = world.getRaysByPos(this.pos);

      const baseRay = this.element.rays[0];

      const newElement = new this.currentElement({
        pos: this.pos.clone(),
        baseDir: baseRay ? baseRay.dir.clone().normalize() : Vec2.ZERO
      });

      if (rays.length) {
        rays.forEach(({ ray, element }) => {
          ray.len = this.pos.clone().substract(element.pos);
        });
      }

      world.addElement(newElement);
    } else {
      element.toggle();
    }
  }

  onLeftClickUp(e) {
    this.drag = false;
  }

  onRightClick(e) {
    e.preventDefault();

    world.deleteElement(this.pos);
  }

  onMouseScroll(e) {
	if (this.pressedKeys[16]) {
      world.setZoom(e.deltaY);

      return;
    }
	
    if (e.deltaY > 0) {
      this.element.rotate(true);
    } else {
      this.element.rotate();
    }
  }

  onKeyDown(e) {
    const code = e.which;
    this.pressedKeys[code] = true;

    const n = code - 49;

    if (arrayElements[n]) {
      this.element = new arrayElements[n]({
        pos: this.pos
      });
      this.currentElement = arrayElements[n];
    }
  }

  onKeyUp(e) {
    delete this.pressedKeys[e.which];
  }

  update() {
    if (this.drag) {
      world.offset.add(this.mouse.clone().substract(this.mouseLast));
      this.mouseLast.set(this.mouse);
      world.setTransform();
    } else {
      this.mouseLast.set(this.mouse);
    }
  }

  draw() {
    const { ctx } = world;

    ctx.globalAlpha = 0.5;
    this.element.draw();
    ctx.globalAlpha = 1;
  }

  addListeners() {
    world.canvas.addEventListener("mousemove", this.onMove);
    world.canvas.addEventListener("mousedown", this.onLeftClick);
    world.canvas.addEventListener("mouseup", this.onLeftClickUp);
    world.canvas.addEventListener("contextmenu", this.onRightClick);
    world.canvas.addEventListener("wheel", this.onMouseScroll);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }
}

export default Control;
