function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
}

function draw() {
  r=random(255);
  g=random(255);
  b=random(255);
  fill(r,g,b);
  s=random(100)+50;
  circle(mouseX,mouseY,s);
}
