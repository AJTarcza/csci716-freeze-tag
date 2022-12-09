/*jshint esversion: 8 */
// noprotect

/**
  Class for the Shortest Edge First algorithm
*/
class ShortEdge extends Algorithm { 
  /**
    Constructor for the makespan algorithm. Sets up basic information
  */
  constructor() {
    super(constructor)
    this.name = "Shortest Edge First";
    this.complexity = "O(n² logn)"
    this.description = "My custom naive approach to solving the problem where each robot simply checks the distance between itself and all other robots and goes to the one that is closest to itself at the time";
  }
  
  /**
    Finds the closest robot to a given robot in a set of asleep robots
    
    @params:
      robot - The source robot
      asleepSet - The set of asleep robots to search
      
    @returns:
      The closest robot to the source robot
  */
  findClosest(robot, asleepSet) {
    return asleepSet.reduce((a, b) => robot.distance(a) < robot.distance(b) ? a : b);
  }
  
  /**
    Runs this algorithm's main execution method
    
    @params:
      robotList - The list of robots to awaken
  */
  async execute(robotList) {
    let asleepSet = robotList.slice();
    let awakenedSet = [];
    if(!await this.setstage(0)) return;
    
    //Wake up the initial robot
    awakenedSet.push(asleepSet.splice(asleepSet.length - 1, 1)[0]);
    awakenedSet[0].awaken();
    if(!await this.setstage(1)) return;
    
    //Run until all robots are awake
    while(asleepSet.length > 0) {
      if(!await this.setstage(2)) return;
      
      //Reset visualization trackers
      highlightedRobots = [];
      let iterationList = [];
      let iterationLines = [];
      
      //Loop through all of the awakened robots
      for(let i = 0; i < awakenedSet.length; i++) {
        if(!await this.setstage(3)) return;
        if(asleepSet.length == 0)
          break;

        //Find the closest robot  
        let closest = this.findClosest(awakenedSet[i], asleepSet);
        highlightedRobots.push(closest);
        if(!await this.setstage(4)) return;
        
        //Add the directional lines for this awakening to the draw list
        iterationLines.push([awakenedSet[i].x, awakenedSet[i].y, closest.x, closest.y]);
        awakenedSet[i].x = closest.x;
        awakenedSet[i].y = closest.y;

        //Add the closest to the awakening set
        iterationList.push(asleepSet.splice(asleepSet.indexOf(closest), 1)[0]);
        if(!await this.setstage(5)) return;
      }
      
      //Awaken the entire awkening set all at once to simulate parallel processing
      for(let i = 0; i < iterationList.length; i++) {
        iterationList[i].awaken();
        awakenedSet.push(iterationList[i]);
        linearr.push(iterationLines[i]);
      }
      if(!await this.setstage(6)) return;
    }
  }
  
  /**
    Returns an array containing each line of pseudocode for this algorithm
  */
  getPseudo() {
    return [
      "1.  <i>awakenedSet</i>, <i>asleepSet</i> <= []",
      "2.  Wake up the first robot and add it to <i>awakenedSet</i>",
      "3.  while <i>asleepRobots</i> is not empty:",
      "4.    for every robot in <i>awakenedSet</i>:",
      "5.       find the closest robot in the <i>asleepRobots</i>",
      "6.       add the closest robot to <i>awakeningSet</i>",
      "7.    awaken every robot in <i>awakeningSet</i> simultaneously",
    ];
  }
}