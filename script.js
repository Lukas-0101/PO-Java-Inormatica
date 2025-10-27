//aantal levens
leven = 3
// tijd van timer
timer = 30

// variabel voor beginscherm
nummer = 1

// variabelen voor omgekeerde piramide
var aantalLagen = 100;
var breedte;
var hoogte;

// variabelen voor raketten
var raket1;
var raket2;
var raket3;

// knoppen voor beginscherm
var startKnop, creditsKnop, sluitKnop;

// status voor welk scherm tonen
// 1 = beginscherm, 2 = credits, 0 = spel sluiten
var schermStatus = 1;

function beginScherm() {
  push(); // push en pop zorgt ervoor dat de achtergrond niet verdwijnt
  background(0);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(100);
  text("OVERLOPER", width / 2, height / 2 - 150);

  textSize(24);
  fill(200);
  //Uitleg
  text("Gebruik WASD om te bewegen\nOntwijk raketten en vijanden\nEet de bal voor levens (5 levens max)\nJe hebt maar 30 seconden!!", width / 2, height / 2 - 50);
  pop();

  //knoppen tekenen
  startKnop = { x: width / 2 - 100, y: height / 2 + 50, w: 200, h: 60, tekst: "START" };
  creditsKnop = { x: width / 2 - 100, y: height / 2 + 130, w: 200, h: 60, tekst: "CREDITS" };

  //tekenKnop functie voor alle knoppen zodat ze werken
  tekenKnop(startKnop);
  tekenKnop(creditsKnop);
}

// functie voor knoppen
function tekenKnop(knop) {
  push();
  // kleur anders als muis erop is
  if (
    mouseX > knop.x &&
    mouseX < knop.x + knop.w &&
    mouseY > knop.y &&
    mouseY < knop.y + knop.h
  ) {
    // lichtblauw
    fill(100, 200, 255);
  } else {
    // donkerblauw
    fill(50, 150, 200);
  }
  // teken de knoppen met waarden knoppen in beginscherm
  rect(knop.x, knop.y, knop.w, knop.h, 10);

  fill(0);
  textSize(28);
  textAlign(CENTER, CENTER);
  // tekst in knoppen
  text(knop.tekst, knop.x + knop.w / 2, knop.y + knop.h / 2);
  pop();
}

function toonCredits() {
  push();
  background(20);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(60);
  text("CREDITS", width / 2, 100);

  textSize(24);
  text("Gemaakt door: Justin Fung en Lukas Li\n\nOntwikkeld in p5.js", width / 2, height / 2);
  pop();

  // Terugknop
  let terugKnop = { x: width / 2 - 100, y: height - 150, w: 200, h: 60, tekst: "TERUG" };
  tekenKnop(terugKnop);
}

