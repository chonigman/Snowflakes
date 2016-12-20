var palette;
var bg_color;
var s_color;
var X_AXIS = 0;
var Y_AXIS = 1;
var center_radius;
var center;
var flakes;
var startup;
var flake_count = 0;
var branch_flakes = [];
var bf_sides; 


function setup() {
    //randomSeed(20);
    createCanvas(720, 720);
    palette = loadPalette();
    color1 = random(palette);
    color2 = random(palette);
    s_color = random(palette);
    linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
    center_radius = int(random(width*.01, width *.05));
    center = new Polygon(width/2, height/2, center_radius, 6, true);
    //center = new StarFlake(width/2, height/2);
    //center.initialize();
    flakes = makeFlakes(center, center_radius);
    startup = true;
    stroke_color = color(red(s_color), green(s_color), blue(s_color), 50);
    bf_sides = random([3, 4, 5, 6, 7]);
    //frameRate(10);
}

function draw() {
    //linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
    noFill();

    center.display();
    stroke(stroke_color);
    if(center.growing == false){
        for(let f of flakes){
            //f.display();
        }
        for(let bf of branch_flakes){

            bf.display();
        }
        if (flake_count < 250){
            var c = random(center.ext_points);
            var d = center.pos.dist(c);
            var scale = (1-d)/200;
            var new_flake = new SimplePoly(c, scale * 50, bf_sides, random([true, false]));
            branch_flakes.push(new_flake);
            flake_count++;
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
        for(i = x; i <= x + w; i++){
            inter = map(i, x, x + w, 0, 1);
            c = lerpColor(c1, c2, inter);
            stroke(c);
            line(i, y, i, y + h);
        }
    }

}

function makeFlakes(center, center_radius){
    var polys = [];
    var vertices = center.getVertices();
    var r = random(10, center_radius-5);
    var sides = random([3, 5, 6]);
    var grow_flakes = random([false, true]);
    for(var i = 0; i < 6; i++){
        var vert = vertices[i];
        var p = new Polygon(vert.x, vert.y, r, sides, grow_flakes);
        polys.push(p);
    }
    startup = false;
    return polys;
}
