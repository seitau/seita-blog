import processing.pdf.*;

float x = 500;
float y = 400;
float xspeed = 4;
float yspeed = 3;

class Particle {
    public float px;
    public float py;
    public float pxspeed;
    public float pyspeed;
    public float particleSize;
    public color pc;

    public Particle(float x, float y, float xspeed, float yspeed, color c) {
        px = x;
        py = y;
        pxspeed = xspeed;
        pyspeed = yspeed;
        pc = c;
    }

    public void move() {
        particleSize = random(20, 80);
        px = px + pxspeed;
        py = py + pyspeed;
        strokeWeight(random(0.5, 2));
        fill(pc, random(30, 40));
        ellipse(px, py, particleSize, particleSize);

        if(px > 800) {
            pxspeed = -pxspeed; 
        } else if (px < 0) {
            pxspeed = -pxspeed;
        }

        if(py > 800) { 
            pyspeed = -pyspeed; 
        } else if (py < 0) {
            pyspeed = -pyspeed;
        }
    }
}

Particle[] particles = new Particle[10];
void setup() {
    size(800, 800);
    background(255);
    for(int i = 0; i < 10; i++) {
        particles[i] = new Particle(random(0, 800), random(0, 800), random(-15, 15), random(-15, 15), color(random(255), random(255), random(255)));
    }
}

void draw() {
    for(int i = 0; i < particles.length; i++) {
        particles[i].move();
    }
}

