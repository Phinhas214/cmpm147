// sketch.js - A generative context-based map creator that stores map values in the form of a string-grid
// Author: Campbell Hunter and Phineas Asmelash
// Date: 04/21/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

/* exported */

/* global */

// Globals
let myInstance;
let canvasContainer;
let canvasContainerTwo;
var centerHorz, centerVert;

let seed = 0;
let tilesetImage;
let currentGrid = [];
let currentGridOverworld = [];
let numRows, numCols, numColsTwo, numRowsTwo = 20;

function generateGrid(numCols, numRows) {
  //console.log("Hi!");
  let grid = [];
  let topX = floor(random() * (numCols / 3));
  let topY = floor(random() * (numRows / 3));
  let bottomX = floor(random() * (numCols / 3) + (numCols * 2) / 3);
  let bottomY = floor(random() * (numRows / 3) + (numRows * 2) / 3);
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      if (i > topY && i < bottomY && j > topX && j < bottomX) {
        let val = random();
        if (val < 0.01) {
          row.push("C");
        } else if (val < 0.025) {
          row.push("G");
        } else {
          row.push("_");
        }
      } else {
        row.push("-");
      }
    }
    grid.push(row);
  }
  
  for (let num = 0; num < floor(random(10)); num++) {
    //console.log(num);
    let boxX = floor(random() * (numCols * 0.8) + 1);
    let boxY = floor(random() * (numCols * 0.8) + 1);
    let boxLength = floor(random(10) + 3);
    let boxHeight = floor(random(10) + 3);
    
    for (let i = 1; i < numRows - 1; i++) {
      for (let j = 1; j < numCols - 1; j++) {
        if (i > boxY && i < (boxY + boxHeight) && j > boxX && j < (boxX + boxLength)) {
          grid[i][j] = '_'
        }
      }
    }
    
    if ((boxX >= bottomX) || (boxY >= bottomY) || ((boxX + boxLength) <= topX) || (boxY + boxHeight) <= topY) {
      //console.log(num);
      let mainCenterX = bottomX - topX;
      let mainCenterY = bottomY - topY;
      let boxCenterX = boxX + floor(boxLength / 2);
      let boxCenterY = boxY + floor(boxHeight / 2);
      
      if (boxCenterX > grid[0].length) {
        boxCenterX = grid[0].length - 2;
      }
      
      if (boxCenterY > grid.length) {
        boxCenterY = grid.length - 2;
      }
      
      if (mainCenterY >= boxCenterY) {
        for (let i = 0; i <= (mainCenterY - boxCenterY); i++) {
          grid[boxCenterY + i][boxCenterX] = '+';
          grid[boxCenterY + i][boxCenterX - 1] = '_';
        }
      } else {
        for (let i = 0; i <= (boxCenterY - mainCenterY); i++) {
          grid[boxCenterY - i][boxCenterX] = '+';
          grid[boxCenterY - i][boxCenterX - 1] = '_';
        }
      }
      
      if (mainCenterX >= boxCenterX) {
        for (let i = 0; i <= (mainCenterX - boxCenterX); i++) {
          grid[mainCenterY][boxCenterX + i] = '+';
          grid[mainCenterY - 1][boxCenterX + i] = '_';
        }
      } else {
        for (let i = 0; i <= (boxCenterX - mainCenterX); i++) {
          grid[mainCenterY][boxCenterX - i] = '+';
          grid[mainCenterY - 1][boxCenterX - i] = '_';
        }
      }
    }
  }

  return grid;
}

function gridCheck(grid, i, j, target) {
  if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) {
    return false;
  } else {
    if (grid[i][j] == target) {
      return true;
    } else {
      return false;
    }
  }
}

function gridCode(grid, i, j, target) {
  let north = gridCheck(grid, i - 1, j, target);
  let south = gridCheck(grid, i + 1, j, target);
  let east = gridCheck(grid, i, j + 1, target);
  let west = gridCheck(grid, i, j - 1, target);

  return ((north << (0)) + (south << (1)) + (east << (2)) + (west << 3));
}
//

function generateGridOverworld(numCols, numRows) {
  let grid = [];
  
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let noiseValue = noise(i/8, j/7);
      if(.10 <= noiseValue && noiseValue < .40){
        row.push("W");
      } else if(.45 <= noiseValue  && noiseValue < .52) {
        row.push("F");
      } else if (.70 <= noiseValue && noiseValue < .72){
        row.push("H");
      } else {
        row.push("_");
      }
    }
    grid.push(row);
  } 
  return grid;
}

function regenerateGridOverworld() {
  select("#asciiBoxTwo").value(gridToString(generateGridOverworld(numCols, numRows)));
  reparseGridOverworld();
}

function reparseGridOverworld() {
  currentGridOverworld = stringToGrid(select("#asciiBoxTwo").value());
}

//
function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
  regenerateGridOverworld();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  numColsTwo = select("#asciiBoxTwo").attribute("rows") | 0;
  numRowsTwo = select("#asciiBoxTwo").attribute("cols") | 0;

  //canvas.parent("canvasContainerTwo");
  //select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  //select("canvasContainerTwo").elt.getContext("2d").imageSmoothingEnabled = false;
  
  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  select("#asciiBoxTwo").input(reparseGridOverworld);

  reseed();
}

