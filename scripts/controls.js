//Array of line coordinates to draw in a given draw call
var linearr;

//Array of robots to mark as highlighted in a given draw call
var highlightedRobots;

/**
  Empties the special drawing arrays
*/
function initializeTrackers() {
  linearr = [];
  highlightedRobots = [];
}

/**
  Creates a given number of robots at random coordinates
  
  @param:
    numRobots - The number of robots to generate
    
  @returns:
    A list of robots
*/
function createRobots(numRobots) {
  var tmp = [];
  
  for(let i = 0; i < numRobots; i++) {
    tmp.push(new Robot(randomNumber(ROBOT_SIZE / 2, CANVAS_SIZE - ROBOT_SIZE), randomNumber(ROBOT_SIZE / 2, CANVAS_SIZE - ROBOT_SIZE)));
  }
  
  return tmp;
}

/**
  Sets the sample size for the input set
  
  @params:
    sampleSize - The desired size of the sample set
*/
function setSampleSize(sampleSize) {
  resetExecution(); 
  sampleLabel.elt.textContent = sampleSize; 
  robotList = createRobots(sampleSize);
  initializeTrackers();
}

/**
  Sets the program instruction execution speed
  
  @params:
    speed - The speed in milliseconds
*/
function setSpeed(speed) {
  sleepTime = speed;
  speedLabel.elt.textContent = speed / 1000 + "s";
}

/**
  Resets the robot swarm to its initial state
*/
function resetInput() {
  for(var i = 0; i < robotList.length; i++) {
    robotList[i].reset();
  }
  
  initializeTrackers();
}

/**
  Resets the current algorithm executor to its initial state
*/
function resetExecution() {
  executor.continueExecution = false;
  executor.hasStarted = false;
  
  resetInput();
  executor = strToAlgo(curAlgo);
}

/**
  Runs the current algorithm executor's algorithm
*/
function runExecution() {
  executor.continueExecution = true;
  executor.isReady = true;
  executor.stepThrough = false;
  
  if(!executor.hasStarted) {
    executor.hasStarted = true;
    executor.execute(robotList);
  }
}

/**
  Advances a single step into an algorithm executor's algorithm
*/
function stepThrough() {
  if(!executor.hasStarted) {
    executor.hasStarted = true;
    executor.execute(robotList);
  }
  
  executor.continueExecution = true;
  executor.stepThrough = true; 
  executor.isReady = true;
}

/**
  Changes the current algorithm to a given value from the dropdown menu
  
  @params:
    val - The name of the algorithm to change to
*/
function changeAlgo(val) {
  curAlgo = val;
  cleanSlate();
}

/**
  Creates the buttons for program control
*/
function createControlButtons() {
  let container = document.getElementById("controlBar");
  
  //Create the Run button
  let runButton = createButton('Run');
  runButton.addClass("button");
  runButton.mousePressed(function() {runExecution()});
  runButton.parent(container);
  
  //Create the Step button
  let stepButton = createButton('Step');
  stepButton.addClass("button");
  stepButton.mousePressed(function() {stepThrough()});
  stepButton.parent(container);
  
  //Create the reset button
  let resetButton = createButton('Reset');
  resetButton.addClass("button");
  resetButton.mousePressed(function() {resetExecution()});
  resetButton.parent(container);
  
  //Create the algorithm selector dropdown
  let sel = createSelect();
  sel.addClass("button");
  sel.option('Shortest Edge');
  sel.option('Makespan');
  sel.selected(curAlgo);
  sel.changed(function() {changeAlgo(sel.value())});
  sel.parent(container);
}

/**
  Creates the sliders for program control
*/
function createControlSliders() {
  let container = document.getElementById("controlBar");
  
  //Create the # of points slider
  let sampleGroup = createDiv('Sample Size<br>');
  sampleGroup.addClass("control");
  sampleGroup.parent(container);
  let sampleSlider = createSlider(1, 300, sampleSize, 1);
  sampleSlider.addClass("slider");
  sampleSlider.input(function() {setSampleSize(sampleSlider.value())});
  sampleSlider.parent(sampleGroup);
  sampleLabel = createSpan(sampleSlider.value());
  sampleLabel.elt.style.color = "black";
  sampleLabel.parent(sampleGroup);
  
  //Create the time per instruction slider
  let speedGroup = createDiv('Time Per Instruction<br>');
  speedGroup.addClass("control");
  speedGroup.parent(container);
  let speedSlider = createSlider(0, 2000, sleepTime, 500);
  speedSlider.addClass("slider");
  speedSlider.input(function() {setSpeed(speedSlider.value())});
  speedSlider.parent(speedGroup);
  speedLabel = createSpan(speedSlider.value() / 1000 + "s");
  speedLabel.elt.style.color = "black";
  speedLabel.parent(speedGroup);
}