import Emitter from "./Emitter.js";
import Mirror from "./Mirror.js";
import Indicator from "./Indicator.js";
import Splitter from "./Splitter.js";

const elements = new Map();

const register = element => {
  elements.set(element.type, element);
};

register(Emitter);
register(Mirror);
register(Splitter);
register(Indicator);

export default elements;
