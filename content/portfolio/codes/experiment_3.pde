import processing.pdf.*;

float x = 700;
float y = 400;
float xspeed = 4;
float yspeed = 3;

void setup() {
  size(800, 800);
  background(225);
}

boolean record = true;
void draw() {
  if (record) {
        beginRecord(PDF, String.format("images/screenshot_%s%s%s%s%s.pdf", month(), day(), hour(), minute(), second()));
        record = false;
    }
   float circleSize = random(5, 20);
   x = x + xspeed;
   y = y + yspeed;
   fill(random(255));
   ellipse(x, y, circleSize, circleSize);

   if(x > 800) {
     xspeed = -4; 
   } else if (x < 0) {
     xspeed = 4;
   }

   if(y > 800) { 
     yspeed = -4; 
   } else if (y < 0) {
     yspeed = 4;
   }

}

void keyPressed() {
    endRecord();
    record = true;
}
