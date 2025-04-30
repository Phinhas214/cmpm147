let size = 80;

class Teal {
    constructor(x, y, type, c) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.c = c;
    }
    
    display() {
      
      noStroke();
      push();
      translate(this.x, this.y);
      
      fill(this.c);
      beginShape();
      if (this.type == 0) {
        // Shape 1
        vertex(size, 0);
        vertex(size, size);
        vertex(0, size);
      } else if (this.type == 1) {
        // Shape 2
        vertex(size, 0);
        vertex(0, 0);
        vertex(0, size);
      } else if (this.type == 2) {
        // Shape 3
        vertex(size, size);
        vertex(0, 0);
        vertex(0, size);
      } else {
        // Shape 4
        vertex(size, size);
        vertex(0, 0);
        vertex(size, 0);
      }
      endShape();
      pop();
    }
  }