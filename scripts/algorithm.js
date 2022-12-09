/*jshint esversion: 8 */
// noprotect


/**
  Abstract class for an algorithm executor
*/
class Algorithm {
  /**
    Constructor for an algorithm executor
  */
  constructor() {
    if(this.constructor == Algorithm) {
      throw new Error("Abstract classes cannot be instantiated.");
    }
    
    this.isReady = false;
    this.stepThrough = false;
    this.stage = 0;   
    this.continueExecution = false;
    this.hasStarted = false;
    
    this.name = "";
    this.description = "";
    this.complexity = "";
  }
  
  /**
    Sets the active line to a given stage in order to be highlighted and then asynchronously waits for approval to continue
    
    @params:
      stage - The stage in the pseudocode to set as active
  */
  async setstage(stage) {
    //Set the stage
    this.stage = stage;
    
    //Wait until the application gives the go-ahead to continue
    do {
      await sleep(sleepTime);
    } while(!this.isReady);
    
    //If we are in stepthrough mode then flip the ready flag so that we stop on the next step
    if(this.stepThrough && this.isReady)
      this.isReady = false;
    return this.continueExecution;
  }
  
  /**
    Abstract method for an algorithm's main execution
  */
  async execute(robotList) {
    throw new Error("Method 'execute()' must be implemented");
  }
  
  /**
    Abstract method to fetch an algorithm's pseudocode array
  */
  getPseudo() {
    throw new Error("Method 'getPseudo()' must be implemented");
  }
}