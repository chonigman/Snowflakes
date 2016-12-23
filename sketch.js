// #WeAreAllSnowflakes 
// Developed by Kadenze Inc. and Colin Honigman
// www.kadenze.com
// This is an generative and interactive sketch developed for our community
// to celebrate the close of one year and the beginning of another. We
// hope you enjoy this small gift from us an we wish you all safe, happy, and inspiring holidays. 
//We look forward to another year learning and creating with you and we can't wait to see what 
// you come up with.

// Instructions
// Click Generate to grow a new snowflake
// Click Save to download your image
// Select Sparkle Mode for a little *Sparkle*
// Click Draw to enter draw mode (this erases your generative snowflake)

// Technical Explanation:
// This piece uses what is called a Lindenmayer System or L-system to generate
// it's patterns. L-systems are a type of formal grammar that essentially 
// allows you to use a string of letters as instructions for a random agent. By starting
// with a simple string and applying simple rules intricate patterns
// can be generated fairly easily. In this case we used the letters F and H and the
// symbols + and - as our instructions. Starting with a simple string like HHF we
// then run the lindenmayer function that iterates over the string and replaces all 
// F's with F-H and all H's with F+H. Do this a couple of times and you have a long
// set of drawing instructions. We interpret character as a move forward, for every
// F we draw a line from the last position to the new one, for every H we draw a 
// small ellipse, for every + we increment the angle, and for every - we decrement 
// the angle (both by 60 degrees, snowflakes are generally 6 pointed so 360/6 = 60).
// The snowflake shape comes from taking the L-system drawing path and rotating and 
// reflecting it 6 times. The affect is cumulative so we do not redraw the background
// every frame.
//
// To learn more about Fractals, L-Systems, or P5js please check out the following
// classes on Kadenze.com
// The Nature of Code  - https://www.kadenze.com/courses/the-nature-of-code-ii/info
// Generative Art and Computational Creativity  - https://www.kadenze.com/courses/generative-art-and-computational-creativity-i/info
// Intro to P5js  - https://www.kadenze.com/courses/introduction-to-programming-for-the-visual-arts-with-p5-js-vi/info


// Palette and gradient
var palette;
var X_AXIS = 0;
var Y_AXIS = 1;

// Mouse interaction
var clickList = [];
var clickStart = null;
var clickEnd = null;

// What might this do?
var rot = 0;

// Globals
var pos;
var sides = 6;
var step = 1;
var angle; 
var angles = [];

// L-System Variables
// If you're unfamiliar with L-Systems check out technical description above
var thestring;              // The string we generate to create our pattern
var rules = [];             // The rules for generating 'thestring'
rules[0] = ['F', 'F-H'];    // For every F, replace with F-H
rules[1] = ['H', 'F+H'];    // For every H, replace with F+h
var whereinstring = 0;      // Keep track of where we are in string for drawing
var currentangle = 0;       // Keep track of angle for l-system
var tx = 0;                 // X and Y position of l-system
var ty = 0;
var generations = 5;        // How many times to run string through rule set
var max_x = 0;
var min_x = 0;
var max_y = 0;
var min_y = 0;

// UI Logic and Buttons and Stuff
var draw_mode = false;
var draw_button;
var gen_button;
var mode_switch;
var mode_slider;
var mode_checkbox;
var save_button;
var div;
var sparkle;
var new_session = true;
var menu_offset = 41;


function setup() {
  	seasonsGreetings();
  	if (detectmob()){
    	createCanvas(windowWidth, windowHeight);
    } else{
   	 createCanvas(680, 710);
    }
    palette = loadPalette();        // Load our palette
    color1 = random(palette);       // Select random colors for gradient and stroke
    color2 = random(palette);
    color3 = random(palette);
    linearGradient(0, 0, width, height, color1, color2, Y_AXIS); // Draw our background gradient
    angle = 360/sides;              // Calculate angle size for number of sides we want
    for(var i = 0; i < sides; i++){
        angles.push(i*angle);       // Precalculate angles for rotation 
    }
    pos = createVector(width/2, height/2);//(height/2)-menu_offset/2);
    generate();                     // Generate new rule and string
    setupUI();                      // Set up the UI elements and styling
}


