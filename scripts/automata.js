function setup() {
  // Create canvas and set its size
  const canvas = createCanvas(400, 400);
  // Move the canvas inside the div with id 'p5-sketch'
  canvas.parent('p5-sketch');
}

function draw() {
  // Set background color
  background(220);
  
  // Draw a simple shape (e.g., ellipse)
  ellipse(width/2, height/2, 50, 50);
}