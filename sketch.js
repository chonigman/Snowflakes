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
var step = 10;
var angles = [];
var thestring = 'HFHFFHF';
var newrules = [];
newrules[0] = ['F', 'F-H'];
newrules[1] = ['H', 'F+H'];
var whereinstring = 0;
var currentangle = 0;
var tx = 0;
var ty = 0;
var nx, ny;
var npos;
var mode_box;
var draw_mode = false;
var draw_button;
var gen_button;
var random_color;
var undo_now = false;
var generations = 5;
var mode_switch;
var mode_slider;
var mode_checkbox;
var save_button;
var div;
var sparkle;


function setup() {
  createCanvas(530, 560);
  palette = loadPalette();
  color1 = random(palette);
  color2 = random(palette);
  color3 = random(palette);
  linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
  center_radius = int(random(0, width*.25));
  angle = 360/sides; 
  for(var i = 0; i < sides; i++){
    angles.push(i*angle);
  }
  rot = 0;
  pos = createVector(width/2, height/2);
  step = 1;
  newRule();
  draw_button = createButton('DRAW');
  draw_button.mousePressed(setDrawMode);
  gen_button = createButton('GENERATE');
  gen_button.mousePressed(setGenMode);
  random_color = {'checked': false};
  save_button = createButton('SAVE');
  save_button.mousePressed(saveIt);
  sparkle = createCheckbox('Sparkle Mode');
  div = createDiv('');
  gen_button.class('btn');
  draw_button.class('btn');
  save_button.class('btn');
  var btns = [save_button, draw_button, gen_button];

  for(var i = 0; i < btns.length; i++){
      btns[i].style('color: white');
      btns[i].style('background: transparent');
      btns[i].style('border: 1px solid white');
      btns[i].style('padding: 5px 30px');
      btns[i].style('font-size: 14px');
      btns[i].style('width: auto');
      btns[i].style('height: auto');
      btns[i].style('margin: 10px 0 0 10px');
      btns[i].style('font-family: Roboto');
      
  }

  gen_button.parent(div);
  draw_button.parent(div);
  save_button.parent(div);
  sparkle.parent(div);
  sparkle.style('color: white');
  sparkle.style('display: inline-block');
  sparkle.style('margin-left: 20px');
  sparkle.style('font-family: Roboto');
  sparkle.style('font-size: 12px');
  div.position(0, height-38);
  div.style('background: black');
  div.style('width:530px');
  
}


function draw() {
    if(draw_mode && sparkle.checked()){
        sparkle.checked(false);
    }
    if(draw_mode){
        linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
    } else{
        updateIt(thestring[whereinstring]);
    }
    strokeWeight(2.3);
    var color4;
    if (sparkle.checked()){
        color4 = random([color1, color2, color3]);
        //stroke(color3.levels[0], color3.levels[1], color3.levels[2], 80);
    }else{
        color4 = color3;
    }
    noFill();

    for(var i = 0; i < angles.length; i++){
        push();
        translate(pos.x, pos.y);
        rotate(radians(angles[i]));
        if(draw_mode == false){

            stroke(color4.levels[0], color4.levels[1], color4.levels[2], 100);
            drawIt(thestring[whereinstring]);
        } else if(clickStart !== null){
            var mpos = getMousePos();
            stroke(color3);
            line(clickStart.x, clickStart.y, mpos.x, mpos.y);
            line(clickStart.x, -clickStart.y, mpos.x, -mpos.y);
        }
        if (keyIsPressed == false){
            for (j = 0; j < clickList.length; j++){
                var l = clickList[j];
                if (l != null){
                    stroke(color3);
                    line(l.clickStart.x, l.clickStart.y, l.clickEnd.x, l.clickEnd.y);
                    line(l.clickStart.x, -l.clickStart.y, l.clickEnd.x, -l.clickEnd.y);
                }
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
        clickList.pop();
        print(clickList.length);
    }
    //endShape();
}

function mousePressed(){
    if (draw_mode && mouseInBounds()){
        var mpos = getMousePos(); 
        clickStart = createVector(mpos.x, mpos.y);
    }
}

function mouseDragged(){
    if (draw_mode){
        var mpos = getMousePos();
        var pmpos = getMousePos(true);
        if (pmpos.dist(mpos) > 0){
            clickMove.push(getMousePos());
        }
    }
}

function mouseReleased(){
    if (draw_mode && clickStart != null){
        clickEnd = getMousePos(); 
        clickList.push({'clickStart': clickStart, 'clickEnd': clickEnd, 'clickMove': clickMove})
            clickStart = null;
    }
}

function mouseInBounds(){
    return mouseX <= width && mouseX >= 0 && mouseY <= (height-30) && mouseY >= 0;
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
  	//var ctx = hidden_canvas.getContext('2d');
    //
    saveCanvas('KadenzeSnowflake', 'jpg');
}
function undo(){
    undo_now = true;
}

function setDrawMode(){
    draw_mode = true;
}

function setGenMode(){
    draw_mode = false;
    color1 = random(palette); 
    color2 = random(palette); 
    color3 = random(palette); 
    clearLines();
    newRule();
  linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
}


function newRule(){
    thestring = random(['HFHFFHF', 'FFFHHFHHFFF', 'FHF', 'HFH', 'HHFHF']);
    print('Starting string ', thestring);
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

function loadPalette() {
    var p = [
        color(25, 47, 158),
        color(217, 183, 252),
        color(79, 76, 180),
        color(138, 139, 255),
        color(62, 74, 151),
        color(215, 209, 204),
        color(253, 126, 198),
        color(111, 138, 218),
        color(200, 194, 231),
        color(143, 174, 254),
        color(213, 216, 255),
        color(119, 139, 250),
        color(233, 229, 255),
        color(235, 216, 230),
        color(143, 171, 255),
        color(175, 202, 255),
        color(205, 221, 254),
        color(153, 174, 255),
        color(128, 175, 230),
        color(233, 235, 255),
        color(228, 214, 254),
        color(220, 212, 255),
        color(232, 226, 254),
        color(47, 48, 127),
        color(249, 207, 255),
        color(245, 248, 255),
        color(46, 11, 254),
        color(138, 173, 255),
        color(169, 6, 71), 
        color(131, 8, 93),
        color(3, 11, 53),
        color(34, 38, 64),
        color(99, 111, 238),
        color(190, 204, 248),
        color(114, 170, 229),
        color(226, 212, 244),
        color(33, 48, 76),
        ]
            return p;
}
