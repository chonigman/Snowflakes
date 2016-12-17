var palette;
var bg_color;
var X_AXIS = 0;
var Y_AXIS = 1;
var theta = 1;
var num_points = 6;

var shapes = [];
var agents = [];

function setup() {
  createCanvas(720, 720);
  palette = loadPalette();
  color1 = random(palette);
  color2 = random(palette);
  //linearGradient(0, 0, width, height, color1, color2, Y_AXIS);

  for(var i = 0; i < num_points; i++) {
    shapes[i] = new Flake(0, 0, 10);
  }

  background(100);
  stroke(255);
  translate(width/2, height/2);
  ellipse(0, 0, 3, 3);

  for(var i = 0; i < num_points; i++) {
    push();
    rotate((PI/(num_points/2)) * i);
    shapes[i].update();
    shapes[i].display();
    pop();
  }

  addAgents(1);
  background(100);
}

function draw() {
  for(var i = 0; i < agents.length; i++) {
    agents[i].update();
    agents[i].display();
  }
}

//likelyhood per white pixel that we will drop an agent (as a decimal)
function addAgents(prob_per_pix) {
  loadPixels();
  for(var i = 0; i < width; i++) {
    for(var j = 0; j < height; j++) {
      if (get(i, j)[0] === 255) {
        if(Math.random() < prob_per_pix) {
          var lifespan = map(dist(i, j, width/2, height/2), 0, dist(0, 0, width/2, height/2)/2, 50, 10);
          agents.push(new Agent(i, j, lifespan));
        }
      }
    }
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

