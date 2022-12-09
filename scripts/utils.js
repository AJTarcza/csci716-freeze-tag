/**
  Converts a string name into its respective algorithm class
  
  @params:
    str - The name to lookup
  
  @returns:
    The algorithm class for the string if valid
*/
function strToAlgo(str) {
  switch(str.toLowerCase()) {
    case "shortest edge":
      return new ShortEdge();
    case "makespan":
      return new Makespan();
    default:
      return null;
  }
}

/**
  Generates a random number between two values
  
  @params:
    min - The minimum value for the generated number
    max - The maximum value for the generated number
    
  @returns:
    The randomly generated number
*/
function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
}

/**
  Simulates a thread sleep call through use of an async promise
  
  @params:
    millisecondsDuration - The number of milliseconds to sleep for
*/
function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}