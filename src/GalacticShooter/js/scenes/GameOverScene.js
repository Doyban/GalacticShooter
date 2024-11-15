import Phaser from 'phaser';
import ScrollingBackground from '../prefabs/ScrollingBackground';
import { scalePercX, scalePercY } from '../game';

/**
 * @class GameOverScene
 * @description Define game over scene.
 * @extends Phaser.Scene
 */
export default class GameOverScene extends Phaser.Scene {
  /**
   * @constructor
   */
  constructor() {
    super({
      key: 'GameOverScene'
    });
  }

  /**
   * @description Method called before scene is created, preload all necessary assets for the game.
   * @function preload
   * @override `Phaser.Scene#preload`
   * @returns {void}
   */
  preload() {
    // Load bitmap fonts.
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
    this.title = this.add.dynamicBitmapText(this.game.config.width * 0.5, 150, 'space_font', 'GAME OVER', 58 * ((scalePercX + scalePercY) * 0.5)); // Set title text properties.
    this.title.setOrigin(0.5); // Center title.
    this.title.visible = false; // Make title invisible.

    // Add scrolling background to the game over menu.
    this.backgrounds = [];
    for (let i = 0; i < 10; i++) {
      let keys = ['background1_image', 'background2_image'];
      let key = keys[Phaser.Math.Between(0, keys.length - 1)];
      let bg = new ScrollingBackground(this, key, i * 20);
      this.backgrounds.push(bg);
    }

    // Add button restart image.
    this.btn_restart = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'button_restart_image'
    );

    // Scale retstart button and title accordingly to the desired platform.
    if (!this.game.device.os.desktop) {
      this.btn_restart.setScale(scalePercX, scalePercY);
    } else {
      this.title.setFontSize(40);
      this.title.setPosition(this.game.config.width / 2, 100);
      this.title.setOrigin(0.5);
      this.btn_restart.setScale(0.8);
    }

    // Set restart button properties.
    this.btn_restart.setInteractive(); // Set button restart image to be interactive.
    this.btn_restart.visible = false; // Make restart button invisible.

    // Add pointer events with its appropriate textures, and audios.
    this.btn_restart.on('pointerover', function () {
      this.btn_restart.setTexture('button_restart_hover_image');
      this.sounds.button_over.play();
    }, this);
    this.btn_restart.on('pointerout', function () {
      this.setTexture('button_restart_image');
    });
    this.btn_restart.on('pointerdown', function () {
      this.btn_restart.setTexture('button_restart_down_image');
      this.sounds.button_down.play();
    }, this);
    this.btn_restart.on('pointerup', function () {
      this.btn_restart.setTexture('button_restart_image');
      this.scene.start('MainScene');
    }, this);

  // Add share button image.
  this.shareButton = this.add.sprite(
    this.game.config.width * 0.35,
    this.game.config.height * 0.85,
    'gui',
    'blue_button07.png'
  );

  this.shareButtonIcon = this.add.sprite(
    this.game.config.width * 0.35,
    this.game.config.height * 0.85,
    'uiicons',
    "share2.png"
  );
  this.shareButton.setScale(scalePercX, scalePercY);
  this.shareButtonIcon.setScale(scalePercX, scalePercY);
  this.shareButton.setInteractive();

  // Add pointer events with its appropriate textures, and audios.
  this.shareButton.on('pointerup', function () {
    this.sounds.button_down.play();

    // Setting up configuration for the event.
    const options = {
      message: 'Play GalacticShooter!', // not supported on some apps (Facebook, Instagram)
      subject: 'My score in GalacticShooter is ' + localStorage.score + '!', // fi. for email
      files: ['assets/images/logo.webp'], // an array of filenames either locally or remotely
      url: 'https://doyban.com/games/galacticshooter',
    };

    // Event handlers.
    const onSuccess = () => {
      alert("Sharing result successful.");
    };
    const onError = () => {
      alert("Sharing result unsuccessful.");
    };

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError); // Cordova plugin execution.
  }, this);

  // Add home button image.
  this.homeButton = this.add.sprite(
    this.game.config.width * 0.65,
    this.game.config.height * 0.85,
    'gui',
    'blue_button07.png'
  );
  this.homeButtonIcon = this.add.sprite(
    this.game.config.width * 0.65,
    this.game.config.height * 0.85,
    'uiicons',
    "home.png"
    );

  this.homeButton.setScale(scalePercX, scalePercY);
  this.homeButtonIcon.setScale(scalePercX, scalePercY);
  this.homeButton.setInteractive();

  // Add pointer events with its appropriate textures, and audios.
  this.homeButton.on('pointerup', () => {
    this.sounds.button_down.play();
    this.scene.start('MainMenuScene');
  }, this);

    // Smoothly show game over title with restart button.
    this.cameras.main.flash(5000, 0, 0, 0, true, () => {
      this.btn_restart.visible = true; // Make restart button invisible.
      this.title.visible = true; // Make title visible
    }, this);
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
