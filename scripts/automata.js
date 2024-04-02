let strokeColor;
let palette;
let cellSize = 20;
let tapeLenght = 18;
let tape = [0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1];
let states = [0, 1]
let generationCount = 20;
let generations = [];
let input;

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent('automata');
  strokeColor = color(0, 0, 0, 255);
  input = createInput('');
  input.position(0, 100);
}

function draw() {
  clear()
  generations = []
  generations = calculate(tape, states, generations, generationCount)
  for (var t = 0; t < generationCount; t++) {
    for (var i = 0; i < tapeLenght; i++) {
      drawCell(generations[t][i],cellSize+i*cellSize*2, cellSize+cellSize*t*2, cellSize, color(255, 204, 0, 255));
    }
  }
}

function calculate(D,k,G,t,F = null){
  // D - aktualny stan taśmy
  // k - lista dostępnych stanów
  // G - wszystkie dotychczasowe stany taśmy (generacje)
  // t - aktualy czas (numer przejścia)
  // F - funkcja wyliczająca nowy stan
  if (F === null) return standardCalucation(D,k,G,t);
  var customFunction = new Function("D", "k", "G", "t", F);
  return customFunction(D,k,G,t);
}

function standardCalucation(D,k,G,t){
  let value = +input.value();
  return cellularAutomaton(value, D, t);
}

function cellularAutomaton(rule, initialState, generations) {
  console.log(rule)
  let automaton = [initialState.slice()];
  console.log(automaton)
  for (let gen = 0; gen < generations; gen++) {
      let currentState = automaton[gen];
      let newState = [];
      for (let i = 0; i < currentState.length; i++) {
          let neighborhood = [0, 0, 0];
          for (let j = -1; j <= 1; j++) {
              if (i + j >= 0 && i + j < currentState.length) {
                  neighborhood[j + 1] = currentState[i + j];
              }
          }
          newState.push((rule >> (neighborhood[0]*4 + neighborhood[1]*2 + neighborhood[2])) & 1);
      }
      automaton.push(newState);
  }
  return automaton;
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
    rect(x, y, size * 1.5, size * 1.5);
  }
}