function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
  drawGridOverworld(currentGridOverworld);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function drawContext(grid, i, j, target, ti, tj) {
  let codeOne = gridCode(grid, i, j, target);
  let codeTwo = gridCode(grid, i, j, '+');
  
  let code = codeOne | codeTwo;
  //console.log(code);
  const [tiOffset, tjOffset] = lookup[code];
  
  if (gridCheck(grid, i , j, target)) {
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  } else if (gridCheck(grid, i , j, "+")) {
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  } else{
    placeTile(i, j, floor(random(4)), 16);
  }
}

const lookup = [
  [0, 16],
  [0, 16],
  [0, 16],
  [0, 16],
  [0, 16],
  [5, 23],
  [5, 21],
  [5, 22],
  [0, 16],
  [7, 23],
  [7, 21],
  [7, 22],
  [0, 16],
  [6, 23],
  [6, 21],
  [0, 16],
];

function drawGrid(grid) {
  canvas.parent("canvasContainer");
  background(128);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, '_') || gridCheck(grid, i, j, '=')) {
        placeTile(i, j, floor(random(4)) + 11, floor(random(4)) + 21);
      } 
      if (gridCheck(grid, i, j, '+')) {
        placeTile(i, j, floor(random(4)) + 11, 22);
      } 
      if (((gridCode(grid, i, j, '_') | (gridCode(grid, i, j, '+'))) != 15) || gridCheck(grid, i, j, '-')){
        drawContext(grid, i, j, '_', 0, 0);
      } else {
        let val = random();
        if (val < 0.01) {
          placeTile(i, j, floor(random(3) + 3), floor(random(3) + 28))
        } else if (val < 0.025) {
          placeTile(i, j, 26, floor(random(4)))
        }
      }
    }
  }
}

//

function drawGridOverworld(grid) {
  canvas.parent("canvasContainerTwo");
  background(128);
  const tileStyles = {
    'W': [waterLookup],
    'F': [groundLookup, forestLookup],
    'H': [groundLookup, houseLookup],
    '_': [groundLookup, waterEdgeLookup],
  };

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(tileStyles[grid[i][j]]){
        tileStyles[grid[i][j]].forEach(lookup => {
          drawContextOverworld(grid, i, j, grid[i][j], 0, 0, lookup);
        });
      } else {
        placeTile(i, j, (floor(random(4))),0);
      }
    }
  }
  
  // drawClouds(grid);

}

function drawContextOverworld(grid, i, j, target, dti, dtj, lookupTable) {
  //get the code for this location and target.
  //Use the code as an array index to get a pair of tile offset
  const tileCode = gridCode(grid, i, j, target);
  const tileOffset = lookupTable[tileCode];
  
  if (tileOffset) {
    const offsetI = tileOffset[0];
    const offsetJ = tileOffset[1];
    placeTile(i, j, offsetI + dti, offsetJ + dtj)
  }
}

const groundLookup = [
  [1,12], // 0000 - isolated
  [5,14], // 0001 - N only
  [5,12], // 0010 - S only
  [4,13], // NS
  [1,12], // E only
  [4,14], // N+E
  [4,12], // S+E
  [4,13], // NSE
  [1,12], // W only
  [8,12], // N+W
  [6,12], // S+W
  [6,13], // NSW
  [1,12], // E+W
  [5,14], // N+E+W
  [5,12], // S+E+W
  [1,12], // NSEW - full surround
];

const houseLookup = [
  [26,0], // 0000 - isolated
  [26,1], // 0001 - N only
  [26,2], // 0010 - S only
  [0,0], // NS
  [26,3], // E only
  [0,0], // N+E
  [0,0], // S+E
  [0,0], // NSE
  [26,0], // W only
  [0,0], // N+W
  [0,0], // S+W
  [0,0], // NSW
  [0,0], // E+W
  [0,0], // N+E+W
  [0,0], // S+E+W
  [0,0], // NSEW - full surround
]

const forestLookup = [
  [14,6], // 0000 - isolated
  [16,2], // 0001 - N only
  [14,0], // 0010 - S only
  [15, 6], // NS
  [15,2], // E only
  [15,2], // N+E
  [15,6], // S+E
  [15,1], // NSE
  [15,8], // W only
  [17,2], // N+W
  [17,0], // S+W
  [17,7], // NSW
  [16, 2], // E+W
  [16, 2], // N+E+W
  [16, 0], // S+E+W
  [16,6], // NSEW - full surround
];


const waterLookup = [
  [1,14], // 0000 - isolated
  [1,14], // 0001 - N only
  [1,14], // 0010 - S only
  [1,14], // NS
  [1,14], // E only
  [1,14], // N+E
  [1,14], // S+E
  [1,14], // NSE
  [1,14], // W only
  [1,14], // N+W
  [1,14], // S+W
  [1,14], // NSW
  [1,14], // E+W
  [1,14], // N+E+W
  [1,14], // S+E+W
  [1,14], // NSEW - full surround
]

