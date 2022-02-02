// Canvas
let canvasSize = {x:800, y:800};
let nullColor = (25, 25, 25);

// Image 
let img;
let sourceImageStart = {x:1100, y:100};   // Getting only a part of the image
let sourceImageDrawSize = {x:800, y:800};

// Game
let tileDivisions = {x:5, y:3};
let tileSize = {x:sourceImageDrawSize.x/tileDivisions.x, y: sourceImageDrawSize.y/tileDivisions.y};
let tilePosition = [];
let scrambleTimes = 50;                   // How many scrambles
let numberMoves = 0;

function preload() {
  img = loadImage('Images/Gandalf.jpg');
}

function setup(){
  createCanvas(canvasSize.x, canvasSize.y);

  // Correspondance between tile number and initial position on image to draw
  for(let i = 0; i < tileDivisions.y; i++){
    tilePosition[i] = [];
    for(let j = 0; j < tileDivisions.x; j++){
      tilePosition[i][j] = {x: j*tileSize.x, y: i*tileSize.y};
    }
  }

  // Setting up one blanck tile - for movement
  tilePosition[tileDivisions.y - 1][tileDivisions.x - 1] = {x: null, y: null};

  // Scrambling the tiles n times
  scrambleTiles(tilePosition, scrambleTimes);
}

function draw(){
  background(nullColor);

  // Tiles
  for(let i = 0; i < tileDivisions.y; i++){  
    for(let j = 0; j < tileDivisions.x; j++){ 
      if(tilePosition[i][j].x != null){
        let dest = {x: j*tileSize.x, y: i*tileSize.y};
        image(img, dest.x, dest.y, tileSize.x, tileSize.y, tilePosition[i][j].x + sourceImageStart.x, tilePosition[i][j].y + sourceImageStart.y, tileSize.x, tileSize.y); 
      }
    }    
  }

  // Outlines
  noFill();
  strokeWeight(2);
  for(let i = 0; i < tileDivisions.y; i++){  
    for(let j = 0; j < tileDivisions.x; j++){ 
      rect(tilePosition[i][j].x, tilePosition[i][j].y, tileSize.x, tileSize.y);
    }
  }
}

function mouseClicked() {

  for(let i = 0; i < tileDivisions.y; i++){  
    for(let j = 0; j < tileDivisions.x; j++){ 
      let dest = {x: j*tileSize.x, y: i*tileSize.y};

      // Colision
      if(mouseX >= dest.x && mouseX < (dest.x + tileSize.x) && mouseY >= dest.y && mouseY < (dest.y + tileSize.y)){

        // If null on left
        if(j > 0 && tilePosition[i][j-1].x == null){
          swapNull(i, j, i, j-1);
        }
        // If null on right
        else if(j < (tileDivisions.x - 1) && tilePosition[i][j+1].x == null){
          swapNull(i, j, i, j+1);
        }
        // If null on top
        else if(i > 0 && tilePosition[i-1][j].x == null){
          swapNull(i, j, i-1, j);
        }
        // If null on bottom
        else if(i < (tileDivisions.y - 1) && tilePosition[i+1][j].x == null){
          swapNull(i, j, i+1, j);
        }

      }
    }
  }

  checkWin();

}

function checkWin(){
  for(let i = 0; i < tileDivisions.y; i++){
    for(let j = 0; j < tileDivisions.x; j++){
      if(tilePosition[i][j].x != null){
        if(tilePosition[i][j].x != j*tileSize.x || tilePosition[i][j].y != i*tileSize.y){
          return 0;
        }
      }
    }
  }

  textSize(72);
  fill(255, 225, 0);
  text('YOU WON!', canvasSize.x/2 - 150, canvasSize.y/2);

  textSize(48);
  text('It took you ' + (numberMoves - scrambleTimes) + ' moves!', canvasSize.x/2 - 175, canvasSize.y/2 + 150);
  
  noLoop();
  stop();
}

// Swaps a tile with the null 
function swapNull(tileI, tileJ, nullI, nullJ){
  let temp = tilePosition[tileI][tileJ];
  tilePosition[nullI][nullJ] = temp;
  tilePosition[tileI][tileJ] = {x: null, y: null};
  numberMoves++;
}

// Scrambles all the tiles n times
function scrambleTiles(tilePos, n = 1){
  for(let s = 0; s < n; s++){
    let moveOptions = [];
    let nullPos;

    for(let i = 0; i < tileDivisions.y; i++){
      for(let j = 0; j < tileDivisions.x; j++){
        // Finding the null tile
        if(tilePos[i][j].x == null){
          nullPos = {nullI:i, nullJ:j};

          // Appending movement options
          if(i > 0)                     moveOptions.push({tileI:i-1, tileJ:j});
          if(i < (tileDivisions.y - 1)) moveOptions.push({tileI:i+1, tileJ:j});
          if(j > 0)                     moveOptions.push({tileI:i,   tileJ:j-1});
          if(j < (tileDivisions.x - 1)) moveOptions.push({tileI:i,   tileJ:j+1});
        }
      }
    }

    // scrambling
  
    let chosen = random(moveOptions);
    swapNull(chosen.tileI, chosen.tileJ, nullPos.nullI, nullPos.nullJ);
  }
}