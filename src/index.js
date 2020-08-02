import world from "./world.js";
import Grid from "./Grid.js";
import Control from "./Control.js";

const $ = selector => document.querySelector(selector);

$("#new").addEventListener("click", () => world.reset());
$("#loadFromFile").addEventListener("click", () => $("#localFile").click());
$("#localFile").addEventListener("change", () => world.loadFromFile());
$("#loadFromInternal").addEventListener("click", () =>
  world.loadFromInternalStorage()
);
$("#loadFromLocal").addEventListener("click", () =>
  world.loadFromLocalStorage()
);
$("#saveToLocal").addEventListener("click", () => world.saveToLocalStorage());
$("#saveAs").addEventListener("click", () => world.saveToFile());
$("#help").addEventListener("click", () => {
  alert(`1 = Emitter
2 = Mirror
3 = Splitter
4 = Indicator
Left Click = Place
Left Click on Element = Toggle (if element supports)
Right Click = Remove
Mouse Wheel = Rotate
Left Shift + Left Click = Drag camera
Left Shift + Mouse Wheel = Zoom`);
});

const autosave = localStorage.getItem("autosave-scheme");

if (autosave) {
  try {
    world.load(JSON.parse(autosave));
  } catch (e) {
    console.log(e);
  }
}

world.autosave();

const grid = new Grid({
  opacity: 0.15
});

const control = new Control();

const update = () => {
  world.update();
  control.update();
};

const render = () => {
  grid.draw();
  control.draw();
  world.draw();
};

const loop = () => {
  world.clear();

  update();
  render();

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
