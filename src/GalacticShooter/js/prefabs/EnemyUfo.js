import Entity from '../prefabs/Entity';

/**
 * @class EnemyRocket
 * @description Define ufo enemy.
 * @extends Entity
 */
export default class EnemyUfo extends Entity {
  /**
   * @constructor
   * @param {Object} scene - scene object.
   * @param {Number} x - x (horizontal) position.
   * @param {Number} y - y (vertical) position.
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy_ufo_image', 'EnemyUfo'); // Create instance of a EnemyUfo with appropriate parameters.

    this.score = 40; // set up score that will be accumulated to the player for killing EnemyUfo.

    this.body.velocity.y = Phaser.Math.Between(40, 180); // Set up speed of enemies to be a random number between 40, and 180.

    // Declare states for 2 types of enemies, chasing the player, and simply moving down.
    this.states = {
      MOVE_DOWN: 'MOVE_DOWN',
      CHASE: 'CHASE'
    };

    this.state = this.states.MOVE_DOWN;
  }

  /**
   * @description Method invoked all the time during the game.
   * @function update
   * @override `Phaser.Scene#update`
   * @returns {void}
   */
  update() {
    // Chase the player if the distance between enemy, and player is less than 600 pixels.
    if (!this.getData('is_dead') && this.scene.player && !this.scene.is_reviving) {
      if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 600) {
        this.state = this.states.CHASE;
      }

      // Case for a state when the enemy is chasing the player.
      if (this.state === this.states.CHASE) {
        // Calculate mathemtical properties, and set up appropriate velocity for the chasing enemy.
        let dx = this.scene.player.x - this.x;
        let dy = this.scene.player.y - this.y;
        let angle = Math.atan2(dy, dx);
        let speed = 200;
        this.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        // Rotate the chasing enemy.
        if (this.x < this.scene.player.x) {
          this.angle -= 8;
        } else {
          this.angle += 22;
        }
      }
    }
  }
}