function Polygon(x, y, radius, num_sides, is_center) {
    this.x = x;
    this.y = y;
    this.pos = createVector(x, y);
    this.r = radius;
    this.max_r = random(radius, 2*radius);
    this.n = num_sides;
    this.vertices = [];
    var angle = TWO_PI / this.n;
    var circle_r = random(0, this.r/2);
    this.is_center = is_center;
    this.growing = true;
    var rotation = [0, .25, .5, .75, 1, 1.25, 1.5, 1.75, 2];
    this.count = 0;
    this.center_color = random(palette);
    this.second_color = random(palette);
    if (is_center){
        var offset = random(rotation) * angle;
        for (var a = offset; a < TWO_PI+offset; a += angle) {
            var sx = x + cos(a) * this.r;
            var sy = y + sin(a) * this.r;
            this.vertices.push(createVector(sx, sy));
        }
    } else {
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * this.r;
            var sy = y + sin(a) * this.r;
            this.vertices.push(createVector(sx, sy));
        }
    }


    this.display = function() {
        beginShape();
        for (var i = 0; i < this.vertices.length; i++){
            var vert = this.vertices[i];
            vertex(vert.x, vert.y);
        }
        endShape(CLOSE);
        if (this.is_center){
            for (i = 0; i < this.vertices.length; i++){
                vert = this.vertices[i];
                var d = vert.copy().sub(this.pos).normalize();
                if (this.pos.dist(vert) < 100){//random(50, 100)){
                    var v = vert.add(d.mult(this.r/2));
                    // inner lines
                    line(this.x, this.y, v.x, v.y); 
                } else if (frameCount < 100) {
                    var v = vert.copy().add(d.mult(frameCount));
                    // extending lines
                    line(this.x, this.y, v.x, v.y); 
                } else {
                    this.growing = false;
                }
            }
            ellipse(this.x, this.y, circle_r, circle_r);
        }         else if (this.count < random(50, 100)) {
            for (i = 0; i < this.vertices.length; i++){
                vert = this.vertices[i];
                var d = vert.copy().sub(this.pos).normalize();
                var v = vert.add(d.div(20));
            }
            this.count++;

        }
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