// teken omgekeerde piramide
function tekenOmgekeerdePiramide(aantalLagen) {
  var breedte = 900 / aantalLagen;
  var hoogte = breedte / 2;

  push(); // alleen voor piramide
  translate(0, 0);
  fill('lightgrey');
  stroke('darkgrey');
  noStroke();

  // omgekeerde piramide
  function recursieveLaag(n) {
    if (n > 0) {
      for (var nr = 0; nr < n; nr++) {
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

// variabel bal
var bal = {
  diameter: 40,
  straal: null,
  x: null,
  y: null,
  snelheidX: 16,
  snelheidY: 10,

  // Bal beweegt volgens snelheid
  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;
    // Check of bal de rand raakt, dan richting omkeren
    if (this.x < this.straal || this.x > canvas.width - this.straal) {
      this.snelheidX *= -1;
    }
    if (this.y < this.straal || this.y > canvas.height - this.straal) {
      this.snelheidY *= -1;
    }
  },
  // Bal wordt getekend
  teken() {
    push();
    fill(0,255,0);
    ellipse(this.x,this.y,this.diameter);
    pop();
  },
  
  // Check bal geraakt door Jos
  wordtGeraakt(jos) {
    // bereken afstand tussen bal en Jos
    var afstand = dist(this.x, this.y, jos.x + raster.celGrootte / 2, jos.y + raster.celGrootte / 2);
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
  constructor(r, k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  // Celgrootte berekenen
  berekenCelGrootte() {
    this.celGrootte = width / this.aantalKolommen;
  }

  // Raster tekenen
  teken() {
    push();
    stroke(100);
    strokeWeight(1);
    // Dubbele for-loop voor tekenen van raster
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        var x = kolom * this.celGrootte;
        var y = rij * this.celGrootte;

        // check of randcel
        var Randcel =
          rij === 0 ||
          rij === this.aantalRijen - 1 ||
          kolom === 0 ||
          kolom === this.aantalKolommen - 1;

        if (Randcel) {
          // check of muis in cel is
          if (mouseX > x && mouseX < x + this.celGrootte && mouseY > y && mouseY < y + this.celGrootte) {
            fill('darkblue'); // wordt donkerblauw als muis op cel is
          } else {
            fill('lightblue'); // wordt lichtblauw als normale randcel is
          }
        } else {
          noFill();
        }
        rect(x, y, this.celGrootte, this.celGrootte);
      }
    }
    pop();
  }
}

// speler
class Jos {
  constructor() {
    this.x = 200;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
  }

  // Jos beweegt met WASD
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
    // Jos blijft binnen canvas
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
class Raket {
  constructor(x, y, snelheid) {
    this.x = x;
    this.y = y;
    this.snelheid = snelheid; // snelheid van raket
    this.sprite = null;
  }

  beweeg() {
    this.y -=this.snelheid;  // raket beweegt omhoog
    this.snelheid -= 0.1;   // snelheid verlaagt
    if (this.y < 0) { // als raket boven de rand komt
      this.y = 0; 
      this.snelheid = -this.snelheid; // richting omkeren naar beneden
    }
    if (this.y > height - 50) { // als raket bij de rand komt
      this.y = height - 50;
      this.snelheid = -this.snelheid; // richting omkeren naar boven
    }
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }

  wordtGeraakt(jos) {
    // Bereken de afstand tussen de raket en Jos (midden van de raket, want this.x en this.y zijn de linker bovenhoek)
      var raketMiddenX = this.x + raster.celGrootte / 2;
      var raketMiddenY = this.y + raster.celGrootte / 2;
      var afstand = dist(raketMiddenX, raketMiddenY, jos.x + raster.celGrootte / 2, jos.y + raster.celGrootte / 2);
      return afstand < this.straal + raster.celGrootte / 2;
  }

}

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
    // Vijanden blijven binnen canvas
    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  // Vijanden worden getekend
  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

// achtergrond
function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

// laadt textsize verloren / gewonnen in
function gameover(){
  textFont("Verdana");
  textSize(90);
  background('red');
  fill('white');
  text("Je hebt verloren...",30,300);
  
  // COMMENTAAR
  commentaar = ["Jammer","Probeer opnieuw","Geef niet op!","Kom op!","Helaas", "Je kunt het"]
  
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
  alice = new Vijand(700,700);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(100,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  Cindy = new Vijand(200,500);
  Cindy.stapGrootte = 1*eve.stapGrootte;
  Cindy.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  // laadt raketten in met random snelheid en positie
  raket1 = new Raket(random(500,850), 600, random(5, 11));
  raket1.sprite = loadImage("images/sprites/Raket.jpg");
  raket1.straal = raster.celGrootte / 2;
  raket2 = new Raket(random(500,850), 600,random(5, 11));
  raket2.sprite = loadImage("images/sprites/Raket.jpg");
  raket2.straal = raster.celGrootte / 2;
  raket3 = new Raket(random(500,850), 600, random(5, 11));
  raket3.sprite = loadImage("images/sprites/Raket.jpg");
  raket3.straal = raster.celGrootte / 2;

  // laadt bal in
  bal.straal = bal.diameter/2;
    bal.x = bal.straal;
    bal.y = canvas.height/4;
}

// Tekent alles op scherm
function draw() {
  // Tekent beginscherm
  if (schermStatus === 1) {
    beginScherm();
    return;
  } else if (schermStatus === 2) {
    toonCredits();
    return;
  }
  
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
  
  raket1.beweeg();
  raket1.toon();

  raket2.beweeg();
  raket2.toon();

  raket3.beweeg();
  raket3.toon();
  
  bal.beweeg();
  bal.teken();
  
  // Levens (afbeeldingen komen misschien hier)
  text("Aantal levens = " +leven+"",1,25);

  // Timer
  text("Tijd over = " +timer+"",1,50);
  // timer gaat omlaag gebaseerd op de frameRate dat 10 is
  if (frameCount % 10 == 0 && timer > 0) {
    timer --;
  }

  // Check of timer op is
  if (timer == 0)
    gameover();

  // Check of speler geraakt door vijand
  if (
    eve.wordtGeraakt(alice) || 
    eve.wordtGeraakt(bob) ||
    eve.wordtGeraakt(Cindy)){
    leven --;
  }
  
  // Check of speler geraakt door raket en reset raketten positie
  if (raket1.wordtGeraakt(eve)) {
    leven--;
    raket1.x = random(500,850);
    raket1.y = 600;
    raket1.snelheid = random(5, 11);
  }else if (raket2.wordtGeraakt(eve)) {
    leven--;
    raket2.x = random(500,850);
    raket2.y = 600;
    raket2.snelheid = random(5, 11);
  } else if (raket3.wordtGeraakt(eve)) {
    leven--;
    raket3.x =random(500,850);
    raket3.y = 600;
    raket3.snelheid = random(5, 11);
  }

  // Check of speler geraakt door bal
  if (bal.wordtGeraakt(eve)) {
    leven ++;
    // Reset bal positie
    bal.x = random(bal.straal, canvas.width - bal.straal);
    bal.y = random(bal.straal, canvas.height - bal.straal);
    // niet meer dan 5 levens
    if (leven >= 5){
      leven = 5;
    }
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

// Zorgt dat het spel begint als je op een toets drukt
function mousePressed() {
  if (schermStatus === 1) {
    // START knop
    if (
      mouseX > startKnop.x &&
      mouseX < startKnop.x + startKnop.w &&
      mouseY > startKnop.y &&
      mouseY < startKnop.y + startKnop.h
    ) {
      schermStatus = 0; // start spel
    }
    // CREDITS knop
    else if (
      mouseX > creditsKnop.x &&
      mouseX < creditsKnop.x + creditsKnop.w &&
      mouseY > creditsKnop.y &&
      mouseY < creditsKnop.y + creditsKnop.h
    ) {
      schermStatus = 2; // naar credits
    }
  }

  //Terugknop in het credits-scherm zodat je terug kan naar het beginscherm
  else if (schermStatus === 2) {
    let terugKnop = { x: width / 2 - 100, y: height - 150, w: 200, h: 60 };
    if (
      mouseX > terugKnop.x &&
      mouseX < terugKnop.x + terugKnop.w &&
      mouseY > terugKnop.y &&
      mouseY < terugKnop.y + terugKnop.h
    ) {
      schermStatus = 1; //terug naar beginscherm
    }
  }
}