/*jshint esversion: 8 */
// noprotect

/**
  Class for the makespan algorithm
*/
class Makespan extends Algorithm {
  /**
    Constructor for the makespan algorithm. Sets up basic information in addition to variable required for the visualization
  */
  constructor() {
    super(constructor);
    this.name = "Makespan"
    this.complexity = "O(n logn)"
    this.description = "The main idea in this algorithm is to divide a set of asleep robots into smaller subsets and once awaken the smallest set of robots by the first active robot. Afterward the remaining asleep robots at each step are awakened simultaneously by the awakened robots in the previous step. This process continues until all the robots are awakened.<br><a href='http://www.acsij.org/acsij/article/viewFile/61/57' target='_blank'>Source</a>"
    
    this.leftBound = 0;
    this.rightBound = CANVAS_SIZE;
    this.topBound = 0;
    this.bottomBound = CANVAS_SIZE;
  }
  
  /**
    Finds the leftmost, topmost, rightmost, and bottommost robots in a swarm
    
    @params:
      R - The set of robots to search
      
    @returns:
      The leftmost, topmost, rightmost, and bottommost robots in the swarm
  */
  findExtremes(R) {
    //Minimum values
    let xmin = R[0].x;
    let ymin = R[0].y;
    let xmax = R[0].x;
    let ymax = R[0].y;
    
    //Robots that hold the minimum values
    let xminRobot = R[0];
    let yminRobot = R[0];
    let xmaxRobot = R[0];
    let ymaxRobot = R[0];
    
    for(let i = 0; i < R.length; i++) {
      let x = R[i].x;
      let y = R[i].y;
      
      if(x < xmin) {
        xmin = x;
        xminRobot = R[i];
      }
      if(x > xmax) {
        xmax = x;
        xmaxRobot = R[i];
      }
      if(y < ymin) {
        ymin = y;
        yminRobot = R[i];
      }
      if(y > ymax) {
        ymax = y;
        ymaxRobot = R[i];
      }
    }
    
    return [xminRobot, yminRobot, xmaxRobot, ymaxRobot];
  }
  
  /**
    Finds the median x coordinate in a list of robots
    
    @params:
      R - The list of robots to search
      
    @returns:
      The median x coordinate of the list
  */
  findMedX(R) {
    R.sort(function(a, b){
      return a.x - b.x;
    });
    
    let i = R.length / 2;
    return i % 1 == 0 ? (R[i - 1].x + R[i].x) / 2 : R[Math.floor(i)].x;
  }
  
  /**
    Finds the median y coordinate in a list of robots
    
    @params:
      R - The list of robots to search
      
    @returns:
      The median y coordinate of the list
  */
  findMedY(R) {
    R.sort(function(a, b){
      return a.y - b.y;
    });
    
    let i = R.length / 2;
    return i % 1 == 0 ? (R[i - 1].y + R[i].y) / 2 : R[Math.floor(i)].y;
  }
  
