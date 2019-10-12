import Phaser from 'phaser';

/**
 * @class Entity
 * @description Define entity object on which rely all objects taking part in the actual gameplay actions. 
 * @extends Phaser.GameObjects.Sprite
 */
export default class Entity extends Phaser.GameObjects.Sprite {
  /**
   * @constructor
   * @param {Object} scene - scene object.
   * @param {Number} x - x (horizontal) position.
   * @param {Number} y - y (vertical) position.
   * @param {String} key - linked loaded image to a particular key phrase.
   * @param {String} type - entity type.
   */
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key); // Create instance of an Entity with appropriate parameters.

    this.scene = scene; // Set up scene of the Entity.
    this.scene.add.existing(this); // Add to rendering queue of the scene.
    this.scene.physics.world.enableBody(this, 0); // Enable physics for the Entity class.

    // Scale the Entity accordingly to the desired platform. 
    if (!scene.game.device.os.desktop) {
      this.setScale(1.5);
    } else {
      this.setScale(0.8);
    }

    // Set up properties.
    this.setData('type', type); // Mark the object's type.
    this.setData('is_dead', false); // Mark the object as alive.
  }

  /**
   * @description Perform explosion for alive objects when collision occurs.
   * @function performExplosion
   * @param {Boolean} kill_object - kill the collided object. 
   * @param {Boolean} player_temporary_invisible - make the player temporary invisible. 
   * @returns {void}
   */
  performExplosion(kill_object, player_temporary_invisible) {
    // Check if object is still alive.
    if (!this.getData('is_dead')) {
      // Object is still alive, so perform explosion with appropriate effects.
      this.setTexture('explosion_spritesheet');
      this.play('explosion_spritesheet');
      this.scene.sounds.explosions[Phaser.Math.Between(0, this.scene.sounds.explosions.length - 1)].play(); // Random sounds from the sounds array.

      // Remove shooting timer for existing shooting timer.
      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false);
        }
      }

      // Set up properties of explosion.
      this.setAngle(45);
      this.body.setVelocity(100, -150);

      // Perform necessary actions once explosion animation will be done with distinction if the player is temporary invisible.
      if (player_temporary_invisible) {
        // Once explosion animation will be done show the player again.
        this.on('animationcomplete', function () {
          this.setTexture('player_image');
          this.setAngle(0);
        });
      } else {
        // Once explosion animation will be done kill the object or hide it.
        this.on('animationcomplete', function () {
          if (kill_object) {
            this.destroy(); // Kill the object (collision occured).
          } else {
            this.setVisible(false); // Hide the object (it went outside the world boundaries).
          }
        }, this);
        this.setData('is_dead', true); // Mark the object as dead.
      }
    }
  }
}