/**
  Class for a generic robot in the swarm
*/
class Robot {
  /**
    Constructor for a robot object
    
    @params:
      x - The x coordinate of the robot
      y - The y coordinate of the robot
  */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
    this.drawX = x;
    this.drawY = y;
    this.awake = false;
  }
  
  /**
    Calculates the distance between this robot and a second robot
    
    @params:
      target - The robot to calculate the distance to
      
    @returns:
      The distance between the two robots
  */
  distance(target) {
    return Math.sqrt(Math.pow((this.x - target.x), 2) + Math.pow((this.y - target.y), 2));
  }
  
  /**
    Fetches a robots awakening status
    
    @returns:
      Whether or not the robot is currently awake
  */
  isAwake() {
    return this.awake
  }
  
  /**
    Awakens a robot
  */
  awaken() {
    this.awake = true;
  }
  
  /**
    Puts a robot back to sleep and resets its xy coordinates to their initial value
  */
  reset() {
    this.awake = false;
    this.x = this.drawX;
    this.y = this.drawY;
  }
}