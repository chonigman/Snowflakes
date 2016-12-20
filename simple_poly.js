function SimplePoly(pos, radius, num_sides) {
    this.pos = pos; 
    this.r = radius;
    this.n = num_sides;
    this.vertices = [];
    var angle = TWO_PI / this.n;
    var circle_r = random(0, this.r/2);
    this.growing = true;
    var rotation = [0, .25, .5, .75, 1, 1.25, 1.5, 1.75, 2];
    this.count = 0;
    //this.center_color = random(palette);
    //this.second_color = random(palette);
    //this.ext_points = [];
    //var offset = random(rotation) * angle;
    var offset = 0;
    for (var a = offset; a < TWO_PI+offset; a += angle) {
        var sx = pos.x + cos(a) * this.r;
        var sy = pos.y + sin(a) * this.r;
        this.vertices.push(createVector(sx, sy));
    }


    this.display = function() {
        //stroke(255, 0, 0);
        beginShape();
        for (var i = 0; i < this.vertices.length; i++){
            var vert = this.vertices[i];
            vertex(vert.x, vert.y);
        }
        endShape(CLOSE);
    }

    this.getVertices = function(){
        return this.vertices;
    }

    this.getCenter = function(){
        return this.pos;
    }

    this.getRadius = function(){
        return this.r;
    }
}
