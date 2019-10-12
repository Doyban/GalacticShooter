import Entity from '../prefabs/Entity';

/**
 * @class LaserPlayer
 * @description Define laser used by the player.
 * @extends Entity
 */
export default class LaserPlayer extends Entity {
  /**
   * @constructor
   * @param {Object} scene - scene object.
   * @param {Number} x - x (horizontal) position.
   * @param {Number} y - y (vertical) position.
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'laser_player_image'); // Create instance of a LaserPlayer with appropriate parameters.

    this.body.velocity.y = -225; // Speed of player's laser, negation of that number gives that the laser goes up.
  }
}