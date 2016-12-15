var palette;
var bg_color;
var X_AXIS = 0;
var Y_AXIS = 1;
var center_radius;
var center;
function setup() {
  createCanvas(720, 720);
  palette = loadPalette();
  color1 = random(palette);
  color2 = random(palette);
  linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
  center_radius = int(random(0, width*.25));
  center = Polygon(width/2, height/2, center_radius, 6);
}

function draw() {
  //background(bg_color);
  stroke(255);
  noFill();
  center.draw();
  //drawCircle(width / 2, height / 2, 300);

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
