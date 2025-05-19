/*global tileSize */
/* exported Tile */

let tileSize = 120;

class Tile {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.fillType = 1; // 1 -- outside fill (arcs are black), 0 -- inside fill (space between arcs is black)
  }

  insideFillShape(sketch, type) {
    sketch.angleMode(sketch.DEGREES);
    this.fillType = 0;
    sketch.fill(0);
    sketch.noStroke();
    sketch.rect(0, 0, tileSize, tileSize);
    if (type == 0) {
      sketch.fill(255);
      sketch.arc(tileSize, 0, tileSize, tileSize, 90, 180);
      sketch.arc(0, tileSize, tileSize, tileSize, 270, 360);
    } else {
      sketch.fill(255);
      sketch.arc(0, 0, tileSize, tileSize, 0, 90);
      sketch.arc(tileSize, tileSize, tileSize, tileSize, 180, 270);
    }
  }

  outsideFillShape(sketch, type) {
    sketch.angleMode(sketch.DEGREES);
    this.fillType = 1;
    sketch.fill(255);
    sketch.noStroke();
    sketch.rect(0, 0, tileSize, tileSize);
    if (type == 0) {
      sketch.fill(0);
      sketch.arc(tileSize, 0, tileSize, tileSize, 90, 180);
      sketch.arc(0, tileSize, tileSize, tileSize, 270, 360);
    } else {
      sketch.fill(0);
      sketch.arc(0, 0, tileSize, tileSize, 0, 90);
      sketch.arc(tileSize, tileSize, tileSize, tileSize, 180, 270);
    }
  }
}