const waterEdgeLookup = [
  [1,12], // 0000 - isolated
  [5,14], // 0001 - N only
  [5,12], // 0010 - S only
  [4,13], // NS
  [1,12], // E only
  [4,14], // N+E
  [4,12], // S+E
  [4,13], // NSE
  [1,12], // W only
  [8,12], // N+W
  [6,12], // S+W
  [6,13], // NSW
  [1,12], // E+W
  [5,14], // N+E+W
  [5,12], // S+E+W
  [1,12], // NSEW - full surround
]

//

var s = function( sketch ) {
  sketch.setup = function() {
    sketch.createCanvas(320, 320);
    sketch.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  };

  sketch.draw = function() {
    sketch.randomSeed(seed);
    sketch.drawGrid(currentGrid);
  };
  
  sketch.placeTile = function(i, j, ti, tj) {
    sketch.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }

  sketch.drawContext = function(grid, i, j, target, ti, tj) {
    let codeOne = gridCode(grid, i, j, target);
    let codeTwo = gridCode(grid, i, j, '+');
    let codeThree = gridCode(grid, i, j, 'C');
    let codeFour = gridCode(grid, i, j, 'G');
    
    let code = codeOne | codeTwo | codeThree | codeFour;
    //console.log(code);
    const [tiOffset, tjOffset] = lookup[code];
    
    if (gridCheck(grid, i , j, target)) {
      sketch.placeTile(i, j, ti + tiOffset, tj + tjOffset);
    } else if (gridCheck(grid, i , j, "+")) {
      sketch.placeTile(i, j, ti + tiOffset, tj + tjOffset);
    } else if (gridCheck(grid, i , j, "C")) {
      sketch.placeTile(i, j, ti + tiOffset, tj + tjOffset);
    } else if (gridCheck(grid, i , j, "G")) {
      sketch.placeTile(i, j, ti + tiOffset, tj + tjOffset);
    } else{
      sketch.placeTile(i, j, sketch.floor(sketch.random(4)), 16);
    }
  }
  
  sketch.drawGrid = function(grid) {
    sketch.background(128);
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid, i, j, '_') || gridCheck(grid, i, j, '=') || gridCheck(grid, i, j, 'C') || gridCheck(grid, i, j, 'G')) {
          sketch.placeTile(i, j, floor(sketch.random(4)) + 11, floor(sketch.random(4)) + 21);
        } 
        if (gridCheck(grid, i, j, '+')) {
          sketch.placeTile(i, j, floor(sketch.random(4)) + 11, 22);
        } 
        if (((gridCode(grid, i, j, '_') | (gridCode(grid, i, j, '+')) | (gridCode(grid, i, j, 'C')) | (gridCode(grid, i, j, 'G'))) != 15) || gridCheck(grid, i, j, '-')){
          sketch.drawContext(grid, i, j, '_', 0, 0);
          if (gridCheck(grid, i, j, 'C') || gridCheck(grid, i, j, 'G')) {
            currentGrid[i][j] = '_';
            regenerateGridOverworld();
          }
        } else if (gridCheck(grid, i, j, 'C')) {
          sketch.placeTile(i, j, floor(sketch.random(3) + 3), floor(sketch.random(3) + 28));
        } else if (gridCheck(grid, i, j, 'G')) {
          sketch.placeTile(i, j, 26, floor(sketch.random(4)));
        }
      }
    }
  }
};

var myp5_1 = new p5(s, 'canvasContainer');



var s2 = function( sketch ) {
  sketch.setup = function() {
    sketch.createCanvas(320, 320);
    sketch.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  };

  sketch.draw = function() {
    sketch.randomSeed(seed);
    sketch.drawGridOverworld(currentGridOverworld);
  };

  sketch.placeTile = function(i, j, ti, tj) {
    sketch.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }

  sketch.drawGridOverworld = function(grid) {
    sketch.background(128);
    const tileStyles = {
      'W': [waterLookup],
      'F': [groundLookup, forestLookup],
      'H': [groundLookup, houseLookup],
      '_': [groundLookup, waterEdgeLookup],
    };
  
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if(tileStyles[grid[i][j]]){
          tileStyles[grid[i][j]].forEach(lookup => {
            sketch.drawContextOverworld(grid, i, j, grid[i][j], 0, 0, lookup);
          });
        } else {
          sketch.placeTile(i, j, (sketch.floor(sketch.random(4))),0);
        }
      }
    }
    
    // drawClouds(grid);
  
  }
  
  sketch.drawContextOverworld = function(grid, i, j, target, dti, dtj, lookupTable) {
    //get the code for this location and target.
    //Use the code as an array index to get a pair of tile offset
    const tileCode = gridCode(grid, i, j, target);
    const tileOffset = lookupTable[tileCode];
    
    if (tileOffset) {
      const offsetI = tileOffset[0];
      const offsetJ = tileOffset[1];
      sketch.placeTile(i, j, offsetI + dti, offsetJ + dtj)
    }
  }
};

var myp5_2 = new p5(s2, 'canvasContainerTwo');