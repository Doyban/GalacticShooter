import Phaser from 'phaser';
import ScrollingBackground from '../prefabs/ScrollingBackground';

/**
 * @class MainMenuScene
 * @description Define main menu scene.
 * @extends Phaser.Scene
 */
export default class MainMenuScene extends Phaser.Scene {
  /**
   * @constructor
   */
  constructor() {
    super({
      key: 'MainMenuScene'
    });
  }

  /**
   * @description Method called before scene is created, preload all necessary assets for the game.
   * @function preload
   * @override `Phaser.Scene#preload`
   * @returns {void}
   */
  preload() {
    // Load sounds.
    this.load.audio('button_down_audio', [
      'assets/audio/button_down.ogg',
      'assets/audio/button_down.mp3'
    ]);
    this.load.audio('button_over_audio', [
      'assets/audio/button_over.ogg',
      'assets/audio/button_over.mp3'
    ]);

    // Load images.
    this.load.image('background1_image', 'assets/images/background1.png');
    this.load.image('background2_image', 'assets/images/background2.png');
    this.load.image('button_play_image', 'assets/images/button_play.png');
    this.load.image('button_play_down_image', 'assets/images/button_play_down.png');
    this.load.image('button_play_hover_image', 'assets/images/button_play_hover.png');
    this.load.image('button_restart_image', 'assets/images/button_restart.png');
    this.load.image('button_restart_down_image', 'assets/images/button_restart_down.png');
    this.load.image('button_restart_hover_image', 'assets/images/button_restart_hover.png');

    // Load bitmaps.
    this.load.bitmapFont('space_font',
      'assets/bitmapfonts/spacefont.png',
      'assets/bitmapfonts/spacefont.xml'
    );
  }

  /**
   * @description Method called once scene is created.
   * @function create
   * @override `Phaser.Scene#create`
   * @returns {void}
   */
  create() {
    // Add sounds effects for buttons.
    this.sounds = {
      button_down: this.sound.add('button_down_audio'),
      button_over: this.sound.add('button_over_audio')
    };

    // Add title.
    this.title = this.add.dynamicBitmapText(this.game.config.width * 0.5, 150, 'space_font', 'MENU', 78); // Set title text properties.
    this.title.setOrigin(0.5); // Center title.

    // Add scrolling background to the menu.
    this.backgrounds = [];
    for (let i = 0; i < 10; i++) {
      let keys = ['background1_image', 'background2_image'];
      let key = keys[Phaser.Math.Between(0, keys.length - 1)];
      let bg = new ScrollingBackground(this, key, i * 20);
      this.backgrounds.push(bg);
    }

    // Add play button image.
    this.button_play = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'button_play_image'
    );

    // Scale retstart play and title accordingly to the desired platform.
    if (!this.game.device.os.desktop) {
      this.button_play.setScale(1.5);
    } else {
      this.title.setFontSize(40);
      this.title.setPosition(this.game.config.width / 2, 100);
      this.title.setOrigin(0.5);
      this.button_play.setScale(0.8);
    }

    this.button_play.setInteractive(); // Set button play image to be interactive.

    // Add pointer events with its appropriate textures, and audios.
    this.button_play.on('pointerover', function () {
      this.button_play.setTexture('button_play_hover_image');
      this.sounds.button_over.play();
    }, this);
    this.button_play.on('pointerout', function () {
      this.setTexture('button_play_image');
    });
    this.button_play.on('pointerdown', function () {
      this.button_play.setTexture('button_play_down_image');
      this.sounds.button_down.play();
    }, this);
    this.button_play.on('pointerup', function () {
      this.button_play.setTexture('button_play_image');
      this.scene.start('MainScene');
    }, this);

    this.scene.setActive(false, 'MobileControls'); // Hide mobile controls.
  }

  /**
   * @description Method invoked all the time during the game.
   * @function update
   * @override `Phaser.Scene#update`
   * @returns {void}
   */
  update() {
    // Iterate through background layers.
    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update(); // Keep background updated to look like movable during the whole gameplay.
    }
  }
}