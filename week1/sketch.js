// change the quotes in this array. Be mindful of the quotation marks!
// this is the only part of the file you need to edit!

const quotes = [
  { text: "a type of computer programming in which the goal is to create something expressive instead of something functional", source: "Wikipedia" },
  { text: "a craft that brings beautiful and unusual ideas to life", source: "Tim Rodenbröker" },
  { text: "a new creative tool in the arsenal of artists", source: "Asmati Chibalashvili, Igor Savchuk, Svitlana Olianina, Ihor Shalinskyi & Yuriy Korenyuk" },
  { text: "a world of imagination and problem-solving that's every bit as inventive as painting on a canvas", source: "Simpsons Creative" },
  { text: "where programming meets art, and code becomes a medium for expressing artistic ideas", source: "Cratecode" },
  { text: "expressive, interactive, and dynamic art-something that's not always achievable with traditional mediums", source: "Okoye Ndidiamaka" },
  { text: "reshaping our perceptions of art, pushing boundaries, and inspiring new generations of creators to explore the limitless possibilities at the intersection of art and technology", source: "Javier Marc" },
  { text: "a deliberate act of letting go and seeing where the process takes you", source: "Patrick Hübner" }
];
// no need to edit anything below this line! 
// if you have made an error, you can check your history to see what might have gone wrong

// a variable that holds the current quote
let current = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Seed with millis() so each page load gives a different quote.
  randomSeed(millis());
  textSize(32);
  fill(255, 0, 255);
  // calls the function to pick a quote
  pickQuote();
}

function pickQuote() {
  // take a random number and use that to identify what quote to use
  current = quotes[floor(random(quotes.length))];
}

function draw() {
  background(137, 207, 240); // set the background color
  drawQuote();  // draw the quote on screen
}

function drawQuote() {   // draw text
  textAlign(CENTER, CENTER);
  text("Creative Coding is.....", width / 2, height / 2 - 48);
  textStyle(BOLD);
  text("'" + current.text + "'", width * 0.1, height / 2 - 100, width * 0.8, 300);
  textAlign(RIGHT, CENTER);
  text("-" + current.source, width - 100, height - 100);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function newQuote() {
  pickQuote();
  redraw();
}

function mousePressed() {
  newQuote();
}
