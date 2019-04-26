import java.util.*; 

class Alien {
    public PImage img;
    public float ax;
    public float ay;
    public float axspeed;
    public float asize;
    public Boolean isShot;
    public long shotTime;
    public float particleX;
    public float particleY;

    public Alien() {
        initialize();
    }

    public void initialize() {
        img = loadImage("images/space_invader_" + int(random(1, 6)) + ".png");
        ax = width;
        ay = random(0, height);
        axspeed = random(1, 5);
        asize = random(30, 50);
        isShot = false;
    }

    public void invade() {
        if(isShot) {
            explode();
        } else {
            ax -= axspeed;
            image(img, ax, ay, asize, asize);

            if(ax < 0) {
                ax = width;
            }
        }
    }

    public void explode() {
        Date d = new Date();
        long timePassed = d.getTime() - shotTime;

        if(timePassed > 1000) {
            initialize();
        }

        if(timePassed > 0 && timePassed < 500) {
            float weight = 500/timePassed;
            strokeWeight(weight);
            stroke(255,255,0);
            line(mouseX, mouseY, ax, ay);
            noStroke();
            fill(255,255,0);
            ellipse(ax, ay, asize, asize);
            showParticle(mouseX, mouseY, ax, ay, int(100*timePassed/500));
        }

        noStroke();
        fill(178, 34, 34);
        float explosionSize = timePassed/30+asize;
        ellipse(ax, ay, explosionSize, explosionSize);
        fill(255, 140, 0);
        float explosionCoreSize = timePassed/30;
        ellipse(ax, ay, explosionCoreSize, explosionCoreSize);
    }

    public void getShot() {
        Date d = new Date();
        isShot = true;
        shotTime = d.getTime();
    }
}

class Player {
    public PImage img;

    public Player() {
        img = loadImage("images/player.png");
    }

    public void fight() {
        imageMode(CENTER);
        noStroke();
        //translate(mouseX, mouseY);
        //rotate(HALF_PI);
        image(img, mouseX, mouseY, 50, 50);   
    }

    public void fire(Alien alien) {
        alien.getShot();
    }
}

int totalAliens = 20;
Alien[] aliens = new Alien[totalAliens];
Player player;
void setup(){
  /*size(800, 800);*/
  size(screen.width, screen.height);
  for(int i = 0; i < totalAliens; i++) {
      aliens[i] = new Alien();
  }
  player = new Player();
} 

void draw(){
  background(0);
  imageMode(CENTER);
  for(int i = 0; i < aliens.length; i++) {
      aliens[i].invade();
  }
  player.fight();
}

void keyPressed(){
    for(int i = 0; i < aliens.length; i++) {
        int randNum = int(random(i, aliens.length));
        if(!aliens[randNum].isShot) {
            Alien alien = aliens[randNum];
            player.fire(alien);
            break;
        }
    }
    /*if(key == '1') saveFrame("images/space_invader_######.png");*/
} 

void showParticle(float px, float  py, float qx, float qy, int percent) {
    float ry = py - qy;
    float rx = px - qx;
    float a = ry / -rx;
    float xdiff = px - qx;
    float x = -xdiff * percent / 100;
    float y = a * x;
    float resx = mouseX + x;
    float resy = mouseY - y;
    fill(255,255,0);
    ellipse(resx, resy, 20, 20);
}   
