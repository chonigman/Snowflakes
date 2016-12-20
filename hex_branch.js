function HexBranch(x, y) {

    this.x = x;
    this.y = y;
    this.pos = createVector(x, y);
    this.r = random(150, 250);
    this.n = 12;
    this.vertices = [];
    this.angle = TWO_PI / this.n;
    this.inner_r = random(0, this.r/8);
    this.growing = true;
    this.rotation = [0, .25, .5, .75, 1, 1.25, 1.5, 1.75, 2];
    this.count = 0;
    this.color = random(palette);
    this.offset = random(this.rotation) * this.angle;
    this.init = false;
    this.inner_shape = random(['circle', 'hex']);
    

    this.initialize = function(){
        for (var a = this.offset; a < TWO_PI+this.offset; a += this.angle) {
            var sx = x + cos(a) * this.r;
            var sy = y + sin(a) * this.r;
            this.vertices.push(createVector(sx, sy));
        }
        this.mid_points = []
            for (var i = 0; i < this.vertices.length; i++){
                if (i+1 < this.vertices.length){
                    mid_x = (this.vertices[i].x + this.vertices[i+1].x)/2;
                    mid_y = (this.vertices[i].y + this.vertices[i+1].y)/2;
                    mid = createVector(mid_x, mid_y);
                    this.mid_points.push(mid);
                } else {
                    mid_x = (this.vertices[i].x + this.vertices[0].x)/2;
                    mid_y = (this.vertices[i].y + this.vertices[0].y)/2;
                    mid = createVector(mid_x, mid_y);
                    this.mid_points.push(mid);
                }
            }
        if(this.inner_shape == 'hex'){
            this.center_verts = this.makePolygon(this.x, this.y, this.inner_r, 6);
        } else {
            this.center_verts = this.makePolygon(this.x, this.y, this.inner_r, 60);
        }
        this.init = true;
    }


    this.display = function() {
        stroke(this.color);
            for(i = 0; i < this.vertices.length; i++){
                if (this.pos.dist(this.vertices[i]) < 50){
                    this.growing = false;
                }
            }
            beginShape();
            for (var i = 0; i < this.vertices.length; i++){
                var vert = this.vertices[i];
                vertex(vert.x, vert.y);
            }
            for (i = 0; i < this.vertices.length; i++){
                vert = this.vertices[i];

                var d = vert.copy().sub(this.pos).normalize();
                //push();
                //translate(width/2, height/2);
                //vert.rotate(this.angle);
                if(this.growing){
                    // cascade hexes inward
                    //vert.sub(d.mult(5));
                }

                //pop();
                this.count++;
            }
            endShape(CLOSE);
            beginShape();
            for (i = 0; i < this.center_verts.length; i++){
                vert = this.center_verts[i];
                vertex(vert.x, vert.y);
            }
            endShape(CLOSE);
            // Draws lines between all points
            
            var all_verts = this.vertices.concat(this.mid_points);
            for(i = 0; i < all_verts.length; i++){
                for(var j = 0; j < all_verts.length; j++){
                    line(all_verts[i].x, all_verts[i].y, all_verts[j].x, all_verts[j].y);
                }
            }
            
            for(i = 1; i < this.vertices.length; i+=2){
                vert = this.vertices[i];
                var d = vert.copy().sub(this.pos).normalize();
                if (this.growing) vert.sub(d.mult(5));
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

    this.makePolygon = function(x, y, r, s){
        // x, y position, r radius, s num sides
        poly = [];
        var angle = TWO_PI / s;
        for (var a = this.offset; a < TWO_PI+this.offset; a += angle) {
            var sx = x + cos(a) * r;
            var sy = y + sin(a) * r;
            poly.push(createVector(sx, sy));
        }
        return poly;
    }
}
