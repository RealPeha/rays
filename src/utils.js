import world from "./world.js";

export const isBehindScreen = pos => {
  return (
    pos.x < -world.offset.x - world.width ||
    pos.x > world.width - world.offset.x + world.width.x ||
    pos.y < -world.offset.y - world.height ||
    pos.y > world.height - world.offset.y + world.width.y
  );
};
