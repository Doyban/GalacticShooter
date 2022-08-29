import Phaser from 'phaser';
import ScrollingBackground from '../prefabs/ScrollingBackground';
import { scalePercX, scalePercY } from '../game';

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

    // Load XML sheets.
    this.load.atlasXML(
      'gui',
      'assets/spritesheets/blueSheet.png',
      'assets/json/blueSheet.xml'
    );
    this.load.atlasXML(
      'uiicons',
      'assets/spritesheets/sheet_black1x.png',
      'assets/json/sheet_black1x.xml'
    );

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
    // Add empty array for buttons creating the MainMenuScene.
    this.menuButtons = [];

    // Add sounds effects for buttons.
    this.sounds = {
      button_down: this.sound.add('button_down_audio'),
      button_over: this.sound.add('button_over_audio')
    };

    // Add title.
    this.title = this.add.dynamicBitmapText(this.game.config.width * 0.5, 150, 'space_font', 'MENU', 58 * ((scalePercX + scalePercY) * 0.5)); // Set title text properties.
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
      this.button_play.setScale(scalePercX, scalePercY);
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

    // Add close button image.
    this.closeButton = this.add.sprite(
      this.game.config.width * 0.875,
      this.game.config.height * 0.065,
      'gui',
      'blue_button07.png'
    );
    this.closeButtonIcon = this.add.sprite(
      this.game.config.width * 0.875,
      this.game.config.height * 0.065,
      'uiicons',
      'cross.png'
    );

    // Scale buttons creating the MainMenuScene.
    this.menuButtons.push(this.closeButton, this.closeButtonIcon);
    this.menuButtons.forEach(button => button.setScale(scalePercX, scalePercY));

    // Add pointer events with its appropriate textures, and audios.
    this.addPointerEvents(this.closeButton, "gui", "blue_button07.png", "blue_button08.png", "blue_button09.png", "blue_button10.png", this.onCloseButtonDown.bind(this));
  }

  /**
   * @description Method called to add button events to the game object.
   * @function addPointerEvents
   * @returns {void}
   */
  addPointerEvents(obj, texture, overframe, outframe, downframe, upframe, callback) {
    obj.setInteractive(); // Set button play image to be interactive.

    obj.on('pointerover', function () {
      obj.setTexture(texture, overframe);
      this.sounds.button_over.play();
    }, this);
    obj.on('pointerout', function () {
      obj.setTexture(texture, outframe);
    });
    obj.on('pointerdown', function () {
      obj.setTexture(texture, downframe);
      this.sounds.button_down.play();
    }, this);
    obj.on('pointerup', function () {
      callback();
      obj.setTexture(texture, upframe);
    }, this);
  }

  /**
   * @description Method called on Close button down.
   * @function onCloseButtonDown
   * @returns {void}
   */
  onCloseButtonDown() {
    window.open("https://itch.io/");
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
