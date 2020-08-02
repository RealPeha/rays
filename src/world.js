import Vec2 from "./Vec2.js";
import { default as allElements } from "./elements/index.js";

class World {
  constructor() {
    this.canvas = document.querySelector("#app");
    this.ctx = this.canvas.getContext("2d");
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.offset = Vec2.ZERO;
    this.cellSize = 30;
    this.zoom = 1;

    this.elements = new Map();
  }

  reset() {
    this.elements = new Map();
  }

  addElement(element) {
    this.elements.set(JSON.stringify(element.pos), element);
  }

  deleteElement(pos) {
    this.elements.delete(JSON.stringify(pos));
  }

  getElementByPos(pos) {
    return this.elements.get(JSON.stringify(pos));
  }

  getElementsInRect(startPoint, offset) {
    return [...this.elements.values()].filter(elem => {
      return (
        elem.pos.x >= startPoint.x &&
        elem.pos.x <= startPoint.x + offset.x &&
        elem.pos.y >= startPoint.y &&
        elem.pos.y <= startPoint.y + offset.y
      );
    });
  }

  getRaysByPos(pos) {
    const inX = (ray, element) => {
      if (ray.len.x >= 0) {
        return pos.x <= element.pos.x + ray.len.x && pos.x >= element.pos.x;
      }

      return pos.x <= element.pos.x && pos.x >= element.pos.x + ray.len.x;
    };

    const inY = (ray, element) => {
      if (ray.len.y < 0) {
        return pos.y >= element.pos.y + ray.len.y && pos.y <= element.pos.y;
      }

      return pos.y >= element.pos.y && pos.y <= element.pos.y + ray.len.y;
    };

    return [...this.elements.values()]
      .map(element =>
        element.rays
          .filter(ray => inX(ray, element) && inY(ray, element))
          .map(ray => ({ ray, element }))
      )
      .flat();
  }

  setZoom(dir) {
    if (dir > 0 && this.zoom > 0.2) {
      this.zoom -= 0.1;
    } else if (dir < 0 && this.zoom < 2) {
      this.zoom += 0.1;
    }

    this.setTransform();
  }

  setTransform() {
    this.ctx.setTransform(
      this.zoom,
      0,
      0,
      this.zoom,
      this.offset.x,
      this.offset.y
    );
  }

  clear() {
    const { offset, ctx, zoom, width, height } = this;

    ctx.clearRect(
      -offset.x / zoom,
      -offset.y / zoom,
      width / zoom,
      height / zoom
    );
  }

  update() {
    this.elements.forEach(element => element.preUpdate());
    this.elements.forEach(element => element.update());
    this.elements.forEach(element => element.postUpdate());
  }

  draw() {
    this.elements.forEach(element => element.draw());
  }

  save() {
    const elements = [...this.elements.values()];

    const data = elements.reduce((acc, element) => {
      const stringified = element.serialize();

      if (!acc[element.type]) {
        acc[element.type] = [stringified];
      } else {
        acc[element.type].push(stringified);
      }

      return acc;
    }, {});

    return data;
  }

  saveToLocalStorage() {
    const raw = this.save();

    const name = prompt("Input save name", "untitled") || "untitled";
    const schemeName = `scheme-${name}`;

    if (localStorage.getItem(schemeName)) {
      const overwrite = window.confirm(
        "Save with this name already exists. Do you want to overwrite?"
      );

      if (overwrite) {
        localStorage.setItem(schemeName, JSON.stringify(raw));
      }
    } else {
      localStorage.setItem(schemeName, JSON.stringify(raw));
    }
  }

  saveToFile() {
    const raw = this.save();

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    const fileName = prompt("Input file name", "untitled") || "untitled";

    const blob = new Blob([JSON.stringify(raw)], { type: "octet/stream" });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  autosave() {
    setInterval(() => {
      const raw = this.save();
      console.log("autosave");

      localStorage.setItem("autosave-scheme", JSON.stringify(raw));
    }, 10000);
  }

  loadFromInternalStorage() {
    const fileName = prompt("Input internal file name (available: 2-bit, 2to10, 10to2, adder, d-trigger, loading, numbers, t-trigger, x, xor)");

    import(`./saves/${fileName}.js`)
	  .then(module => module.default)
      .then(raw => this.load(raw))
      .catch(err => console.log(err));
  }

  loadFromLocalStorage() {
    const name = prompt("Input save name");

    const raw = localStorage.getItem(`scheme-${name}`);

    if (raw) {
      try {
        this.load(JSON.parse(raw));
      } catch (e) {
        console.log(e);
      }
    }
  }

  loadFromFile() {
    const file = document.querySelector("#localFile").files[0];

    const fileRead = new FileReader();
    fileRead.onload = e => {
      const content = e.target.result;

      try {
        this.load(JSON.parse(content));
      } catch (e) {
        console.log(e);
      }
    };
    fileRead.readAsText(file);
  }

  load(raw) {
    this.elements = new Map();

    const elements = raw.objects || raw.elements;

    if (Array.isArray(elements)) {
      elements.forEach(structure => {
        const Element = allElements.get(structure.type);

        if (Element) {
          const props = Element.deserialize(structure);
          const element = new Element(props);

          this.addElement(element);
        }
      });
    }

    [...allElements.keys()].forEach(type => {
      if (raw[type] && Array.isArray(raw[type])) {
        raw[type].forEach(structure => {
          const Element = allElements.get(type);

          const props = Element.deserialize(structure);
          const element = new Element(props);

          this.addElement(element);
        });
      }
    });
  }
}

export default new World();
