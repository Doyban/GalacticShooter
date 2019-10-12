import Phaser from 'phaser';
import MainScene from './scenes/MainScene';
import MainMenuScene from './scenes/MainMenuScene';
import GameOverScene from './scenes/GameOverScene';
import {
  MobileControlsScene
} from './scenes/MobileControlsScene';

/**
 * @class Game
 * @description Define core game settings.
 * @extends Phaser.Game
 */
export default class Game extends Phaser.Game {
  /**
   * @constructor
   */
  constructor() {
    let config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {
            x: 0,
            y: 0
          },
          debug: false // To view zones change to 'true'.
        }
      },
      // Add phaser scenes.
      scene: [
        MainMenuScene,
        MainScene,
        GameOverScene,
        MobileControlsScene
      ],
      input: {
        activePointers: 6,
      },
      // Improve graphics.
      pixelArt: true,
      roundPixels: true
    };
    super(config); // Add configuration to the game.

    // Change the game size if it is desktop.
    if (this.device.os.desktop) {
      this.config.width = 360;
      this.config.height = 640;
    }
  }
}

window.game = new Game(); // Start the game.