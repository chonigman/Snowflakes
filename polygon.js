function Polygon(x, y, radius, num_sides) {
  this.x = x;
  this.y = y;
  this.pos = createVector(x, y);
  this.r = radius;
  this.max_r = random(radius, 10*radius);
  this.n = num_sides;
  this.vertices = [];
  var angle = TWO_PI / this.n;
  var offset = random([0, .25, .5, .75, 1, 1.25, 1.5, 1.75, 2]) * angle;
  for (var a = offset; a < TWO_PI+offset; a += angle) {
    var sx = x + cos(a) * this.r;
    var sy = y + sin(a) * this.r;
    this.vertices.push(createVector(sx, sy));
  }
  var circle_r = random(0, this.r/2);

  this.draw = function() {

    beginShape();
    for (let vert of vertices){
      vertex(vert.x, vert.y);
    }
    endShape(CLOSE);

    for (let vert of vertices){
        var d = vert.copy().sub(this.pos).normalize();
        var v = vert.add(d.mult(10));
        line(this.x, this.y, v.x, v.y); 
    }
    
    ellipse(this.x, this.y, circle_r, circle_r);
  }

}
