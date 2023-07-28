new p5();

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(windowWidth, windowHeight);
}

function windowResized(){
  width = windowWidth;
  height = windowHeight;
  resizeCanvas(windowWidth, windowHeight);
}

class Stat{
  constructor(x, y, low, high, current, intv, name){
    this.x = x;
    this.y = y;
    this.name = name;
    this.w = 100/1991*width;
    this.h = 900/1122*height;
    this.low = low;
    this.high = high;
    this.current = current;
    this.intv = intv;
    this.lowest = int(this.low/this.intv)*this.intv - this.intv;
    this.highest = int(this.high/this.intv)*this.intv + this.intv;
    this.nmarks = (this.highest - this.lowest)/this.intv;
    this.pixDiff = (this.y + this.h/2 - 60/1122*height - (this.y - this.h/2 + 60/1122*height))/this.nmarks;
    this.bad = 0;
  }

  drawStat(){
    push();
    stroke('#FFFFFF');
    fill('#222222');
    strokeWeight(5);
    rect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    pop();

    push();
    stroke('#FFFFFF');
    strokeWeight(5);
    line(this.x, this.y - this.h/2 + 40/1122*height, this.x, this.y + this.h/2 - 40/1122*height);
    pop();
    
    for(let i = 0; i <= this.nmarks; i++){
      push();
      stroke('#FFFFFF');
      strokeWeight(5);
      line(this.x - 20/1991*height, this.y - this.h/2 + 60/1122*height + i*this.pixDiff, this.x + 20/1991*height, this.y - this.h/2 + 60/1122*height + i*this.pixDiff);
      pop();

      push();
      fill(255,255,255);
      textAlign(LEFT, CENTER);
      textSize(20);
      text(this.highest - i*this.intv, this.x + this.w/2 + 15/1991*width, this.y - this.h/2 + 60/1122*height + i*this.pixDiff);
      pop();
    }
    
    push();
    fill(255,255,255);
    textAlign(CENTER, TOP);
    textSize(30);
    text(this.name, this.x, this.y + this.h/2 + 25/1122*height);
    pop();

    push();
    stroke('#008AD8');
    strokeWeight(5);
    line(this.x - 35/1991*width, this.y + this.h/2 - 60/1122*height - (this.low - this.lowest)/this.intv*this.pixDiff, this.x + 35/1991*width, this.y + this.h/2 - 60/1122*height - (this.low - this.lowest)/this.intv*this.pixDiff);
    pop();

    push();
    stroke('#008AD8');
    strokeWeight(5);
    line(this.x - 35/1991*width, this.y + this.h/2 - 60/1122*height - (this.high - this.lowest)/this.intv*this.pixDiff, this.x + 35/1991*width, this.y + this.h/2 - 60/1122*height - (this.high - this.lowest)/this.intv*this.pixDiff);
    pop();

    push();
    if(this.current > this.low + this.intv && this.current < this.high - this.intv){
      stroke('#00FF00');
      this.bad = 0;
    }
    else if(this.current < this.low || this.current > this.high){
      stroke('#FF0000');
      this.bad = 2;
    }
    else{
      stroke('#FFD300');
      this.bad = 1;
    }
    strokeWeight(5);
    line(this.x - 35/1991*width, this.y + this.h/2 - 60/1122*height - (this.current - this.lowest)/this.intv*this.pixDiff, this.x + 35/1991*width, this.y + this.h/2 - 60/1122*height - (this.current - this.lowest)/this.intv*this.pixDiff);
    pop();
  }
}

let width = 1991;
let height = 1122;
let statList = [new Stat(width/2 - 800/1991*width, height/2, 150000, 400000, 256723, 30000, "Platelet Count\n(in cells per mm^3)"),
                new Stat(width/2 - 400/1991*width, height/2, 4500, 11000, 7235, 750, "White Blood Cell Count\n(in cells per mm^3)"),
                new Stat(width/2, height/2, 4.3, 5.9, 4.8, 0.25, "Red Blood Cell Count\n(in millions of cells per mm^3)"),
                new Stat(width/2 + 400/1991*width, height/2, 54, 126, 82, 15, "Blood Sugar Levels\n(in mg/dL)"),
                new Stat(width/2 + 800/1991*width, height/2, 125, 200, 156, 10, "Cholesterol\n(in mg/dL)")];
let currEdit = 0;
let startCountdown = false;
let stopCountdown = false;
let cdTime = 0;
let startCall = false;

