// sketch.js - draw a pyramid and add star particles to a canvas
// Author: Phineas Asmelash
// Date: 04/12/2025


// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;



function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size

  // reset particle array to null and adust effect width based on canvas width
  if (effect) {
    effect.width = canvas.width;
    console.log("width: " + effect.width);
    effect.height = canvas.height;
    effect.particlesArray = [] // I'm resetting the array because we don't wanna redraw particles on top of each other everytime we resize
    effect.init();
    effect.update();
  }
  
  console.log("inside resizeScreen()");
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  effect = new Effect(canvas.width, canvas.height);
  noStroke();

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  effect = new Effect(canvas.width, canvas.height);
  
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(67,18,28);
  // background(0);
  effect.update();
  // big triangle
  fill(0, 135, 149);
  // triangle(165, 170, -50, 350, 350, 450);
  // triangle(canvas.width/2, canvas.height/3, canvas.width/10, canvas.height, canvas.width/1.5, canvas.height);
  triangle(canvas.width/5, canvas.height/5, canvas.width/10, canvas.height/2, canvas.width/2.2, canvas.height);
  // print(canvas.width);

  // left-bottom triangle (to blend canvas and pyramid) 
  strokeWeight(0);
  // triangle(0, 400, 0, 350, 350, 400)

  // small shady triangle
  fill(0, 97, 113);
  triangle(canvas.width/5, canvas.height/5, canvas.width/2.2, canvas.height, canvas.width/4, canvas.height);
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


// Particle class
class Particle {
  constructor(x, y, effect) {
    this.originX = x;
    this.originY = y;
    this.effect = effect;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.2;
    this.friction = 0.95;
    this.dx = 0;
    this.dy = 0;
    this.distance = 0;
    this.force = 0;
    this.angle = 0;
    this.size = floor(random(1, 4));
  }

  draw() {
    fill(255);
    // rect(this.x, this.y, this.size, this.size);
    star(this.x, this.y, this.size, this.size * 1.5, 5);
  }

  update() {
    this.dx = this.effect.mouse.x - this.x;
    this.dy = this.effect.mouse.y - this.y;
    this.distance = this.dx * this.dx + this.dy * this.dy;

    if (this.distance < this.effect.mouse.radius && this.distance > 0.01) {
      this.force = -this.effect.mouse.radius / this.distance;
      this.angle = atan2(this.dy, this.dx);
      this.vx += this.force * cos(this.angle);
      this.vy += this.force * sin(this.angle);
    }

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx + (this.originX - this.x) * this.ease;
    this.y += this.vy + (this.originY - this.y) * this.ease;

    this.draw();
  }
}

// Effect class
class Effect {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.particlesArray = [];
    this.mouse = {
      radius: 700,
      x: 0,
      y: 0
    };

    this.init();
  }

  init() {
    let x = 10;
    while (x < canvas.width) {
      let y = 10;
      let xGap = floor(random(10, 15));
      
      while (y < canvas.height) {
        let yGap = floor(random(25, 35));
        // cap the number of particles on screen for performance
        if (this.particlesArray.length < 20000) {
          this.particlesArray.push(new Particle(x, y, this));
        }
        
        y += yGap;
      }
      
      x += xGap; 
    }
  }
  
  update() {
    this.mouse.x = mouseX;
    this.mouse.y = mouseY;

    for (let p of this.particlesArray) {
      p.update();
    }
  }
}
