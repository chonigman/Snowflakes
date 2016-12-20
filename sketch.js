var palette;
var bg_color;
var X_AXIS = 0;
var Y_AXIS = 1;
var center_radius;
var center;
var angle; 
var clickList = [];
var clickMove = [];
var clickStart = null;
var clickEnd = null;
var rot = 0;
var pos;
var sides = 6;
var angles = [];

function setup() {
  createCanvas(720, 720);
  palette = loadPalette();
  randomSeed(13);
  color1 = random(palette);
  color2 = random(palette);
  color3 = random(palette);
  linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
  center_radius = int(random(0, width*.25));
  angleMode(DEGREES);
  angle = 360/sides; 
  for(var i = 0; i < sides; i++){
    angles.push(i*angle);
  }
  rot = 0;
  pos = createVector(width/2, height/2);
  //center = Polygon(width/2, height/2, center_radius, 6);
}

function draw() {
    linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
    stroke(color3);
    noFill();
    //print(pos);

    for(var i = 0; i < angles.length; i++){
        push();
        translate(pos.x, pos.y);

        rotate(angles[i]);
        if(clickStart !== null){
            var mpos = getMousePos();
            line(clickStart.x, clickStart.y, mpos.x, mpos.y);
        }
        //line(0, 0, width/2, 0);
        if ( keyIsPressed == false){
            for (j = 0; j < clickList.length; j++){
                var l = clickList[j];
                line(l.clickStart.x, l.clickStart.y, l.clickEnd.x, l.clickEnd.y);
                line(l.clickStart.x, -l.clickStart.y, l.clickEnd.x, -l.clickEnd.y);
                //vertex(l.clickStart.x, l.clickStart.y);
                //vertex(-l.clickStart.x, -l.clickStart.y);
                //          beginShape();
                //          for(var c = 0; c < l.clickMove.length; c++){
                //          //      vertex(l.clickMove[c].x, l.clickMove[c].y);
                //          }
                //
                //          endShape();
            }
        } else{

            rot += .5;
            for (j = 0; j < clickList.length; j++){
                var l = clickList[j];
                push();
                translate(l.clickStart.x, l.clickStart.y);
                rotate(rot%360);
                var d = p5.Vector.sub(l.clickStart, l.clickEnd);
                line(0, 0, d.x, d.y);
                line(0, -l.clickStart.y, -l.clickEnd.x, -l.clickEnd.y);
                pop();
            }
        }
        pop();
    }
}

function mousePressed(){
    var mpos = getMousePos(); 
    clickStart = createVector(mpos.x, mpos.y);
}

function mouseDragged(){
    var mpos = getMousePos();
    var pmpos = getMousePos(true);
    if (pmpos.dist(mpos) > 0){
        clickMove.push(getMousePos());
    }
}

function mouseReleased(){
    clickEnd = getMousePos(); 
    clickList.push({'clickStart': clickStart, 'clickEnd': clickEnd, 'clickMove': clickMove})
        clickStart = null;
}

function getMousePos(previous){
    if(previous == null){
        var mpos = p5.Vector.sub(createVector(mouseX, mouseY), pos);
    }else if (previous == true) {
        var mpos = p5.Vector.sub(createVector(pmouseX, pmouseY), pos);
    }
    return mpos;
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
