import Entity from '../prefabs/Entity';

/**
 * @class LaserEnemy
 * @description Define laser used by striking enemy.
 * @extends Entity
 */
export default class LaserEnemy extends Entity {
  /**
   * @constructor
   * @param {Object} scene - scene object.
   * @param {Number} x - x (horizontal) position.
   * @param {Number} y - y (vertical) position.
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'laser_enemy_image'); // Create instance of an LaserEnemy with appropriate parameters.

    this.body.velocity.y = 200; // Speed of enemy's laser.
  }
}