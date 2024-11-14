import Entity from '../prefabs/Entity';
import GUI from '../prefabs/GUI';
import LaserPlayer from '../prefabs/LaserPlayer';

/**
 * @class Player
 * @description Define the player.
 * @extends Entity
 */
export default class Player extends Entity {
  /**
   * @constructor
   * @param {Object} scene - scene object.
   * @param {Number} x - x (horizontal) position.
   * @param {Number} y - y (vertical) position.
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'player_image', 'Player'); // Create instance of a Player with appropriate parameters.

    this.setData('speed', 300); // Set up speed of a player.

    // Set up shooting of a player.
    this.setData('is_shooting', false); // Mark the object as not shooting.
    this.setData('shooting_delay', 10); // Mark the object's shooting delay.

    // Set up shooting delay.
    this.setData(
      'timerShootTick',
      this.getData('shooting_delay') - 1
    );
  }

  /**
   * @description Reduce health of a player.
   * @function reduceHealth
   * @returns {void}
   */
  reduceHealth() {
    let isDead = this.scene.gui.setHealth(-10); // Check if player is dead after reducing its health by 10.

    // Check if player is dead.
    if (isDead) {
      // Player is dead, perform explosion and do game over.
      this.performExplosion(false, false); // Final explode which will destroy the player on animation complete.
      this.gameOver(); // Game over, because the player is dead.
      this.showAdMobAds(); // Show ads.
    } else {
      // Player is not dead, perform explosion whenever player got hit.
      this.performExplosion(false, true);
    }
  }

  /**
   * @description Method to move down.
   * @function moveDown
   * @returns {void}
   */
  moveDown() {
    this.body.velocity.y = this.getData('speed');
  }

  /**
   * @description Method to move left.
   * @function moveLeft
   * @returns {void}
   */
  moveLeft() {
    this.body.velocity.x = -this.getData('speed');
  }

  /**
   * @description Method to move right.
   * @function moveRight
   * @returns {void}
   */
  moveRight() {
    this.body.velocity.x = this.getData('speed');
  }

  /**
   * @description Method to move up.
   * @function moveUp
   * @returns {void}
   */
  moveUp() {
    this.body.velocity.y = -this.getData('speed');
  }

  /**
   * @description Show AdMob ads.
   * @function showAdMobAds
   * @returns {void}
   */
  showAdMobAds() {
    const interstitial = new admob.InterstitialAd({
      adUnitId: "ca-app-pub-4865595196880143/2111764922",
    });
    interstitial.on("dismiss", () => {
      // Once a interstitial ad is shown, it cannot be shown again.
      // Starts loading the next interstitial ad as soon as it is dismissed.
      interstitial.load();
    });
    return interstitial
      .load()
      .then(() => interstitial.show());
  }

  /**
   * @description After 2 seconds move the player game over scene.
   * @function gameOver
   * @returns {void}
   */
  gameOver() {
    this.scene.sounds.die.play(); // Play sound.
    this.scene.sounds.background.stop(); // Stop background sound.

    // Delayed animation, which redirects the user to the game over scene.
    this.scene.time.addEvent({
      delay: 2000, // Delay of 2 seconds.
      callback: function () {
        this.scene.scene.stop('MobileControls'); // Hide mobile controls.
        this.scene.scene.start('GameOverScene'); // Redirect player to the game over scene.
      },
      callbackScope: this, // Scope (this object) to call the function with.
      loop: false // Don't loop this state.
    });

    localStorage.scoreRate = 1; // Set to default scoreRate on game over.
  }

  /**
   * @description Method invoked all the time during the game.
   * @function update
   * @override `Phaser.Scene#update`
   * @returns {void}
   */
  update() {
    this.body.setVelocity(0, 0); // Every game update player's velocity set to 0. It happens when no one of keys are pressed.

    // Ensure that player can't move outside screen.
    this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
    this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);

    // Set up shooting for a player.
    if (this.getData('is_shooting')) {
      if (this.getData('timerShootTick') < this.getData('shooting_delay')) {
        this.setData(
          'timerShootTick',
          this.getData('timerShootTick') + 1
        );
      }
      // Set up manual shooting, to avoid delay in player laser shooting.
      else {
        // Create player laser.
        let laser = new LaserPlayer(this.scene, this.x, this.y);
        this.scene.player_lasers.add(laser);

        this.scene.sounds.laser.play(); // Play sound.
        this.setData('timerShootTick', 0); // Reset timer shoot tick to 0.
      }
    }
  }

  /**
   * @description Changes the alpha value to the 0.5 if it is in revive state else to normal.
   * @function setReviveState
   * @param {Boolean} [false] - flag to revive the player (true) or not (false, a default one).
   * @returns {void}
   */
  setReviveState(flag = false) {
    if (flag) {
      this.setData('is_shooting', false); // Mark the object as not shooting.
      this.alpha = 0.5; // Player in a revive state, make it 50% visible.
    } else {
      this.alpha = 1; // Player in a normal state, show it 100% (normal).
    }
  }
}
