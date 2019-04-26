int totals = 100;
float limitMin = 15;
float limitMax = 150;
float speedMin = 0.5;
float speedMax = 5;

float[] x = new float[totals];
float[] y = new float[totals];
float[] speed = new float[totals];
float[] particleX = new float[totals];
float[] limit = new float[totals];
Boolean showBackground = true;

void setup() {
  size(800, 800);
  fillArrays();
}

void draw() {
  if(random(100) > 80) {
    showBackground = !showBackground;
  }
  if(showBackground) {
    background(0);
  } 
  showSystem();
}

void keyPressed() {
  showBackground = !showBackground;
}

/*arrayFunctions*/

void fillArrays() {
    for(int i = 0; i < totals; i++) {
        x[i] = random(width);
        y[i] = random(height);
        speed[i] = random(speedMin, speedMax);
        limit[i] = random(limitMin, limitMax);
        particleX[i] = 0.0;
        /*println("Particle: ", i, "Limit: ", limit[i]);*/
    }
}

void showSystem() {
    for(int i = 0; i < totals; i++) {
        stroke(255);
        line(x[i], y[i], x[i]+limit[i], y[i]);

        particleX[i] += speed[i];

        fill(255);
        ellipse(x[i]+particleX[i], y[i], 5, 5);

        if(particleX[i] > limit[i]) {
            x[i] = random(width);
            y[i] = random(height);
            speed[i] = random(speedMin, speedMax);
            limit[i] = random(limitMin, limitMax);
            particleX[i] = 0.0;
        }

        if(i > 0) {
          line(x[i]+ particleX[i], y[i], x[i-1] + particleX[i-1], y[i-1]);
        }
    }

}

