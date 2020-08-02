import { vec2 } from "../Vec2.js";

class Element {
  constructor(props) {
    this.baseDir = vec2(0, -1);
    this.rays = [];
    this.isPowered = false;
    this.connecting = 0;

    Object.assign(this, props);
  }

  serialize() {
    const props = {
      pos: [this.pos.x, this.pos.y]
    };

    if (this.baseDir.x !== 0 || this.baseDir.y !== -1) {
      props.baseDir = [this.baseDir.x, this.baseDir.y];
    }

    if (this.isIndicator) {
      props.isIndicator = this.isIndicator;
    }

    return props;
  }

  static deserialize(structure) {
    const props = {
      pos: Array.isArray(structure.pos)
        ? vec2(structure.pos[0], structure.pos[1])
        : vec2(structure.pos.x, structure.pos.y)
    };

    if ("isIndicator" in structure) {
      props.isIndicator = structure.isIndicator;
    }

    if ("isActive" in structure) {
      props.isActive = structure.isActive;
    }

    if ("baseDir" in structure) {
      props.baseDir = Array.isArray(structure.baseDir)
        ? vec2(structure.baseDir[0], structure.baseDir[1])
        : vec2(structure.baseDir.x, structure.baseDir.y);
    }

    return props;
  }

  preUpdate() {
    if (!this.isPowered) {
      this.powerDown();
    }

    this.connecting = 0;
    this.isPowered = false;
  }

  update() {}

  postUpdate() {
    if (this.isPowered) {
      this.powerUp();
    }
  }

  rotate() {}

  toggle() {}

  activate() {}

  deactivate() {}

  powerUp() {}

  powerDown() {}
}

export default Element;
