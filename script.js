//aantal levens
leven = 3

// variabelen voor omgekeerde piramide
var aantalLagen = 100;
var breedte;
var hoogte;

// teken omgekeerde piramide
function tekenOmgekeerdePiramide(aantalLagen) {
  let breedte = 900 / aantalLagen;
  let hoogte = breedte / 2;

  push(); // alleen voor piramide
  translate(0, 0);
  fill('lightgrey');
  stroke('darkgrey');
  noStroke();

  // omgekeerde piramide
  function recursieveLaag(n) {
    if (n > 0) {
      for (let nr = 0; nr < n; nr++) {
        rect(nr * breedte, 0, breedte, hoogte);
      }
      translate(breedte / 2, hoogte);
      // roept functie opnieuw, maar -1 n, dus omgekeerde piramide
      recursieveLaag(n - 1);
    }
  }
  
  // start de functie
  recursieveLaag(aantalLagen);
  pop();
}

// variabel bal (de speler kan nog steeds niet checken als de bal is geraakt)
var bal = {
  diameter: 40,
  straal: null,
  x: null,
  y: null,
  snelheidX: 16,
  snelheidY: 10,

  // Bal beweegt volgens 
  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;

    if (this.x < this.straal || this.x > canvas.width - this.straal) {
      this.snelheidX *= -1;
    }
    if (this.y < this.straal || this.y > canvas.height - this.straal) {
      this.snelheidY *= -1;
    }
  },

  teken() {
    push();
    fill(0,255,0);
    ellipse(this.x,this.y,this.diameter);
    pop();
  },
  
  // Check bal geraakt door Jos HEB VERANDERD CHECK ALS DIT WERKT JUSTIN
  wordtGeraakt(jos) {
    // bereken afstand tussen bal en Jos
    let afstand = dist(this.x, this.y, jos.x + raster.celGrootte / 2, jos.y + raster.celGrootte / 2);
    //console.log(afstand);
    //text(afstand, 300, 300);
    // check als afstand < balstraal + halve cel
    if (afstand < this.straal + raster.celGrootte * 0.5) {
      return true;
    } else {
      return false;
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
// Raster wordt getekend met blauwe rand
teken() {
  push();
  noFill();

  // loop door elke rij
  for (var rij = 0; rij < this.aantalRijen; rij++) {
    // loop door elke kolom
    for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
      // check of cel een randcel is
      if (
        // rij/kolom 0, want dat is buitenste rij/kolom
        rij === 0 || 
        rij === this.aantalRijen - 1 || 
        kolom === 0 || 
        kolom === this.aantalKolommen - 1
      ) {
        fill('lightblue'); // randcellen blauw
      } else {
        fill('transparent'); // binnen cellen grijs
      }
      // teken cel
      rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
    }
  }

  pop();
}
}

// speler
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

  // Check of  Jos geraakt wordt door vijand
  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }

  // Zorgt voor juiste Jos frame
  toon() {
image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

// raket
/*
class Raket{
  constructor(x,y){
    this.x = x
    this.y = y
    this.speed = 17
  }
  beweeg(){
    this.y -= this.speed
    this.speed -= 0.5
  }
  toon() {
    loadImage(images/sprites/raket.jpg);
  }
  
}
*/

// Vijanden
class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  // Vijanden bewegen random
  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  // Vijanden worden getekend
  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

// achtergronden
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
  
  // COMMENTAAR
  commentaar = ["Je bent slecht","Domdom","Hoe ben je dood gegaan","goo goo gah gah","test","yippi"]
  
  // math.floor = naar beneden afronden + random = random commentaar
  text(commentaar[Math.floor(Math.random() * commentaar.length)],50,400)
  
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

// Laadt alles in
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

  // laadt de speler in
  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  // laadt vijanden in
  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(100,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  Cindy = new Vijand(200,500);
  Cindy.stapGrootte = 1*eve.stapGrootte;
  Cindy.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  // laadt raket in
  /*
  Raket = new raket(100,100);
  raket.sprite = loadImage("images/sprites/Raket100px/Raket.png")
  */

  // laadt bal in
  bal.straal = bal.diameter/2;
    bal.x = bal.straal;
    bal.y = canvas.height/4;
}

// Tekent alles op scherm
function draw() {
  background(brug);
  raster.teken();

  tekenOmgekeerdePiramide(aantalLagen);
  
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  Cindy.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  Cindy.toon();
  /*
  raket.beweeg();
  raket.toon();
  */
  bal.beweeg();
  bal.teken();
  
  // Levens (afbeeldingen komen ooit hier)
  text("Aantal levens = " +leven+"",1,25);

  // Check of speler geraakt door vijand
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)||eve.wordtGeraakt(Cindy)) {
    leven --;
  }
  // Check of speler geraakt door bal
  if (eve.wordtGeraakt(bal)) {
    leven ++;
    // verplaats de bal na aanraking, zodat niet oneindig levens
    bal.x = random(bal.straal, canvas.width - bal.straal);
    bal.y = random(bal.straal, canvas.height - bal.straal);
  }

  // Check of speler dood
  if (leven == 0){
      gameover();
 }

  // Check of speler gewonnen
  if (eve.gehaald) {
    gewonnen();
  }
}