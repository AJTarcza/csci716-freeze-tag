//Size of the canvas in pixels
const CANVAS_SIZE = 600;

//Size of a given robot in pixels
const ROBOT_SIZE = 5;

//Sample size for the input set
var sampleSize = 20;

//Time to sleep in between instructions in milliseconds
var sleepTime = 500;

//Labels for control sliders
var sampleLabel;
var speedLabel;

//List of robots to run the algorithm on
var robotList = [];

//String representation of the active algorithm
var curAlgo = "shortest edge";

/**
  Initializes the elements of the canvas and pseudocode block to a start state
*/
function cleanSlate() {
  //Reset all inputs and trackers
  initializeTrackers();
  resetInput();
  
  //Create the new algorithm executor and fetch its pseudocode block
  executor = strToAlgo(curAlgo);
  pseudoArr = executor.getPseudo();
  
  //Clear the current pseudocode
  select("#pseudo").elt.innerHTML = "";
  
  //Create the algorithm title, runtime, and description labels
  select("#pseudo").child(createElement("h3", executor.name));
  select("#pseudo").child(createElement("p", executor.complexity));
  select("#pseudo").child(createElement("p", executor.description));
  
  //Create the pseudocode body
  for(let i = 0; i < pseudoArr.length; i++) {
    select("#pseudo").child(createElement("p", pseudoArr[i]).addClass("test"));
  }
}

/**
  Sets up the initial canvas
*/
function setup() {
  let canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  canvas.parent(document.getElementById("sketch"));
  
  robotList = createRobots(sampleSize);
  
  cleanSlate();
  
  createControlButtons();
  createControlSliders();
}

/**
  Draw loop that runs every frame
*/
function draw() {
  background(220);
  
  //Draw the robots
  for(let i = 0; i < robotList.length; i++) {
    let curBot = robotList[i];
    
    if(curBot.isAwake())
        fill(255, 0, 0);
    else if(highlightedRobots.includes(curBot))
      fill(0, 255, 0);
    else
      fill(255);
    
    ellipseMode(CENTER);
    circle(curBot.drawX, curBot.drawY, ROBOT_SIZE);
      
  }
  
  //Draw any given lines
  for(let i = 0; i < linearr.length; i++) {
      let curLine = linearr[i];
      
      //If the optional color code was supplied for this line segment then override the stroke
      if(curLine.length == 5) {
        colorCode = curLine[4];
        stroke(colorCode[0], colorCode[1], colorCode[2]);
      }
      line(curLine[0], curLine[1], curLine[2], curLine[3]);
      stroke(0);
  }
  
  //Highlight the pseudocode
  var pseudoNodes = selectAll("#pseudo .test");
  for(let i = 0; i < pseudoNodes.length; i++) {
    if(i == executor.stage)
      pseudoNodes[i].elt.style.backgroundColor = "yellow";
    else
      pseudoNodes[i].elt.style.backgroundColor = "";
  }
  
}