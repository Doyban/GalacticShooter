import Entity from '../prefabs/Entity';

/**
 * @class EnemyRocket
 * @description Define rocket enemy.
 * @extends Entity
 */
export default class EnemyRocket extends Entity {
  /**
   * @constructor
   * @param {Object} scene - scene object.
   * @param {Number} x - x (horizontal) position.
   * @param {Number} y - y (vertical) position.
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy_rocket_image', 'EnemyRocket'); // Create instance of a EnemyRocket with appropriate parameters.

    this.score = 30; // Set up score that will be accumulated to the player for killing EnemyRocket.

    this.body.velocity.y = Phaser.Math.Between(40, 300); // Set up speed of enemies to be a random number between 40, and 300.
  }
}