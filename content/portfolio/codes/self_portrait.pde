// Getting the color from an image
// Using: "Persistence of Memory" by Salvador Dalí
// Inspired by: "Algorithmic Portrait" by Alex Schwartzberg

PImage imgDali;
int imgDaliWidth, imgDaliHeight;
PImage imgPortraitMono;
PImage imgPortraitColor;
color[] colors = new color[10];
String imgPath = "codes/images/algorithmic_portrait/";
int weight;

void setup(){
    size(800, 800);
    imgDali = loadImage(imgPath + "persistence_of_memory.jpg");
    /*imgDaliWidth = imgDali.width;*/
    /*imgDaliHeight = imgDali.height;*/
    imgDaliWidth = 500;
    imgDaliHeight = 500;
    imgPortraitMono = loadImage(imgPath + "me.png");
    imgPortraitMono.filter(GRAY);
    imgPortraitColor = loadImage(imgPath + "me.png");
    frameRate(1);
}

void draw(){
    extractColors();
    /*println(colors);*/
    image(imgPortraitColor, 0, 0);
    for(int y = 0; y < imgPortraitMono.height; y += 10){
        for(int x = 0; x < imgPortraitMono.width; x += 5){
            weight = adjustWeight(imgPortraitMono.get(x, y));
            if(weight == 0) {
                continue;
            }
            stroke(colors[weight-1]);
            strokeWeight(weight);
            line(x, y, x+1, y);
        }
    }
}

int adjustWeight(color c){
    for(int i = 10; i > 0; i--) {
        if(c < -16 * 100000 * i) {
            return i;
        }
    }
    return 0;
}

void extractColors() {
    for(int i = 0; i < colors.length; i++) {
        int x = int(random(imgDaliWidth));
        int y = int(random(imgDaliHeight));
        color tempColor = imgDali.get(x, y);
        colors[i] = tempColor;
    }
}

void keyPressed(){
    if(key == '1') saveFrame("images/portrait_######.jpg");
} 
