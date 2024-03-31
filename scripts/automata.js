let strokeColor;
let palette;
let cellSize = 20;
let tapeLenght = 8;
let tape = [0, 1, 0, 1, 0, 0, 1, 1];
let timeLenght = 10;
let time;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('automata');
  strokeColor = color(0, 0, 0, 255);
  cellSize = 20;
  tapeLenght = 8;
}

function draw() {
  for (var t = 0; t < timeLenght; t++) {
    timeRow = []
    for (var i = 0; i < tapeLenght; i++) {
      timeRow = []
      drawCell(tape[i],cellSize+i*cellSize*2, cellSize+cellSize*t*2, cellSize, color(255, 204, 0, 255));
    }
    time.push(timeRow)
  }
}

function calculate(D,k,T,F = null){
  if (F === null) return standardCalucation(D,k);
  var customFunction = new Function("D", "k", "T", F);
  return customFunction(D,k,T);
}

function standardCalucation(D,k){

}

function drawCell(v, x, y, size, color){
  strokeWeight(2);
  stroke(strokeColor);
  
  rectMode(RADIUS);
  noFill();
  rect(x, y, size, size);
  if (v > 0){
    rectMode(CENTER);
    fill(color);
    rect(x, y, size*1.5, size*1.5);
  }
}