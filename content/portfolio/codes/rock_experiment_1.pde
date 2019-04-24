PImage rock1; // X Movement
float x1 = 400;
float y1 = 300;
float speed1 = 3.4;
Boolean isItOn1 = true;
PImage rock2; // Y movement
float x2 = 400;
float y2 = 300;
float speed2 = 5.8;
Boolean isItOn2 = true;
PImage rock3; // DIAGONAL
float x3 = 400;
float y3 = 300;
float speed3 = 5.8;
Boolean isItOn3 = true;

void setup(){
  size(800,800, FX2D);
 //size(800,600);
 background(255);
 rock1 = loadImage("images/rock1.png");
 rock2 = loadImage("images/rock2.png");
 rock3 = loadImage("images/rock3.png");
} 

void draw(){
  imageMode(CENTER);

 // SPEED
 x1 += speed1;
 if(x1 > width) x1 = 0;
 y2 += speed2;
 if(y2 > height) y2 = 0;
 x3 += speed3;
 y3 += speed3;
 if(x3 > width || y3 > height){
 x3 = 0;
 y3 = 0;
 }

 // THE IMAGES
 if(isItOn1)image(rock1, x1, y1, 300, 300);
 if(isItOn2)image(rock2, x2, y2, 300, 300);
 if(isItOn3)image(rock3, x3, y3, 300, 300);

}


void keyPressed(){
 // RANDOM
 if(key == '1') y1 = random(height);
 if(key == '2') x2 = random(width);
 if(key == '3'){
 x3 = random(width);
 y3 = random(height);
 }
 // ON OFF
 if(key == '4') isItOn1 = !isItOn1;
 if(key == '5') isItOn2 = !isItOn2;
 if(key == '6') isItOn3 = !isItOn3;
 if(key == ' ') saveFrame("line-######.png");
} 
