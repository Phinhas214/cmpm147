/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
  return [
    {
      name: "freedom", 
      assetUrl: "img/freedom.jpg",
      credit: "Attack on Titan Chapter 131, Hajime Isayama, 2020",
      style: "circles"
    },
    {
      name: "stargate", 
      assetUrl: "img/stargate.jpg",
      credit: "Expeditioner's Joklumarkar-Aethergate, Hypergryph, 2023",
      style: "lines"
    },
    {
      name: "hindenburg", 
      assetUrl: "img/hindenburg.jpg",
      credit: "Zeppelin-ramp de Hindenburg / Hindenburg zeppelin disaster, Sam Shere, 1937",
      style: "triangles"
    },
    {
      name: "yin-yang", 
      assetUrl: "img/yin-and-yang-145874_960_720.png",
      credit: "Yin and Yang",
      style: "circles"
    }
  ];
}

function initDesign(inspiration) {
  //set the canvas size based on the container
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${width}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);

  
  let design = {
    bg: 128,
    fg: []
  }
  if(inspiration.style == "circles"){
    for(let i = 0; i < 500; i++) {
    design.fg.push({x: random(width),
                    y: random(height),
                    d: random(width/5),
                    fill: random(255)})
    }
  } else if (inspiration.style == "triangles"){
    for(let i = 0; i < 500; i++) {
    design.fg.push({bg: 0,
                    x: random(width),
                    y: random(height),
                    w: random(width/10),
                    h: random(height/3),
                    r1: random(width/20) - (width/40),
                    r2: random(width/20) - (width/40),
                    r3: random(width/20) - (width/40),
                    fill: random(255)})
    }
  } else {
    inspiration.image.loadPixels();
    for(let i = 0; i < 2000; i++) {
        let tempx = random(width);
        let tempy = random(height);
        temperx = map(tempx, 0, width, 0, inspiration.image.width);
        tempery = map(tempy, 0, height, 0, inspiration.image.height);
        design.fg.push({x: tempx,
                    y: tempy,
                    l: random(-(tempx - width/10), tempx + width/10),
                    h: random(-(tempy - height/10), tempy + height/10),
                    fill : inspiration.image.get(temperx, tempery)})
                }
  }
  
  return design;
}

function renderDesign(design, inspiration) {
  
  background(design.bg);
  if(inspiration.style == "circles"){
    noStroke();
    for(let box of design.fg) {
        fill(box.fill, 128);
        circle(box.x, box.y, box.d);
    }
  } else if (inspiration.style == "triangles"){
    noStroke();
    for(let box of design.fg) {
        fill(box.fill, 128);
        triangle(box.x + box.r1, box.y + box.r1, box.x + box.w/2 + box.r2,box.y - box.h + box.r2, box.x + box.w + box.r3, box.y + box.r3);
    }
  } else {
    strokeWeight(3);
    for(let box of design.fg) {
        stroke(box.fill);
        line(box.x, box.y, box.x + box.l, box.y + box.h);
    }
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  
  
  if(inspiration.style == "circles"){
    for(let box of design.fg) {
        box.fill = mut(box.fill, 0, 255, rate);
        box.x = mut(box.x, 0, width, rate);
        box.y = mut(box.y, 0, height, rate);
        box.d = mut(box.d, 0, width/5, rate);
  }
  } else if (inspiration.style == "triangles"){
        for(let box of design.fg) {
            box.fill = mut(box.fill, 0, 255, rate);
            box.x = mut(box.x, 0, width, rate);
            box.y = mut(box.y, 0, height, rate);
            box.w = mut(box.w, 0, width/2, rate);
            box.h = mut(box.h, 0, height/2, rate);
            box.r1 = mut(box.r1, 0, height/20, rate);
            box.r2 = mut(box.r2, 0, height/20, rate);
            box.r3 = mut(box.r3, 0, height/20, rate);
      }
  } else {
        inspiration.image.loadPixels();
        for(let box of design.fg) {
            let tempx = mut(box.x, 0, width, rate);
            let tempy = mut(box.y, 0, height, rate);
            box.x = tempx;
            box.y = tempy;
            box.l = mut(box.l, -width/10, width/10, rate);
            box.h = mut(box.h, -height/10, height/10, rate);

            tempx = map(tempx, 0, width, 0, inspiration.image.width);
            tempy = map(tempy, 0, height, 0, inspiration.image.height);
            box.fill = inspiration.image.get(tempx, tempy);
    }
  }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}