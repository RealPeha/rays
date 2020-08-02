class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    if (x instanceof Vec2) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;

      if (typeof y !== "undefined") {
        this.y = y;
      } else {
        this.y = x;
      }
    }

    return this;
  }

  add(x, y) {
    if (x instanceof Vec2) {
      this.x += x.x;
      this.y += x.y;
    } else {
      this.x += x;

      if (typeof y !== "undefined") {
        this.y += y;
      } else {
        this.y += x;
      }
    }

    return this;
  }

  substract(x, y) {
    if (x instanceof Vec2) {
      this.x -= x.x;
      this.y -= x.y;
    } else {
      this.x -= x;

      if (typeof y !== "undefined") {
        this.y -= y;
      } else {
        this.y -= x;
      }
    }

    return this;
  }

  multiply(x, y) {
    if (x instanceof Vec2) {
      this.x *= x.x;
      this.y *= x.y;
    } else {
      this.x *= x;

      if (typeof y !== "undefined") {
        this.y *= y;
      } else {
        this.y *= x;
      }
    }

    return this;
  }

  divide(x, y) {
    if (x instanceof Vec2) {
      this.x /= x.x;
      this.y /= x.y;
    } else {
      this.x /= x;

      if (y) {
        this.y /= y;
      } else {
        this.y /= x;
      }
    }

    return this;
  }

  dist(vec) {
    return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2);
  }

  reverse() {
    this.x *= -1;
    this.y *= -1;

    return this;
  }

  equal(vec) {
    return this.x === vec.x && this.y === vec.y;
  }

  normalize() {
    const len = this.length;

    if (len === 0) {
      return this;
    }

    this.x /= len;
    this.y /= len;

    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  static fromAngle(angle, len = 1) {
    return new Vec2(Math.sin(angle) * len, Math.cos(angle) * len);
  }

  static get ZERO() {
    return new Vec2(0, 0);
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get angle() {
    return this.angleX;
  }

  get angleX() {
    return Math.atan2(this.y, this.x);
  }

  get angleY() {
    return Math.atan2(this.x, this.y);
  }
}

export const vec2 = (x, y) => new Vec2(x, y);

export default Vec2;
