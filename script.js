leven = 3

// Ping-pong bal

class Help {
  constructor(){
    this.x = 100;
    this.y = 100;
    this.straal = 10;
    this.diameter = 20;
    this.speedX = 5;
    this.speedY = 5;
  }

  teken() {
    //kleur
    fill(255,255,255,1);
    ellipse(this.x,this.y,this.diameter);
  }

  beweeg(){
    this.x += this.snelheidX;
    this.y += this.snelheidY;
    
    // botsen tegen muren
    if (this.x < this.straal || this.x > canvas.width - this.straal) {
      this.snelheidX *= -1;
    }
    
    if (this.y < this.straal || this.y > canvas.height - this.straal) {
      this.snelheidY *= -1;
  }
  }
}


// Raster wordt gegenereerd
class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }
//CelGrootte berekenen
  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    // teken raster
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
  }

  // Jos beweegt met pijltjes
  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images//backgrounds/dame_op_brug_1800.jpg");
}

// laadt textsize verloren / gewonnen in
function gameover(){
  textFont("Verdana");
  textSize(90);
  background('red');
  fill('white');
  text("Je hebt verloren...",30,300);
  
  /*
  dood = loadimage("images/sprites/flatboy/Dead(15).png")
  dood.toon();
  */
  
  // COMMENTAAR LATER FIXEN
  commentaar = ["Je bent slecht","Domdom","Hoe ben je dood gegaan","goo goo gah gah","test","yippi"]
  text(Math.random(commentaar),50,400)
  
  noLoop();
}
function gewonnen(){
  textFont("Verdana");
  textSize(90);
  background('green');
  fill('white');
  text("Je hebt gewonnen!",30,300);
  noLoop();
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);

  // laadt textsize levens in
  textFont("Monospace");
  textSize(30);
  
  // laadt raster in
  raster = new Raster(12,18);
  // bereken grootte cel
  raster.berekenCelGrootte();
  
  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(100,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  Cindy = new Vijand(200,500);
  Cindy.stapGrootte = 1*eve.stapGrootte;
  Cindy.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  // laad bal in
  pingpong = new Help();
}

// Tekent alles op scherm
function draw() {
  background(brug);
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  Cindy.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  Cindy.toon();
  
  
  bal.beweeg();
  bal.teken();
  
  
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)||eve.wordtGeraakt(Cindy)) {
    leven --;
  }
  
  // Levenstext
  text("Aantal levens = " +leven+"",1,25);

  if (leven == 0){
      gameover();
 }

  if (eve.gehaald) {
    gewonnen();
  }
}