function mousePressed(){
  for(let i = 0; i < statList.length; i++){
    if(statList[i].x - statList[i].w/2 < mouseX && mouseX < statList[i].x + statList[i].w/2 && statList[i].y - statList[i].h/2 < mouseY && mouseY < statList[i].y + statList[i].h/2){
      currEdit = i;
    }
  }

  if(width/2 - 700/1991*width < mouseX && mouseX < width/2 + 700/1991*width && height/2 - 400/1122*height < mouseY && mouseY < height/2 + 400/1122*height && startCountdown){
    startCountdown = false;
    stopCountdown = true;
  }
}

function runCall(){
  window.location = 'tel:4126564693';
  noLoop();
}

function draw() {
  background('#222222');

  for(let i = 0; i < statList.length; i++){
    statList[i].drawStat();
  }

  if (keyIsDown(UP_ARROW)){
    statList[currEdit].current += 1 * statList[currEdit].intv / statList[currEdit].pixDiff;
  }
  else if(keyIsDown(DOWN_ARROW)){
    statList[currEdit].current -= 1 * statList[currEdit].intv / statList[currEdit].pixDiff;
  }
  
  let t = "All Levels Normal";
  let danger = [];
  for(let i = 0; i < statList.length; i++){
    if(statList[i].bad == 2){
      let splitString = split(statList[i].name, '\n');
      append(danger, splitString[0]);
    }
  }

  let cautious = [];
  for(let i = 0; i < statList.length; i++){
    if(statList[i].bad == 1){
      let splitString = split(statList[i].name, '\n');
      append(cautious, splitString[0]);
    }
  }

  if(danger.length > 2){
    t = "";
    for(let i = 0; i < danger.length; i++){
      if(i != danger.length - 1){
        t = t + danger[i] + ", ";
      }
      else{
        t = t + "and " + danger[i];
      }
    }
    t = t + " at Dangerous Levels";
  }
  else if(danger.length == 2){
    t = danger[0] + " and " + danger[1] + " at Dangerous Levels";
  }
  else if(danger.length == 1){
    t = danger[0] + " at Dangerous Levels";
  }
  else{
    if (cautious.length > 2) {
      t = "";
      for (let i = 0; i < cautious.length; i++) {
        if (i != cautious.length - 1) {
          t = t + cautious[i] + ", ";
        }
        else {
          t = t + "and " + cautious[i];
        }
      }
      t = t + " at Cautious Levels";
    }
    else if (cautious.length == 2) {
      t = cautious[0] + " and " + cautious[1] + " at Cautious Levels";
    }
    else if (cautious.length == 1) {
      t = cautious[0] + " at Cautious Levels";
    }
  }

  push();
  textAlign(LEFT, CENTER);
  textSize(30);
  fill(255,255,255);
  text("Overall Health: ", 55/1991*width, 55/1122*height);
  pop();

  push();
  textAlign(LEFT, CENTER);
  textSize(30);
  if(danger.length > 0){
    fill(255, 0, 0);
    startCall = true;
  }
  else if(cautious.length > 0){
    fill(255, 211, 0); 
  }
  else{
    fill(255,255,255);
  }
  text(t, 260, 55);
  pop();

  push();
  fill(255,255,255);
  triangle(width - 60/1991*width, height/2 - 50/1122*height, width - 60/1991*width, height/2 + 50/1122*height, width - 10/1991*width, height/2);
  pop();

  for(let i = 0; i < danger.length; i++){
    if(danger[i] == "Blood Sugar Levels" && !stopCountdown && !startCountdown){
      startCountdown = true;
      cdTime = millis();
    }
  }

  if(startCountdown && !stopCountdown){
    push();
    fill(255, 0, 0);
    noStroke();
    rect(width/2 - 700/1991*width, height/2 - 400/1122*height, 1400/1991*width, 800/1122*height, 25/1991*width, 25/1991*width, 25/1991*width, 25/1991*width);
    pop();

    let t = 5 - int((millis() - cdTime) / 1000);

    push();
    textAlign(CENTER, CENTER);
    textSize(60);
    fill(255,255,255);
    text("PRESS BUTTON IF STILL RESPONSIVE", width/2, height/2 - 70/1122*height);
    if(t > 0){
      text(t, width/2, height/2 + 70/1122*height);
    }
    else{
      text("Calling 911...", width/2, height/2 + 70/1122*height);
    }
    pop();
  }

  // if(startCountdown && !stopCountdown && (millis() - cdTime) >= 5000){
  //   // console.log("hi");
  // runCall();
  // }
}
