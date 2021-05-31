var song;
var font;
var hu = 0;
var vehicles = [];

var texts = ['THE WORLD','IS COLLAPSING', 'AND YOU ARE',' THE SAVIOR'];
var nextT = 0;
var maxChangeForce = 4;

var instructions = [];
var insText = '';
let Sound, amplitude;
function preload() {
    font = loadFont('Block.otf');
  
    song = loadSound('8002.mp3');
}

function setup() {
    createCanvas(800, 400,WEBGL);
  amplitude = new p5.Amplitude();
    background(25);
    colorMode(HSB, 155);
    song.loop();

    var bounds = font.textBounds(texts[nextT], 0, 0, 192);
    var posx = width / 2 - bounds.w / 2;
    var posy = height / 2.1 + bounds.h / 2.1;
    var points = font.textToPoints(texts[nextT], posx, posy, 192, {
        sampleFactor: 0.1
    });
    for (var i = 0; i < points.length; i++) {
        var pt = points[i];
        var vehicle = new Vehicle(pt.x, pt.y);
        vehicles.push(vehicle);
    }
    var boundsIns = font.textBounds(insText, 0, 0, 30);
    var posxIns = width / 2 - boundsIns.w / 2;
    var posyIns = height / 6 + boundsIns.h / 2;
    var insAr = split(insText, ' ');
    for (var i = 0; i < insAr.length; i++) {
        var bounds2 = font.textBounds(insAr[i], 0, 0, 30);
        var posx2 = posxIns;
        var posy2 = posyIns;
        posxIns += bounds2.w + 10;
        var points2 = font.textToPoints(insAr[i], posx2, posy2, 30, {
            sampleFactor: 0.3
        });
        for (var j = 0; j < points2.length; j++) {
            var pt = points2[j];
            var v = new Vehicle(pt.x, pt.y, 3);
            instructions.push(v);
        }
    }
  textFont(font);
}

function draw() {
  
  //textSize(40);
  //text("The world is collapsing, and you are the savior",-400,0);

 
  rotateX(frameCount * 0.001);
  rotateY(frameCount * 0.001);
  translate(-width/2, -height/2);
    background(21);
    let level = amplitude.getLevel();
  let r = map(level,0,1,0,1000);
    noStroke();  
  for (var i = 0; i < instructions.length; i++) {
    var v = instructions[i];
    v.behaviors();
    v.update();
    v.show();
  } 

    for (var i = 0; i < vehicles.length; i++) {
        var v = vehicles[i];
        v.behaviors();
        v.update();
        v.show();
    }  
}

function mouseClicked() {
    nextT++;
    if (nextT > texts.length - 1) {
        nextT = 0;
    }

    var bounds = font.textBounds(texts[nextT], 0, 0, 192);
    var posx = width / 2 - bounds.w / 2;
    var posy = height / 2 + bounds.h / 2;

    var points = font.textToPoints(texts[nextT], posx, posy, 192, {
        sampleFactor: 0.1
    });

    if (points.length < vehicles.length) {
        var toSplice = vehicles.length - points.length;
        vehicles.splice(points.length - 1, toSplice);

        for (var i = 0; i < points.length; i++) {
            vehicles[i].target.x = points[i].x;
            vehicles[i].target.y = points[i].y;

            var force = p5.Vector.random2D();
            force.mult(random(maxChangeForce));
            vehicles[i].applyForce(force);
        }
    } else if (points.length > vehicles.length) {

        for (var i = vehicles.length; i < points.length; i++) {
            var v = vehicles[i - vehicles.length].clone();

            vehicles.push(v);
        }

        for (var i = 0; i < points.length; i++) {
            vehicles[i].target.x = points[i].x;
            vehicles[i].target.y = points[i].y;

            var force = p5.Vector.random2D();
            force.mult(random(maxChangeForce));
            vehicles[i].applyForce(force);
        }

    } else {
        for (var i = 0; i < points.length; i++) {
            vehicles[i].target.x = points[i].x;
            vehicles[i].target.y = points[i].y;

            var force = p5.Vector.random2D();
            force.mult(random(maxChangeForce));
            vehicles[i].applyForce(force);
        }
    }
}