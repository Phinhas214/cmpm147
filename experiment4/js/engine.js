"use strict";

/* global p5, tileSize, sprite */
/* exported preload, setup, draw, mouseClicked */

// Project base code provided by {amsmith,ikarth}@ucsc.edu


let tile_width_step_main; // A width step is half a tile's width
let tile_height_step_main; // A height step is half a tile's height

// Global variables. These will mostly be overwritten in setup().
let tile_rows, tile_columns;
let camera_offset;
let camera_velocity;
let curr_offset;
let sprite;
/////////////////////////////
// Transforms between coordinate systems
// These are actually slightly weirder than in full 3d...
/////////////////////////////
function worldToScreen([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main;
  let j = (world_x + world_y) * tile_height_step_main;
  return [i + camera_x, j + camera_y];
}

function worldToCamera([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main;
  let j = (world_x + world_y) * tile_height_step_main;
  return [i, j];
}

function tileRenderingOrder(offset) {
  return [offset[1] - offset[0], offset[0] + offset[1]];
}

function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
  screen_x -= camera_x;
  screen_y -= camera_y;
  screen_x /= tile_width_step_main * 2;
  screen_y /= tile_height_step_main * 2;
  screen_y += 0.5;
  return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
}

function cameraToWorldOffset([camera_x, camera_y]) {
  let world_x = camera_x / (tile_width_step_main * 2);
  let world_y = camera_y / (tile_height_step_main * 2);
  return { x: Math.round(world_x), y: Math.round(world_y) };
}

function worldOffsetToCamera([world_x, world_y]) {
  let camera_x = world_x * (tile_width_step_main * 2);
  let camera_y = world_y * (tile_height_step_main * 2);
  return new p5.Vector(camera_x, camera_y);
}

function preload() {
  sprite = [];
  sprite[0] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite1.png?v=1745889341227");
    sprite[1] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite2.png?v=1745889343751");
    sprite[2] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite3.png?v=1745889346312");
    sprite[3] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite4.png?v=1745889349199");
    sprite[4] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite5.PNG?v=1745892633671");
    sprite[5] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite6.PNG?v=1745892644390");
    sprite[6] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite7.PNG?v=1745892648606");
  if (window.p3_preload) {
    window.p3_preload();
  }
}

function setup() {
  sprite = [];
  sprite[0] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite1.png?v=1745889341227");
  sprite[1] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite2.png?v=1745889343751");
  sprite[2] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite3.png?v=1745889346312");
  sprite[3] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite4.png?v=1745889349199");
  sprite[4] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite5.PNG?v=1745892633671");
  sprite[5] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite6.PNG?v=1745892644390");
  sprite[6] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite7.PNG?v=1745892648606");
  let canvas = createCanvas(400, 400);
  canvas.parent("container");

  camera_offset = new p5.Vector(-width / 2, height / 2);
  curr_offset = new p5.Vector(-width / 2, height / 2);
  camera_velocity = new p5.Vector(0, 0);

  if (window.p3_setup) {
    window.p3_setup();
  }

  let label = createP();
  label.html("World key: ");
  label.parent("container");

  let input = createInput("xyzzy");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });

  createP("Arrow keys scroll. Clicking changes tiles.").parent("container");

  rebuildWorld(input.value());
}

function rebuildWorld(key) {
  if (window.p3_worldKeyChanged) {
    window.p3_worldKeyChanged(key);
  }
  tile_width_step_main = window.p3_tileWidth ? window.p3_tileWidth() : 32;
  tile_height_step_main = window.p3_tileHeight ? window.p3_tileHeight() : 14.5;
  tile_columns = Math.ceil(width / (tile_width_step_main * 2));
  tile_rows = Math.ceil(height / (tile_height_step_main * 2));
}

function mouseClicked() {
  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );

  if (window.p3_tileClicked) {
    window.p3_tileClicked(world_pos[0], world_pos[1]);
  }
  return false;
}

let isUp = false;
let isDown = false;
let isRight = false;
let isLeft = false;

