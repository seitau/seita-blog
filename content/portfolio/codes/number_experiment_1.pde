import processing.pdf.*;

void setup() {
    size(800, 800);
    background(255); 
}

int startMin = minute();
boolean record = true;
void draw() {
    if (record) {
        beginRecord(PDF, String.format("images/screenshot_%s%s%s%s%s.pdf", month(), day(), hour(), minute(), second()));
        record = false;
    }

    String[] fonts_names = {
        //"PermanentMarker-Regular.ttf",
        "VT323-Regular.ttf",
        //"Yellowtail-Regular.ttf",
        //"Ultra-Regular.ttf",
        //"Vidaloka-Regular.ttf"
    };

    PFont[] fonts = new PFont[fonts_names.length];
    for (int i = 0; i < fonts_names.length; i++) {
        println(i);
        PFont font = createFont(fonts_names[i], 32);
        fonts[i] = font;
    }

    //PFont font_0 = createFont("PermanentMarker-Regular.ttf", 32);
    //PFont font_1 = createFont("VT323-Regular.ttf", 32);
    //PFont font_2 = createFont("Yellowtail-Regular.ttf", 32);
    //PFont font_3 = createFont("Ultra-Regular.ttf", 32);
    //PFont font_4 = createFont("Vidaloka-Regular.ttf", 32);

    println(millis()%5);
    //textFont(fonts[millis()%5]);
    
    float s = float(second());
    color randomColor = color(random(255), random(255), random(255));
    fill(randomColor, 10);
    textFont(fonts[0]);
    textSize(100);
    text(int(s), mouseX, mouseY);
    
    randomColor = color(random(255), random(255), random(255));
    fill(randomColor, 10);
    text(int(s), pmouseX, pmouseY);
    //text(int(s), 60*(m+1), yPosition);
    //text(m, 60, yPosition);
    //text(h, 60, 60*s);

    //line(mouseX, pmouseY, pmouseX, mouseY); 
}

void mouseDragged() {
    //ellipse(mouseX, mouseY, 0, 100);  
}

void keyPressed() {
    endRecord();
    record = true;
    //save(String.format("images/screenshot_%s%s%s%s%s.pdf", month(), day(), hour(), minute(), second()));
}
