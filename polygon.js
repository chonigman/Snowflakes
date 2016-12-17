
var Flake = function(x, y, seed) {
  this.shape = new Polygon(x, y, seed);

  this.update = function() {
  //for(var i = 0; i < this.shape.agents.length; i++) {
    //this.shape.agents[i].update()
  //}
  }

  this.display = function() {
    this.shape.display();
    //for(var i = 0; i < this.shape.agents.length; i++) {
      //this.shape.agents[i].display();
    //}
  }
}


var Polygon = function(x, y, seed) {
  this.x = x;
  this.y = y;
  this.theta = 1;
  this.branches = [];
  this.seed = seed
  this.agents = [];
  this.arr_test = [];

  this.display = function() {
    randomSeed(this.seed);
    strokeWeight(3);
    this.branch(400);
  }

  this.branch = function(len) {
    len *= random(0.3, 0.7);
    if(len > 20) {

      //for(var i = 0; i > -len * 2; i-=50) {
        //this.agents.push(new Agent(0, i, map(i, 0, -len * 2, 20, 0)));
        //ellipse(0, i, 5, 5);
      //}
      line(0, 0, 0, -len * 2);

      push();
      translate(0, -len);
      rotate(this.theta);

      //for(var i = 0; i < len; i+=50) {
        //this.agents.push(new Agent(0, -i, map(i, 0, len, 0, 20)));
        //ellipse(0, -i, 5, 5);
      //}
      line(0, 0, 0, -len);

      this.branch(len);
      pop();

      push();
      translate(0, -len);
      rotate(-this.theta);

      //for(var i = 0; i > -len; i-=50) {
        //this.agents.push(new Agent(0, i, map(i, 0, -len, 20, 0)));
        //ellipse(0, i, 5, 5);
      //}
      line(0, 0, 0, -len);

      this.branch(len);
      pop();
    }
  }

  function agents() {
    return this.agents;
  }
}

var Agent = function(x, y, lifespan) {
  this.location = createVector(x, y);
  this.age = 0;
  this.lifespan = lifespan;

  this.update = function() {
    if(this.lifespan > this.age) {
      this.choice = Math.random() * 4;
      if(this.choice < 1) {
        this.location.add(createVector(-3, 0));
      } else if (this.choice < 2) {
        this.location.add(createVector(0, -3));
      } else if (this.choice < 3) {
        this.location.add(createVector(3, 0));
      } else {
        this.location.add(createVector(0, 3));
      }
    }
    this.age++;
  };

  this.display = function() {
    noStroke();
    fill(255, map(this.age, 0, this.lifespan, 255, 0))
    ellipse(this.location.x, this.location.y, 1, 1);
  }
}