function draw() {
  let speed = 0.25;
  if (!isUp && !isDown) {
    camera_velocity.y = 0;
  } else if (isDown) {
    if (camera_offset.y <= (curr_offset.y - tileSize)) {
      camera_offset.y = (curr_offset.y - tileSize);
      curr_offset.y = (curr_offset.y - tileSize);
      camera_velocity.y = 0;
      isDown = false;
      isUp = false;
      isLeft = false;
      isRight = false;
    } else {
      camera_velocity.y -= speed;
    }
  } else {
    if (camera_offset.y >= (curr_offset.y + tileSize)) {
      camera_offset.y = (curr_offset.y + tileSize);
      curr_offset.y = (curr_offset.y + tileSize);
      camera_velocity.y = 0;
      isDown = false;
      isUp = false;
      isLeft = false;
      isRight = false;
    } else {
      camera_velocity.y += speed;
    }
  }
  if (!isLeft && !isRight) {
    camera_velocity.x = 0;
  } else if (isLeft) {
    if (camera_offset.x <= (curr_offset.x - tileSize)) {
      camera_offset.x = (curr_offset.x - tileSize);
      curr_offset.x = (curr_offset.x - tileSize);
      camera_velocity.x = 0;
      isDown = false;
      isUp = false;
      isLeft = false;
      isRight = false;
    } else {
      camera_velocity.x -= speed;
    }
  } else {
    if (camera_offset.x >= (curr_offset.x + tileSize)) {
      camera_offset.x = (curr_offset.x + tileSize);
      curr_offset.x = (curr_offset.x + tileSize);
      camera_velocity.x = 0;
      isDown = false;
      isUp = false;
      isLeft = false;
      isRight = false;
    } else {
      camera_velocity.x += speed;
    }
  }
  // Keyboard controls!
  if (keyIsDown(LEFT_ARROW)) {
    if (!isRight && !isDown && !isUp) {
      isLeft = true;
    }
    camera_velocity.x -= 1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    if (!isLeft && !isDown && !isUp) {
      isRight = true;
    }
    camera_velocity.x += 1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    if (!isRight && !isLeft && !isUp) {
      isDown = true;
    }
    camera_velocity.y -= 1;
  }
  if (keyIsDown(UP_ARROW)) {
    if (!isRight && !isDown && !isLeft) {
      isUp = true;
    }
    camera_velocity.y += 1;
  }

  let camera_delta = new p5.Vector(0, 0);
  camera_velocity.add(camera_delta);
  camera_offset.add(camera_velocity);
  camera_velocity.mult(0.95); // cheap easing
  if (camera_velocity.mag() < 0.01) {
    camera_velocity.setMag(0);
  }

  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );
  let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

  background(220);

  if (window.p3_drawBefore) {
    window.p3_drawBefore();
  }

  let overdraw = 0.1;

  let y0 = Math.floor((0 - overdraw) * tile_rows);
  let y1 = Math.floor((1 + overdraw) * tile_rows);
  let x0 = Math.floor((0 - overdraw) * tile_columns);
  let x1 = Math.floor((1 + overdraw) * tile_columns);

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
        camera_offset.x,
        camera_offset.y
      ]);
    }
  }

  describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

  
  
  if (window.p3_drawAfter) {
    window.p3_drawAfter();
  }
  
  var scale = .5;
  imageMode(CENTER);
  let photo = sprite[0];
  if (isDown) {
    //scale(-1, 1);
    if (camera_offset.y <= (curr_offset.y) - (tileSize / 4)) {
      photo = sprite[4];
    } else {
      photo = sprite[5];
    }
  } else if (isUp) {
    //scale(1, 1);
    if (camera_offset.y >= (curr_offset.y) + (tileSize / 4)) {
      photo = sprite[1];
    } else {
      photo = sprite[2];
    }
  } else if (isLeft) {
    //scale(-1, 1);
    if (camera_offset.x <= (curr_offset.x) - (tileSize / 4)) {
      photo = sprite[6];
    } else {
      photo = sprite[4];
    }
  } else if (isRight) {
    //scale(1, 1);
    if (camera_offset.x >= (curr_offset.x) + (tileSize / 4)) {
      photo = sprite[3];
    } else {
      photo = sprite[1];
    }
  }
  
  if (isLeft || isDown) {
    image(photo, 160, 160, scale*width, scale*photo.height*width/photo.width, 0, 0, photo.height, photo.height);
  } else {
    image(photo, 240, 160, scale*width, scale*photo.height*width/photo.width, 0, 0, photo.height, photo.height);
  }
  
  
}

// Display a discription of the tile at world_x, world_y.
function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
}

function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
  push();
  translate(screen_x, screen_y);
  if (window.p3_drawSelectedTile) {
    window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
  }
  pop();
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  push();
  translate(0 - screen_x, screen_y);
  if (window.p3_drawTile) {
    window.p3_drawTile(world_x, world_y, -screen_x, screen_y);
  }
  pop();
}