  /**
    The main idea in this algorithm is to divide a set of asleep robots into smaller subsets and once awaken the smallest set of robots by 
    the first active robot. Afterward the remaining asleep robots at each step are awakened simultaneously by the awakened robots in the 
    previous step. This process continues until all the robots are awakened.
    
    @params:
      R - The set of robots to run this iteration on
      d - The size of the current subsection of the canvas
      depth - How many times the canvas has been divided
      
    @returns:
      The list of awakened robots
  */
  async makespan(R, d, depth = 1) {
    let awakeRobotList = [];
    let R1;
    let R2;
    
    //Clear the highlighted robots list
    highlightedRobots = [];
    
    //R < 4
    if(!await this.setstage(0)) return;
    if (R.length < 4) {
      //Wake up all of the robots in R simultaneously
      for(let i = 0; i < R.length; i++) {
        R[i].awaken();
        awakeRobotList.push(R[i]);
      }
      if(!await this.setstage(1)) return;
      return awakeRobotList;
    }
    
    //R >= 4
    else {
      if(!await this.setstage(2)) return;
      
      //Find the four extremes
      let extremes = this.findExtremes(R);
      for(let i = 0; i < extremes.length; i++) {
        highlightedRobots.push(extremes[i]);
      }
      let [xmin, ymin, xmax, ymax] = [extremes[0].x, extremes[1].y, extremes[2].x, extremes[3].y];
      if(!await this.setstage(3)) return;
      
      //Imaginary rect
      let line1 = linearr.push([xmin, ymin, xmax, ymin, [255, 0, 0]]);
      let line2 = linearr.push([xmax, ymin, xmax, ymax, [255, 0, 0]]);
      let line3 = linearr.push([xmax, ymax, xmin, ymax, [255, 0, 0]]);
      let line4 = linearr.push([xmin, ymax, xmin, ymin, [255, 0, 0]]);
      if(!await this.setstage(4)) return;
      
      //Clear the imaginary rect and extreme points
      linearr.splice(linearr.indexOf(line1), 1);
      linearr.splice(linearr.indexOf(line2), 1);
      linearr.splice(linearr.indexOf(line3), 1);
      linearr.splice(linearr.indexOf(line4), 1);
      highlightedRobots = [];
       
      //Find the median values of the current set
      let xmed = this.findMedX(R);
      let ymed = this.findMedY(R);
      
      //Depth is odd
      if(!await this.setstage(5)) return;
      if(depth % 2 != 0) {
      
        //Split R vertically
        linearr.push([xmed, this.topBound, xmed, this.bottomBound]);
        if(!await this.setstage(6)) return;
        
        //Left split
        if(!await this.setstage(7)) return;
        if((xmed - xmin) <= d / 2) {
          
          //R1 = (x,y) ∈ R | (x < xmed) or (x = xmed and y < ymed)
          R1 = (function() {
            let tmp = [];	
            
            for(let i = 0; i < R.length; i++) {
              if(R[i].x < xmed || (R[i].x == xmed && R[i].y < ymed))
                tmp.push(R[i]);
            }

            return tmp;
          })();
          
          //Highlight all of the robots in this split
          for(let i = 0; i < R1.length; i++) {
            highlightedRobots.push(R1[i])
          }
          
          //Update the boundaries
          this.rightBound = xmed;
          
          if(!await this.setstage(8)) return;
        }
        
        //Right split
        else {
          if(!await this.setstage(7)) return;
          
          //R1 = (x,y) ∈ R | (x > xmed) or (x = xmed and y > ymed)
          R1 = (function() {
            let tmp = [];	

            for(let i = 0; i < R.length; i++) {
              if(R[i].x > xmed || (R[i].x == xmed && R[i].y > ymed))
                tmp.push(R[i]);
            }

            return tmp;
          })();
          
          //Highlight all of the robots in this split
          for(let i = 0; i < R1.length; i++) {
            highlightedRobots.push(R1[i])
          }
          
          //Update the boundaries
          this.leftBound = xmed;
          
          if(!await this.setstage(10)) return;
        }
        
        R2 = R.filter(n => !R1.includes(n));
        if(!await this.setstage(11)) return;
        
        if(!await this.setstage(12)) return;
        awakeRobotList = await this.makespan(R1, d, depth + 1);
      }
      
      //Depth is even
      else {
        if(!await this.setstage(13)) return;
        
        //Split R horizontally
        linearr.push([this.leftBound, ymed, this.rightBound, ymed]);
        if(!await this.setstage(14)) return;
        
        //Top split
        if(!await this.setstage(15)) return;
        if((ymed - ymin) <= d / 2) {
          
          //R1 = (x,y) ∈ R | (y < ymed) or (y = ymed and x < xmed)
          R1 = (function() {
            let tmp = [];	

            for(let i = 0; i < R.length; i++) {
              if(R[i].y < ymed || (R[i].y == ymed && R[i].x < xmed))
                tmp.push(R[i]);
            }

            return tmp;
          })();
          
          //Highlight all of the robots in this split
          for(let i = 0; i < R1.length; i++) {
            highlightedRobots.push(R1[i])
          }
          
          //Update the boundaries
          this.bottomBound = ymed;
          
          if(!await this.setstage(16)) return;
        }
        
        //Bottom split
        else {
          if(!await this.setstage(17)) return;
          
          //R1 = (x,y) ∈ R | (y > ymed) or (y = ymed and x > xmed)
          R1 = (function() {
            let tmp = [];	

            for(let i = 0; i < R.length; i++) {
              if(R[i].y > ymed || (R[i].y == ymed && R[i].x > xmed))
                tmp.push(R[i]);
            }

            return tmp;
          })();
          
          //Highlight all of the robots in this section
          for(let i = 0; i < R1.length; i++) {
            highlightedRobots.push(R1[i])
          }
          
          //Update the boundaries
          this.topBound = ymed;
          
          if(!await this.setstage(18)) return;
        }
        
        //R2 = R - R1
        R2 = R.filter(n => !R1.includes(n));
        if(!await this.setstage(19)) return;
        
        if(!await this.setstage(20)) return;
        awakeRobotList = await this.makespan(R1, d / 2, depth + 1);
      }
    }
    
    //Wake up all of the robots in R2 simultaneously
    for(let i = 0; i < R2.length; i++) {
      R2[i].awaken();
      awakeRobotList.push(R2[i]);
    }
    if(!await this.setstage(21)) return;
    
    if(!await this.setstage(22)) return;
    return awakeRobotList;
  }
  