function draw() {
    noFill();
    strokeWeight(2.3);
    // Sparkle Mode only in Generative mode, draw mode disables sparkle mode
    if(draw_mode && sparkle.checked()){
        sparkle.checked(false);
    }
    // If we are in draw mode redraw background, otherwise update position in l-system
    if(draw_mode){
        linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
    } else{
        updateIt(thestring[whereinstring]);
    }
    // Sparkle Mode randomly selects one of three previously selected colors and 
    // changes with every frame. Otherwise, use color3 as stroke color
    var color4;
    if (sparkle.checked()){
        color4 = random([color1, color2, color3]);
    } else{
        color4 = color3;
    }
    // Here is where we draw, rotate, and reflect our points for both modes
    for(var i = 0; i < angles.length; i++){
        push();
        translate(pos.x, pos.y);
        rotate(radians(angles[i]));
        // If we are not in draw mode and the generate button has been pushed
        if(draw_mode == false && new_session == false){
            // A little opacity makes for nice looking snowflakes
            stroke(color4.levels[0], color4.levels[1], color4.levels[2], 100*step);
            drawIt(thestring[whereinstring]);
        } else if(clickStart !== null){
            // If we are in draw mode and a click has been started, draw position so we can see how it looks
            var mpos = getMousePos();
            stroke(color4);
            line(clickStart.x, clickStart.y, mpos.x, mpos.y);
            line(clickStart.x, -clickStart.y, mpos.x, -mpos.y); // reflection over x axis
        }
        // If in Draw Mode draw the lines if you press a button spin everything!
        if (draw_mode && keyIsPressed == false){
            for (j = 0; j < clickList.length; j++){
                var l = clickList[j];
                if (l != null){
                    stroke(color3);
                    line(l.clickStart.x, l.clickStart.y, l.clickEnd.x, l.clickEnd.y);
                    line(l.clickStart.x, -l.clickStart.y, l.clickEnd.x, -l.clickEnd.y);
                }
            }
            rot = 0;
        } else {
            for (j = 0; j < clickList.length; j++){
                // Spin everything around the center
                spinIt(j, color4);
            }
        }
        pop();
    }
    if(keyIsPressed) rot += 1; // Update rotation for key pressing

}

// Store mouse presses and update clickStart
function mousePressed(){
    if (draw_mode && mouseInBounds()){
        var mpos = getMousePos(); 
        clickStart = createVector(mpos.x, mpos.y);
    }
}

// Store mouse release, push start and end to list and clear clickStart
function mouseReleased(){
    if (draw_mode && clickStart != null){
        clickEnd = getMousePos(); 
        clickList.push({'clickStart': clickStart, 'clickEnd': clickEnd})
            clickStart = null;
    }
}

// Ignore menu item clicks
function mouseInBounds(){
    return mouseX <= width && mouseX >= 0 && mouseY <= (height-menu_offset) && mouseY >= 0;
}

// Convert mouse position to translated origin
function getMousePos(){
    var mpos = p5.Vector.sub(createVector(mouseX, mouseY), pos);
    return mpos;
}

// Linear Gradient Function from http://p5js.org/examples/color-linear-gradient.html 
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

// L-System Functions. Takes in string, checks rules, and updates string
// Code from http://p5js.org/examples/simulate-l-systems.html 
function lindenmayer(s) {
    var outputstring = '';      // New output string

    // Iterate over string to find matches 
    for (var i = 0; i < s.length; i++) {
        var ismatch = 0; 
        for (var j = 0; j < rules.length; j++) {
            // If matches rule substitute symbol with rule output
            if (s[i] == rules[j][0])  {
                outputstring += rules[j][1]; 
                ismatch = 1; 
                break;
            }
        }
        // If nothing matches, just copy the symbol over.
        if (ismatch == 0) outputstring+= s[i]; 
    }

    return outputstring; 
}


