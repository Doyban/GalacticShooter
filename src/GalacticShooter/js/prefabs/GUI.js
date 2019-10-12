/**
 * @class GUI
 * @description Define Graphical User Interfact (GUI).
 */
export default class GUI {
  /**
   * @constructor
   * @param {Object} scene - scene object.
   * @param {Object} group - UI's group entities.
   */
  constructor(scene, group) {
    // Properties for shield text accordingly to the desired platform.
    let shield_text = {
      desktop: {
        x: scene.game.config.width * 0.80,
        y: scene.game.config.width * 0.05,
        fontSize: 30
      },
      mobile: {
        x: scene.game.config.width * 0.85,
        y: scene.game.config.width * 0.05,
        fontSize: 55
      }
    };

    // Properties for score text accordingly to the desired platform.
    let score_text = {
      desktop: {
        x: scene.game.config.width * 0.20,
        y: scene.game.config.width * 0.05,
        fontSize: 30
      },
      mobile: {
        x: scene.game.config.width * 0.15,
        y: scene.game.config.width * 0.05,
        fontSize: 55
      }
    };

    // Set up shield and score text accordingly to the desired platform.
    if (scene.game.device.os.desktop) {
      shield_text = shield_text.desktop;
      score_text = score_text.desktop;
    } else {
      shield_text = shield_text.mobile;
      score_text = score_text.mobile;
    }

    this.health = 100; // Set up default health (displayed as "shield").

    // Set up shield text properties.
    this.shield_text = scene.add.dynamicBitmapText(shield_text.x, shield_text.y, 'space_font', 'Shield:  ' + this.health, shield_text.fontSize);
    this.shield_text.setOrigin(0.5);
    group.add(this.shield_text);

    this.score = 0; // Set up default score.
    this.score_buffer = 0; // Score buffer value, which will be decremented and score will be incremented whenever the score has to be added to give a counter effect.

    // Set up score text properties.
    this.score_text = scene.add.dynamicBitmapText(score_text.x, score_text.y, 'space_font', 'Score:  ' + this.score, score_text.fontSize);
    this.score_text.setOrigin(0.5);
    group.add(this.score_text);
  }

  /**
   * @description Set health value and check if health is less than or equal to 0.
   * @function setHealth
   * @param {Number} value - value to update (currently only decrease) player's health.
   * @returns {Boolean} - value which returns whether or not the player is alive.
   */
  setHealth(value) {
    this.health += value;
    this.shield_text.text = 'Shield: ' + this.health;
    if (this.health <= 0) return true;
    else return false;
  }

  /**
   * @description Set score of the game.
   * @function setScore
   */
  setScore(value) {
    this.score_buffer += value;
  }

  /**
   * @description Get score of the game.
   * @function getScore
   * @returns {Number} this.score - score of the game.
   */
  getScore() {
    return this.score;
  }

  /**
   * @description Method invoked all the time during the game.
   * @function update
   * @override `Phaser.Scene#update`
   * @returns {void}
   */
  update() {
    // Score counter effect.
    if (this.score_buffer !== 0) {
      this.score_buffer--;
      this.score += 1;
      this.score_text.text = 'Score: ' + this.score;
    }
  }

  /**
   * @description Get health of the player.
   * @function getHealth
   * @returns {Number} this.health - health of the player.
   */
  getHealth() {
    return this.health;
  }
}