  /**
    Runs this algorithm's main execution method
    
    @params:
      robotList - The list of robots to awaken
  */
  async execute(robotList) {
    await this.makespan(robotList, CANVAS_SIZE);
  }
  
  /**
    Returns an array containing each line of pseudocode for this algorithm
  */
  getPseudo() {
    return [
      "1.  <i>if</i> R < 4 <i>then</i>",
      "2.    <i>awakeRobotList</i> <= <i>wakeup set</i> R <i>by awakeRobotList</i>",
      "3.  <i>if</i> R >= 4 then",
      "4.    <i>Find four extreme points, the leftmost, the lowest, the rightmost and the highest of R</i>",
      "5.    <i>Create Imaginary Rect((xmin, ymin), (xmax, ymax))</i>",
      "6.    <i>if depth is odd then</i>",
      "7.      <i>Split R into two subsets with a vertical imaginary line T through the median x-coordinate of the points in R. In case there are multiple points with the same x-coordinate, pick the one with the smallest y-value. Call them m = (xmed, ymed)</i>",
      "8.         <i>if</i>((xmed - xmin) <= d / 2) <i>then</i>",
      "9.            <i>R1</i> = {(x,y) ∈ R | (x < xmed) or (x = xmed and y < ymed)}",
      "10.        <i>else</i>",
      "11.           <i>R1</i> = {(x,y) ∈ R | (x > xmed) or (x = xmed and y > ymed)}",
      "12.     <i>R2</i> = R - R1",
      "13.   awakeRobotList = makespan(R1, <i>d</i>, depth + 1)",
      "14.  <i>else</i>",
      "15.    <i>Split R into two subsets with a horizontal imaginary line T through the median y-coordinate of the points in R. In case there are multiple points with the same y-coordinate, pick the one with the smallest x-value. Call them m = (xmed, ymed)</i>",
      "16.      <i>if</i>((ymed - ymin) <= <i>d</i> / 2) then",
      "17.        <i>R1</i> = {(x,y) ∈ R | (y < ymed) or (y = ymed and x < xmed)}",
      "18.      <i>else</i>",
      "19.        <i>R1</i> = {(x,y) ∈ R | (y > ymed) or (y = ymed and x > xmed)}",
      "20.    <i>R2</i> = <i>R</i> - <i>R1</i>",
      "21.    <i>awakeRobotList</i> = <i>makespan</i>(R1, <i>d</i> / 2, <i>depth</i> + 1)",
      "22.  <i>awakeRobotList</i> <= <i>wakeup</i> R2 by <i>awakeRobotList</i>, <i>simultaneously</i>",
      "23.  <i>return awakeRobotList</i>"
    ];
  }
}