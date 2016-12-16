var palette;
var bg_color;
var X_AXIS = 0;
var Y_AXIS = 1;
var theta = 1;

var shapes = [];
var agents = [];

function setup() {
  createCanvas(720, 720);
  palette = loadPalette();
  color1 = random(palette);
  color2 = random(palette);
  //linearGradient(0, 0, width, height, color1, color2, Y_AXIS);

  for(var i = 0; i < 6; i++) {
    shapes[i] = new Flake(0, 0, 10);
  }

  background(100);
  stroke(255);
  translate(width/2, height/2);
  ellipse(0, 0, 3, 3);
}

function draw() {
  translate(width/2, height/2);
  for(var i = 0; i < 6; i++) {
    push();
    rotate((PI/3) * i);
    shapes[i].update();
    shapes[i].display();
    pop();
  }

  for(var i = 0; i < agents.length; i++) {
    agents[i].update();
    agents[i].display();
  }
}




function linearGradient(x, y, w, h, c1, c2, axis){
  noFill();
  if (axis == Y_AXIS){
    for (var i = y; i <= y + h; i++){
      var inter = map(i, y, y + h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis == X_AXIS){
    for(var i = x; i <= x + w; i++){
      var inter = map(i, x, x + w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
  
}

