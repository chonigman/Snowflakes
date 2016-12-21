/* Better color selection (lightness isssue)
 * Stroke weight selection
 * 
 */
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
var step = 4;
var angles = [];
//var thestring = 'HFHFFHF'; // keep because it's good
var thestring = 'HFHFFHF';
//thestring = 'FHFHFHF';
//thestring = 'H++H+F-HFFHF';
var therules = []; // array for rules
therules[0] = ['A', 'FF+F-A+F+A--']; // first rule
therules[0] = ['A', 'FFFA+F+F--FFA+F+A--']; // first rule
therules[1] = ['B', '+AF+BFB-FA+F--F-F-']; // second rule
var newrules = [];
newrules[0] = ['F', 'F-H'];
newrules[1] = ['H', 'F+H'];
var whereinstring = 0;
var currentangle = 0;
var tx = 0;
var ty = 0;
var nx, ny;
var npos;
var save_button;
var clear_button;
var mode_button;
var undo_button;
var new_rule_button;
var random_color;
var undo_now = false;
var generations = 5;


function setup() {
  strokeWeight(10);
  createCanvas(720, 720);
  palette = loadPalette();
  //randomSeed(20);
  color1 = random(palette);
  color2 = random(palette);
  color3 = random(palette);
  linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
  center_radius = int(random(0, width*.25));
  //angleMode(DEGREES);
  angle = 360/sides; 
  var s = 'FAF+F+FF-F-A-F';
  for(var i = 0; i < 6; i++){
    thestring += random(['+', 'F' , 'F', '-', 'F',  'F','F','F', '+', 'F', '-', '-']); 
  }
  
  //therules[0][1] = s;
  for(var i = 0; i < sides; i++){
    angles.push(i*angle);
  }
  rot = 0;
  pos = createVector(width/2, height/2);
  //****** Step size for more smooth (low) rigid (high) values
  step = 1;
  //******_Change number of iterations to affect size/form
  //for (var i = 0; i < generations; i++) {
  //    thestring = lindenmayer(thestring);
  //}
  newRule();
  save_button = createButton('Download');
  save_button.mousePressed(saveIt);
  print(thestring);
  mode_button = createCheckbox('Draw Mode', false);
  clear_button = createButton('Clear');
  clear_button.mousePressed(clearLines);
  undo_button = createButton('Undo');
  undo_button.mousePressed(undo);
  new_rule_button = createButton('Generate');
  new_rule_button.mousePressed(newRule);
  random_color = createCheckbox('Random Color', false);
  //frameRate(1);
  //center = Polygon(width/2, height/2, center_radius, 6);
}

function draw() {
    if(mode_button.checked()){
      linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
    } else{
        updateIt(thestring[whereinstring]);
    }
    strokeWeight(2.3);
    var color4;
    if (random_color.checked()){
        color4 = random([color1, color2, color3]);
    //stroke(color3.levels[0], color3.levels[1], color3.levels[2], 80);
    }else{
        color4 = color3;// random([color1, color2, color3]);
    }
    noFill();

    for(var i = 0; i < angles.length; i++){
        push();
        translate(pos.x, pos.y);
        rotate(radians(angles[i]));
        if(mode_button.checked() == false){

            stroke(color4.levels[0], color4.levels[1], color4.levels[2], 80);
            drawIt(thestring[whereinstring]);
        } else if(clickStart !== null){
            var mpos = getMousePos();
            stroke(color3);
            line(clickStart.x, clickStart.y, mpos.x, mpos.y);
            line(clickStart.x, -clickStart.y, mpos.x, -mpos.y);
        }
        //line(0, 0, width/2, 0);
        if (keyIsPressed == false){
            for (j = 0; j < clickList.length; j++){
                var l = clickList[j];
                stroke(color3);
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

            rot += 1;
            for (j = 0; j < clickList.length; j++){
                var l = clickList[j];
                push();
                translate(l.clickStart.x, l.clickStart.y);
                rotate(radians(rot%360));
                var d = p5.Vector.sub(l.clickStart, l.clickEnd);
                stroke(color3);
                line(0, 0, d.x, d.y);
                line(0, 0, d.x, -d.y);
                pop();
            }
        }
        pop();
    }

    whereinstring++;
    if(whereinstring > thestring.length-1) whereinstring = 0;
    if (undo_now){
        undo_now = false;
        //clickList = clickList.splice(clickList.length-1, 1);
        clickList.shift();
        print(clickList.length);
    }
    //endShape();
}

function mousePressed(){
    if (mode_button.checked()){
    var mpos = getMousePos(); 
    clickStart = createVector(mpos.x, mpos.y);
    }
}

function mouseDragged(){
    if (mode_button.checked()){
    var mpos = getMousePos();
    var pmpos = getMousePos(true);
    if (pmpos.dist(mpos) > 0){
        clickMove.push(getMousePos());
    }
    }
}

function mouseReleased(){
    if (mode_button.checked()){
    clickEnd = getMousePos(); 
    clickList.push({'clickStart': clickStart, 'clickEnd': clickEnd, 'clickMove': clickMove})
        clickStart = null;
    }
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

// interpret an L-system
function lindenmayer(s) {
    var outputstring = ''; // start a blank output string

    // iterate through 'therules' looking for symbol matches:
    for (var i = 0; i < s.length; i++) {
        var ismatch = 0; // by default, no match
        for (var j = 0; j < newrules.length; j++) {
            if (s[i] == newrules[j][0])  {
                outputstring += newrules[j][1]; // write substitution
                ismatch = 1; // we have a match, so don't copy over symbol
                break; // get outta this for() loop
            }
        }
        // if nothing matches, just copy the symbol over.
        if (ismatch == 0) outputstring+= s[i]; 
    }

    return outputstring; // send out the modified string
}


// this is a custom function that draws turtle commands
function drawIt(k) {

    if (k=='F') { // draw forward

    // polar to cartesian based on step and currentangle:
    var x1 = tx+step*cos(radians(currentangle));
    var y1 = ty+step*sin(radians(currentangle));
    line(tx, ty, x1, y1); // connect the old and the new
    line(tx, -ty, x1, -y1);
    // update the turtle's position:
    //tx = x1;
    //ty = y1;
    }else if(k=='H'){
    var x1 = tx+step*cos(radians(currentangle));
    var y1 = ty+step*sin(radians(currentangle));
        ellipse(x1, y1, 2, 2);
    }
}

function updateIt(k) {
    tx = tx + step * cos(radians(currentangle));
    ty = ty + step * sin(radians(currentangle));
    if (k == '+') {
        currentangle += angle; // turn left
    } else if (k == '-') {
        currentangle -= angle; // turn right   
    }

}

function clearLines(){
    currentangle = 0;
    whereinstring = 0;
    tx = 0;
    ty = 0;
    linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
    clickList = [];
}
function saveIt(){
    saveCanvas('KadenzeSnowflake', 'jpg');
}
function undo(){
    undo_now = true;
}

function newRule(){
    thestring = random(['HFHFFHF', 'FFFHHFHHFFF', 'FHF']);
    for(var i = 0; i < 6; i++){
        thestring += random(['+', 'F' , 'F', '-', 'F',  'F','F','F', '+', 'F', '-', '-']); 
    }
  for (var i = 0; i < generations; i++) {
      thestring = lindenmayer(thestring);
  }
  print(thestring);
  currentangle = 0;
  whereinstring = 0;
  tx = 0;
  ty = 0;

}
