function Polygon(x, y, radius, num_sides) {
  this.x = x;
  this.y = y;
  this.r = radius;
  this.n = num_sides;
  this.vertices = [];
  var angle = TWO_PI / this.n;
  var offset = random([0, .25, .5, .75, 1, 1.25, 1.5, 1.75, 2]) * angle;
  for (var a = offset; a < TWO_PI+offset; a += angle) {
    var sx = x + cos(a) * this.r;
    var sy = y + sin(a) * this.r;
    this.vertices.push({'x': sx, 'y': sy});
  }

  this.draw = function() {
    beginShape();
    for (var i = 0; i < this.vertices.length; i++){
      vertex(this.vertices[i]['x'], this.vertices[i]['y']);
    }
    endShape(CLOSE);
  }

}