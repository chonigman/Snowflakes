var palette;
var bg_color;
var s_color;
var X_AXIS = 0;
var Y_AXIS = 1;
var center_radius;
var center;
var flakes;
var startup;


function setup() {
    randomSeed(20);
    createCanvas(720, 720);
    palette = loadPalette();
    color1 = random(palette);
    color2 = random(palette);
    s_color = random(palette);
    linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
    center_radius = int(random(width*.01, width *.05));
    center = new Polygon(width/2, height/2, center_radius, 6, true);
    flakes = makeFlakes(center, center_radius);
    startup = true;
    stroke_color = color(red(s_color), green(s_color), blue(s_color), 50);
    //frameRate(10);
}

function draw() {
    noFill();

    center.display();
    stroke(stroke_color);
    if(center.growing == false){
        for(let f of flakes){
            f.display();
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
    for(var i = 0; i < 6; i++){
        var vert = vertices[i];
        var p = new Polygon(vert.x, vert.y, r, sides, false);
        polys.push(p);
    }
    startup = false;
    return polys;
}
