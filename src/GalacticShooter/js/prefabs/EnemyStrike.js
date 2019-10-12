import Entity from '../prefabs/Entity';
import LaserEnemy from '../prefabs/LaserEnemy';

/**
 * @class EnemyRocket
 * @description Define striking enemy.
 * @extends Entity
 */
export default class EnemyStrike extends Entity {
  /**
   * @constructor
   * @param {Object} scene - scene object.
   * @param {Number} x - x (horizontal) position.
   * @param {Number} y - y (vertical) position.
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy_strike_image', 'EnemyStrike'); // Create instance of a EnemyStrike with appropriate parameters.

    this.body.velocity.y = Phaser.Math.Between(40, 200); // Set up speed of enemies to be a random number between 40, and 200.

    this.score = 20; // Set up score that will be accumulated to the player for killing EnemyStrike.

    // Set up enemy shooting.
    this.shooting = this.scene.time.addEvent({
      delay: 2000,
      callback: function () {
        // Create enemy laser.
        if (!this.scene) return;
        let enemy_laser = new LaserEnemy(this.scene, this.x, this.y);
        enemy_laser.setScale(this.scaleX);
        this.scene.enemy_lasers.add(enemy_laser);
      },
      callbackScope: this, // Scope (this object) to call the function with.
      loop: true // Repeat spawning enemies.
    });
  }

  /**
   * @description Kill shooting laser when enemy is dead.
   * @function gameOver
   * @returns {void}
   */
  gameOver() {
    if (this.shooting !== undefined) {
      if (this.shooting) {
        this.shooting.remove(false);
      }
    }
  }
}