// Drawing portion of L-System 
function drawIt(k) {
    if (k=='F') {
        // Convert polar to cartesian coordinated 
        // based on step value and currentangle
        var x1 = tx+step*cos(radians(currentangle));
        var y1 = ty+step*sin(radians(currentangle));
        line(tx, ty, x1, y1);   // Draw line from previous position and new one 
        line(tx, -ty, x1, -y1); // Reflect line across x axis
    } else if(k=='H'){
        var x1 = tx+step*cos(radians(currentangle));
        var y1 = ty+step*sin(radians(currentangle));
        ellipse(x1, y1, 2, 2);
    }
}


// Update L-System. Position in string, current location, and angle if character matches
// Separated from draw as we are drawing each point multiple times so updating angle etc
// breaks it
function updateIt(k) {
    whereinstring++;
    if(whereinstring > thestring.length-1) whereinstring = 0; // Update
    tx = tx + step * cos(radians(currentangle));
    ty = ty + step * sin(radians(currentangle));
    if (k == '+') {
        currentangle += angle; // turn left
    } else if (k == '-') {
        currentangle -= angle; // turn right   
    }
}

// Reset our l-system and our drawing list
function reset(){
    currentangle = 0;
    whereinstring = 0;
    tx = 0;
    ty = 0;
    linearGradient(0, 0, width, height, color1, color2, Y_AXIS);
    clickList = [];
}

// Save your awesome image. Don't forget to tag us #WeAreAllSnowflakes
function saveIt(){
	var canvas = document.getElementById('defaultCanvas0');
  	if (detectmob()){
    	var dataURL = canvas.toDataURL();

    } else{
        canvas.toBlob(function(blob) {
            saveAs(blob, "KadenzeSnowflake.jpg");
        });
    }
}

// Setter method for draw button. If already in draw mode it resets screen.
function setDrawMode(){
    if (draw_mode){
        reset();
    }
    draw_mode = true;
    sparkle.style('opacity: .5');
}

// Setter method for generate mode. If new session don't create new colors
function setGenMode(){
    draw_mode = false;
    reset();
    if(new_session == false) {
        generate();
        color1 = random(palette); 
        color2 = random(palette); 
        color3 = random(palette); 
        linearGradient(0, 0, width, height, color1, color2, Y_AXIS)
    }
    new_session = false;
    sparkle.style('opacity: 1');
}

// Generate method. Randomly selects starting string. Runs it through
// lindenmayer function and resets.
function generate(){
    reset();  
    print('\n');
    print('The following string is being rendered.\n');
    thestring = random(['HFHFFHF', 'FFFHHFHHFFF', 'FHF', 'HFH', 'HHFHF']);
    for(var i = 0; i < 6; i++){
        thestring += random(['F' ,'F',  'F','F','F', 'F', 'H', 'H']); 
    }
    print('Starting string: ');
    print(thestring);
    print(" \n");
    for (var i = 0; i < generations; i++) {
        thestring = lindenmayer(thestring);
    }
    print('Resulting string: ');
    print(thestring);
    print(' \n');
    getMaxFromSystem();
}


// Just for fun !(^_^)!
function spinIt(j, c){
    //rotate(radians(rot%360));
    var l = clickList[j];
    stroke(c);
    push();
    // spin each line around their starting point
    translate(l.clickStart.x, l.clickStart.y);
    var sub;
    if (pos.dist(l.clickStart) > pos.dist(l.clickEnd)){
        sub = p5.Vector.sub(l.clickStart, l.clickEnd);
    } else {
        sub = p5.Vector.sub(l.clickEnd, l.clickStart);
    }
    // Calculate the angle from the line so we start where it was drawn 
    // Couldn't totally figure this out so they start from drawn position
    var a = atan2(sub.y, sub.x);
    rotate(radians(rot%360)-a);
    var d = p5.Vector.sub(l.clickStart, l.clickEnd);
    line(0, 0, d.x, d.y);
    pop();
    push();
    // Spin reflection line as well
    translate(l.clickStart.x, -l.clickStart.y);
    rotate(radians(rot%360)-a);
    line(0, 0, d.x, d.y);
    pop();
}

