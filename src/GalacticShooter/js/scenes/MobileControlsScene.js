/**
 * @class MobileControlsScene
 * @description Define mobile controls scene.
 * @extends Phaser.Scene
 */
export class MobileControlsScene extends Phaser.Scene {
  /**
   * @constructor
   */
  constructor() {
    super({
      key: 'MobileControls',
    })

    // Set up default moves to false.
    this.is_left = false;
    this.is_right = false;
    this.is_up = false;
    this.is_down = false;

    this.cursor_keys = ['left', 'right', 'down', 'up']; // Define cursor keys.
  }

  /**
   * @description Method called before scene is created, preload all necessary assets for the game.
   * @function preload
   * @override `Phaser.Scene#preload`
   * @returns {void}
   */
  preload() {
    let path = './plugins/rexvirtualjoystickplugin.min.js'; // Path to joystick plugin.

    // Load joystick plugin.
    this.load.plugin('rexvirtualjoystickplugin', path, true);
    this.load.atlas('joystick', 'assets/images/generic-joystick.png', 'assets/json/generic-joystick.json');
  }

  /**
   * @description Method called once scene is created.
   * @function create
   * @override `Phaser.Scene#create`
   * @returns {void}
   */
  create() {
    let main_scene = this.scene.get('MainScene'); // Get main scene.

    // Create player and fire button.
    this.player = main_scene.player;
    this.button_fire = this.createFireButtton();

    // Define properties of joystick.
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
        x: 150,
        y: this.game.config.height - 150,
        radius: 60,
        base: this.add.sprite(0, 0, 'joystick', 'base'),
        thumb: this.add.sprite(0, 0, 'joystick', 'stick'),
        dir: 2,
      })
      .on('update', this.dumpJoystickState, this); // Keep updated joystick moves.

    // Once pointer is up set which direction has been choosen by the player and set up appropriate direction flag.
    this.input.on('pointerup', () => {
      this.setDirectionFlag();
    });

    // Once player clicks shooting bullet handle the event to show appropriate bullet and set appropriate flag.
    this.input.on('gameobjectdown', (pointer, gameobject) => {
      // Pointers ID 1 and 2 are for mobile controls, i.e. direction change and shooting.
      if (pointer.id === 2 || pointer.id === 1) {
        if (gameobject.name === "fire") {
          this.fireTheBullet(true); // Player clicked the shooting button, handle this.
        }
      }
    });

    // Once player unclicked shooting bullet handle the event to show appropriate bullet and set appropriate flag.
    this.input.on('gameobjectout', (pointer, gameobject) => {
      // Pointers ID 1 and 2 are for mobile controls, i.e. direction change and shooting.
      if (pointer.id === 2 || pointer.id === 1) {
        if (gameobject.name === "fire") {
          this.fireTheBullet(); // Player unclicked the shooting button, handle this.
        }
      }
    });
  }

  /**
   * @description Method invoked on joystick moves.
   * @function dumpJoystickState
   * @returns {void}
   */
  dumpJoystickState() {
    let cursorKeys = this.joystick.createCursorKeys(); // Create joystick cursor keys.

    // Set appropriate direction depending by pressed key by the player.
    for (let name in cursorKeys) {
      if (cursorKeys[name].isDown) {
        this.setDirectionFlag(name);
      }
    }
  }

  /**
   * @function setDirectionFlag setting the current cursor key flag to true.
   * @param {String} cursorkey - direction which flag should be set up.
   * @returns {void}
   */
  setDirectionFlag(cursorkey = "") {
    this.cursor_keys.forEach(key => {
      if (key === cursorkey) {
        this[`is_${key}`] = true;
      } else {
        this[`is_${key}`] = false;
      }
    });
  }

  /**
   * @description Method invoked all the time during the game.
   * @function update
   * @override `Phaser.Scene#update`
   * @returns {void}
   */
  update() {
    // Move player to appropriate direction depending by pressed key by the player.
    if (this.is_left) {
      this.player.moveLeft();
    }
    if (this.is_right) {
      this.player.moveRight();
    }
    if (this.is_down) {
      this.player.moveDown();
    }
    if (this.is_up) {
      this.player.moveUp();
    }
  }

  /**
   * @description Handle firing functionality of the player on mobile.
   * @function createFireButtton
   * @returns {Object} button_fire - fire button object.
   */
  createFireButtton() {
    let button_fire = this.add.sprite(this.game.config.width - 120, this.game.config.height - 130, 'joystick', 'button1-up'); // Load fire button.

    // Set up fire button properties.
    button_fire.setScale(1.4);
    button_fire.setInteractive({
      draggable: true
    });
    button_fire.setOrigin(0.5);
    button_fire.name = "fire";

    return button_fire; // Return fire button object.
  }

  /**
   * @description Trigger the bullet as of flag given.
   * @function fireTheBullet
   * @param {Boolean} [false] - flag to fire bullet (true) or not (false, a default one).
   * @returns {void}
   */
  fireTheBullet(flag = false) {
    if (!flag) {
      // Player didn't click to fire the shooting bullet.
      this.button_fire.setFrame('button1-up'); // Show the bullet as normal (not firing).

      // Set up player's shooting delay.
      this.player.setData(
        'timerShootTick',
        this.player.getData('shooting_delay') - 1
      );
    } else {
      // Player clicked to fire the shooting bullet.
      this.button_fire.setFrame('button1-down'); // Show the bullet as firing.
    }
    this.player.setData('is_shooting', flag); // Mark the object as shooting depending by appropriate flag.
  }
}