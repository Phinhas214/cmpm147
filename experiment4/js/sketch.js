"use strict";

/* global XXH, Tile */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
    sprite
*/

"use strict";

/* global p5, tileSize, sprite */
/* exported preload, setup, draw, mouseClicked */

// Project base code provided by {amsmith,ikarth}@ucsc.edu






"use strict";

/* global XXH, Tile */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
    sprite
*/














var s = function( sketch ) {
  sketch.setup = function() {
    sketch.createCanvas(320, 320);
    sketch.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  };

  let tile_width_step_main; // A width step is half a tile's width
  let tile_height_step_main; // A height step is half a tile's height

  // Global variables. These will mostly be overwritten in setup().
  let tile_rows, tile_columns;
  let camera_offset;
  let camera_velocity;
  let curr_offset;
  /////////////////////////////
  // Transforms between coordinate systems
  // These are actually slightly weirder than in full 3d...
  /////////////////////////////

  sketch.worldToScreen = function([world_x, world_y], [camera_x, camera_y]) {
    let i = (world_x - world_y) * tile_width_step_main;
    let j = (world_x + world_y) * tile_height_step_main;
    return [i + camera_x, j + camera_y];
  }

  sketch.worldToCamera = function([world_x, world_y], [camera_x, camera_y]) {
    let i = (world_x - world_y) * tile_width_step_main;
    let j = (world_x + world_y) * tile_height_step_main;
    return [i, j];
  }

  sketch.tileRenderingOrder = function(offset) {
    return [offset[1] - offset[0], offset[0] + offset[1]];
  }

  sketch.screenToWorld = function([screen_x, screen_y], [camera_x, camera_y]) {
    screen_x -= camera_x;
    screen_y -= camera_y;
    screen_x /= tile_width_step_main * 2;
    screen_y /= tile_height_step_main * 2;
    screen_y += 0.5;
    return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
  }


  sketch.cameraToWorldOffset = function([camera_x, camera_y]) {
    let world_x = camera_x / (tile_width_step_main * 2);
    let world_y = camera_y / (tile_height_step_main * 2);
    return { x: Math.round(world_x), y: Math.round(world_y) };
  }

  sketch.worldOffsetToCamera = function([world_x, world_y]) {
    let camera_x = world_x * (tile_width_step_main * 2);
    let camera_y = world_y * (tile_height_step_main * 2);
    return new p5.Vector(camera_x, camera_y);
  }

  sketch.preload = function() {
    if (window.p3_preload) {
      window.p3_preload();
    }
  }

  sketch.setup = function() {
    // let canvas = createCanvas(400, 400);
    // canvas.parent("container");

    camera_offset = new p5.Vector(-sketch.width / 2, sketch.height / 2);
    curr_offset = new p5.Vector(-sketch.width / 2, sketch.height / 2);
    camera_velocity = new p5.Vector(0, 0);

    if (window.p3_setup) {
      window.p3_setup();
    }

    let label = sketch.createP();
    label.html("World key: ");
    // label.parent("container");

    let input = sketch.createInput("xyzzy");
    input.parent(label);
    input.input(() => {
      sketch.rebuildWorld(input.value());
    });

    // sketch.createP("Arrow keys scroll. Clicking changes tiles.").parent("container");

    sketch.rebuildWorld(input.value());
  }

  sketch.rebuildWorld = function(key) {
    if (window.p3_worldKeyChanged) {
      window.p3_worldKeyChanged(key);
    }
    tile_width_step_main = window.p3_tileWidth ? window.p3_tileWidth() : 32;
    tile_height_step_main = window.p3_tileHeight ? window.p3_tileHeight() : 14.5;
    tile_columns = Math.ceil(sketch.width / (tile_width_step_main * 2));
    tile_rows = Math.ceil(sketch.height / (tile_height_step_main * 2));
  }

  sketch.mouseClicked = function() {
    let world_pos = sketch.screenToWorld(
      [0 - sketch.mouseX, sketch.mouseY],
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

  sketch.draw = function() {
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
    if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
      if (!isRight && !isDown && !isUp) {
        isLeft = true;
      }
      camera_velocity.x -= 1;
    }
    if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
      if (!isLeft && !isDown && !isUp) {
        isRight = true;
      }
      camera_velocity.x += 1;
    }
    if (sketch.keyIsDown(sketch.DOWN_ARROW)) {
      if (!isRight && !isLeft && !isUp) {
        isDown = true;
      }
      camera_velocity.y -= 1;
    }
    if (sketch.keyIsDown(sketch.UP_ARROW)) {
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

    let world_pos = sketch.screenToWorld(
      [0 - sketch.mouseX, sketch.mouseY],
      [camera_offset.x, camera_offset.y]
    );
    let world_offset = sketch.cameraToWorldOffset([camera_offset.x, camera_offset.y]);

    sketch.background(220);

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
        sketch.drawTile(sketch.tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
          camera_offset.x,
          camera_offset.y
        ]);
      }
    }

    sketch.describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

    
    
    if (window.p3_drawAfter) {
      window.p3_drawAfter();
    }
    
    var scale = .5;
    sketch.imageMode(sketch.CENTER);
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
      sketch.image(photo, 160, 160, scale*width, scale*photo.height*width/photo.width, 0, 0, photo.height, photo.height);
    } else {
      sketch.image(photo, 240, 160, scale*width, scale*photo.height*width/photo.width, 0, 0, photo.height, photo.height);
    }
    
  }

  // Display a discription of the tile at world_x, world_y.
  sketch.describeMouseTile = function([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = sketch.worldToScreen(
      [world_x, world_y],
      [camera_x, camera_y]
    );
    sketch.drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
  }


  sketch.drawTileDescription = function([world_x, world_y], [screen_x, screen_y]) {
    sketch.push();
    sketch.translate(screen_x, screen_y);
    if (window.p3_drawSelectedTile) {
      window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
    }
    sketch.pop();
  }


  // Draw a tile, mostly by calling the user's drawing code.
  sketch.drawTile = function([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = sketch.worldToScreen(
      [world_x, world_y],
      [camera_x, camera_y]
    );
    sketch.push();
    sketch.translate(0 - screen_x, screen_y);
    if (window.p3_drawTile) {
      window.p3_drawTile(world_x, world_y, -screen_x, screen_y);
    }
    sketch.pop();
  }

  let worldSeed;
  let tileSize = 40;
  let sprite;
  let clue_direction;
  let prints;


  sketch.p3_preload = function() {
    // TODO: change the path from glitch paths to file paths. 
    prints = [];
    prints[0] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/PrintBlack.png?v=1745888946785");
    prints[1] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/PrintWhite.png?v=1745888951295");
    
    sprite = [];
    sprite[0] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite1.png?v=1745889341227");
    sprite[1] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite2.png?v=1745889343751");
    sprite[2] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite3.png?v=1745889346312");
    sprite[3] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite4.png?v=1745889349199");
    sprite[4] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite5.PNG?v=1745892633671");
    sprite[5] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite6.PNG?v=1745892644390");
    sprite[6] = loadImage("https://cdn.glitch.global/03018c65-6849-45ac-a325-960f9694e186/sprite7.PNG?v=1745892648606");
  }

  sketch.p3_setup = function() {
    sketch.angleMode(sketch.DEGREES);
  }

  sketch.p3_worldKeyChanged = function(key) {
    worldSeed = XXH.h32(key, 0);
    noiseSeed(worldSeed);
    randomSeed(worldSeed);
    clue_direction = XXH.h32("Compass", worldSeed) % 8;
  }
  
  sketch.p3_tileWidth = function() {
    return 20;
  }

  sketch.p3_tileHeight = function() {
    return 20;
  }

  sketch.p3_drawBefore = function() {}

  sketch.p3_drawTile = function(i, j) {
    push();
    noFill();
    strokeWeight(2);

    // Consistent hashing for tile (i, j)
    let tileType = XXH.h32("tile:" + [i, j], worldSeed) % 2;
    
    if (i % 2 == 0) {
      if (tileType == 0) {
        tileType = 1;
      } else {
        tileType = 0;
      }
    }
    
    let tile = new Tile(i, j, tileType);
    

    if (tileType == 1) {
      if (i % 2 == 0) {
        tile.insideFillShape(tile.type);
      } else {
        tile.outsideFillShape(tile.type);
      }
    } else {
      if (i % 2 == 0) {
        tile.outsideFillShape(tile.type);
      } else {
        tile.insideFillShape(tile.type);
      }
    }
    if( XXH.h32("Compass" + [i, j], worldSeed) % 4 == 0 ){
      if(tileType == 1){
        image( prints[0] , 0, 0, p3_tileWidth(), p3_tileHeight());
      } else {
        image( prints[1] , 0, 0, p3_tileWidth(), p3_tileHeight());
      }
    }
    pop();
  }



}


// //(XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0)

// function p3_drawSelectedTile(i, j) {

// }

// function p3_drawAfter() {
  
// }









var myp5 = new p5(s, 'canvasContainerTwo');