// Open Processing limits screen display to canvas size, so we
// create HTML elements over bottom and style them to look like menu
function setupUI(){
    draw_button = createButton('DRAW');
    gen_button = createButton('GENERATE');
    save_button = createButton('SAVE');
    sparkle = createCheckbox('Sparkle Mode');
    if (detectmob()){
        draw_button.touchStarted(setDrawMode);
        gen_button.touchStarted(setGenMode);
        save_button.touchStarted(saveIt);
    } else {
        draw_button.mousePressed(setDrawMode);
        gen_button.mousePressed(setGenMode);
        save_button.mousePressed(saveIt);

    }
    div = createDiv('');
    gen_button.class('btn');
    draw_button.class('btn');
    save_button.class('btn');
    var btns = [save_button, draw_button, gen_button];

    for(var i = 0; i < btns.length; i++){
        btns[i].style('color: white');
        btns[i].style('background: transparent');
        btns[i].style('border: 1px solid white');
        if (detectmob()){
            btns[i].style('padding: 5px 15px');
            btns[i].style('font-size: 12px');
            btns[i].style('margin: 10px 0 0 10px');
        } else {
            btns[i].style('padding: 5px 30px');
            btns[i].style('font-size: 14px');
            btns[i].style('margin: 10px 0 0 10px');
        }
        btns[i].style('font-family: Roboto');
        btns[i].style('width: auto');
        btns[i].style('height: auto');

    }
    gen_button.parent(div);
    draw_button.parent(div);

    if (detectmob()){
        save_button.style('visibility: hidden');
    } else {
        save_button.parent(div);
    }
    sparkle.parent(div);
    sparkle.style('color: white');
    sparkle.style('display: inline-block');
    sparkle.style('margin-left: 20px');
    sparkle.style('font-family: Roboto');
    sparkle.style('font-size: 12px');
    div.position(0, height-menu_offset);
    div.style('background: black');
    div.style('width:' + width + 'px');
    div.style('height:' + menu_offset + 'px');

}

// Perhaps my favorite part is this color palette.
// Snowflakes are amazing from a aesthetic and a scientific perspective.
// This palette was collected from the AMAZING photos taken by Kenneth G. Libbrecht 
// who is a professor of physics at CalTech. He even grows his own snowflakes. 
// Great resource and tremendous inspiration for this project. 
// Check out his site at http://snowcrystals.com/
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
        color(33, 48, 76)
            ]
            return p;
}

// Something extra for those who might open up the console.
function seasonsGreetings(){
    print("Happy Holidays from Kadenze Inc.\n");
    print("#WeAreAllSnowflakes is a generative and interactive piece developed by Kadenze's Colin Honigman for our community.\n");
    print("Click Generate to watch a snowflake grow.\n");
    print("Click Save to download your snowflake and share your #WeAreAllSnowflakes image. Don't forget to tag us! ;)\n");
    print("Click Draw to draw your own snowflake.");
}

function detectmob() { 
    if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
      ){
        return true;
    }
    else {
        return false;
    }
}

function getMaxFromSystem(){
    max_x = 0;
    max_y = 0;
    min_x = 0;
    min_y = 0;
    for (var i = 0; i < thestring.length*4; i++){
       updateIt(thestring[whereinstring]); 
       if(tx > max_x) {
           max_x = tx;
        } else if (tx < min_x) { 
            min_x = tx;
        }
       if (ty > max_y) {
           max_y = ty;
        } else if (ty < min_y){
            min_y = ty;
        }
    }
    if (max_x > width/2 || max_y > height/2){
        step = map((width/2)/max([max_x, max_y]), 0, 1, 0, .9);
    } else if (min_x < -width/2 || min_y < -height/2){
        step = map(-((width/2)/min([min_x, min_y])), 0, 1, 0, .9);
    }else { step = 1;}
    print(step);
    reset();
}

var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
