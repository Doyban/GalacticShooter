import Phaser from 'phaser';
import ScrollingBackground from '../prefabs/ScrollingBackground';
import GUI from '../prefabs/GUI';
import Player from '../prefabs/Player';
import EnemyRocket from '../prefabs/EnemyRocket';
import EnemyStrike from '../prefabs/EnemyStrike';
import EnemyUfo from '../prefabs/EnemyUfo';

/**
 * @class MainScene
 * @description Define main scene.
 * @extends Phaser.Scene
 */
export default class MainScene extends Phaser.Scene {
  /**
   * @constructor
   */
  constructor() {
    super({
      key: 'MainScene'
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
    this.load.audio('explode1_audio', [
      'assets/audio/explosion1.ogg',
      'assets/audio/explosion1.mp3'
    ]);
    this.load.audio('explode2_audio', [
      'assets/audio/explosion2.ogg',
      'assets/audio/explosion2.mp3'
    ]);
    this.load.audio('explode3_audio', [
      'assets/audio/explosion3.ogg',
      'assets/audio/explosion3.mp3'
    ]);
    this.load.audio('explode4_audio', [
      'assets/audio/explosion4.ogg',
      'assets/audio/explosion4.mp3'
    ]);
    this.load.audio('die_audio', [
      'assets/audio/die.ogg',
      'assets/audio/die.mp3'
    ]);
    this.load.audio('shoot_audio', [
      'assets/audio/shoot.ogg',
      'assets/audio/shoot.mp3'
    ]);
    this.load.audio('background_audio', [
      'assets/audio/galactic_background.ogg',
      'assets/audio/galactic_background.mp3'
    ]);

    // Load images.
    this.load.image('enemy_rocket_image', 'assets/images/enemy_rocket.png');
    this.load.image('enemy_strike_image', 'assets/images/enemy_strike.png');
    this.load.image('enemy_ufo_image', 'assets/images/enemy_ufo.png');
    this.load.image('laser_enemy_image', 'assets/images/laser_enemy.png');
    this.load.image('laser_player_image', 'assets/images/laser_player.png');
    this.load.image('player_image', 'assets/images/player.png');
    this.load.spritesheet(
      'explosion_spritesheet',
      'assets/spritesheets/explosion.png', {
        frameHeight: 128,
        frameWidth: 128
      }
    );

    // Load bitmaps.
    this.load.bitmapFont('space_font',
      'assets/bitmapfonts/spacefont.png',
      'assets/bitmapfonts/spacefont.xml'
    );

    localStorage.scoreRate = localStorage.scoreRate || 1; // Initialize scoreRate.
    localStorage.score = 0;
  }

  /**
   * @description Method called once scene is created.
   * @function create
   * @override `Phaser.Scene#create`
   * @returns {void}
   */
  create() {
    this.device = this.game.device; // Detect device and get its features.

    this.is_reviving = false; // Set player reviving state to false by default.
    this.count = 0; // Initialize variable, which will count after what time the player should get back to the action after hitting from one of enemies.

    // Three types of game complexity.
    this.complexity = {
      easy: {
        strike_count: 30,
        ufo_count: 15,
        rocket_count: 20,
        ufo_probability: 40,
        strike_probability: 60,
        delay: 1000
      },
      medium: {
        strike_count: 50,
        ufo_count: 40,
        rocket_count: 40,
        ufo_probability: 60,
        strike_probability: 80,
        delay: 500
      },
      hard: {
        strike_count: 60,
        ufo_count: 70,
        rocket_count: 80,
        ufo_probability: 85,
        strike_probability: 95,
        delay: 100
      },
    };

    this.enemy_scale_factor = null; // Initialize scaling factor variable.

    // Properties for scale factor accordingly to the desired platform.
    if (this.device.os.desktop) {
      this.enemy_scale_factor = 0.01;
    } else {
      this.enemy_scale_factor = 0.015;
    }

    this.current_complexity = this.complexity['easy']; // Set up default game complexity as easy.

    // Create sounds.
    this.sounds = {
      explosions: [
        this.sound.add('explode1_audio'),
        this.sound.add('explode2_audio'),
        this.sound.add('explode3_audio'),
        this.sound.add('explode4_audio')
      ],
      laser: this.sound.add('shoot_audio'),
      die: this.sound.add('die_audio'),
      background: this.sound.add('background_audio', {
        loop: true // Loop background sound.
      })
    };

    this.sounds.background.play(); // Play background sound.

    // Add scrolling background to the main scene.
    this.backgrounds = [];
    for (let i = 0; i < 10; i++) {
      let keys = ['background1_image', 'background2_image'];
      let key = keys[Phaser.Math.Between(0, keys.length - 1)];
      let bg = new ScrollingBackground(this, key, i * 20);
      this.backgrounds.push(bg);
    }

    // Create animations.
    this.anims.create({
      key: 'explosion_spritesheet',
      frames: this.anims.generateFrameNumbers('explosion_spritesheet'),
      frameRate: 20,
      repeat: 0
    });

    // Create instance of a player.
    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.9,
      'player_image'
    );

    // Initialize W, S, A, D, space keyboard buttons as well as pointer.
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pointer = game.input.activePointer;

    // Create groups to hold entities.
    this.enemies = this.add.group();
    this.enemy_lasers = this.add.group();
    this.player_lasers = this.add.group();
    this.ui_group = this.add.group();
    this.gui = new GUI(this, this.ui_group);

    // Spawn enemies.
    this.time.addEvent({
      delay: this.current_complexity.delay, // Set up a spawn delay.
      // Pick one of 3 enemies type.
      callback: () => {
        // Change the complexity depending by player's score.
        if (this.gui.getScore() > 2000) {
          this.current_complexity = this.complexity['hard']; // Set up hard complexity for score more than 2000.
        } else if (this.gui.getScore() > 1000) {
          this.current_complexity = this.complexity['medium']; // Set up medium complexity for score more than 1000.
        }

        let enemy = null; // Initialize enemy variable.

        // Spawn ufo enemy.
        if (Phaser.Math.Between(1, 100) > 100 - this.current_complexity.ufo_probability) {
          if (this.getEnemyType('EnemyUfo').length <= this.current_complexity.ufo_count) {
            enemy = new EnemyUfo(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0
            );
          }
        }
        // Spawn striking enemy.
        else if (Phaser.Math.Between(1, 100) > 100 - this.current_complexity.strike_probability) {
          if (this.getEnemyType('EnemyStrike').length <= this.current_complexity.strike_count) {
            enemy = new EnemyStrike(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0
            );
          }
        }
        // Spawn rocket enemy.
        else {
          if (this.getEnemyType('EnemyRocket').length <= this.current_complexity.rocket_count) {
            enemy = new EnemyRocket(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0
            );
          }
        }

        // If enemy has been created then add necessary steps.
        if (enemy !== null) {
          enemy.setScale(Phaser.Math.Between(30, 60) * this.enemy_scale_factor); // Apply random scale for the enemy.
          this.enemies.add(enemy); // Add picked enemy type to the enemies group.
        }
      },
      callbackScope: this, // Scope (this object) to call the function with.
      loop: true // Repeat spawning enemies.
    });

    // Add collision check between player laser, and enemies.
    this.physics.add.collider(
      this.player_lasers,
      this.enemies,
      // Once player laser will hit enemy destroy both of these objects.
      function (laser_player, enemy) {
        // Check if enemy exists.
        if (enemy) {
          // Check if enemy is still shooting.
          if (enemy.gameOver !== undefined) {
            enemy.gameOver(); // Enemy is still shooting, so kill its shooting.
          }
          // Enemy, and player laser are still alive, then kill enemy by performing explosion effect, and destroy player laser.
          enemy.performExplosion(true, false);
          laser_player.scene.gui.setScore(enemy.score);
          laser_player.destroy();
        }
      });

    // Add collider between players, and enemies.
    this.physics.add.overlap(
      this.player,
      this.enemies,
      function (player, enemy) {
        // Check if player, and enemy is alive.
        if (!player.getData('is_dead') && !enemy.getData('is_dead') && !this.is_reviving) {
          // Player, and enemy are still alive, then kill player shooting, and kill enemy by performing explosion effect on their collision.
          this.is_reviving = true;
          player.reduceHealth(-10);
          enemy.performExplosion(true, false);
        }
      },
      null, this);

    // Add collider between player, and enemy lasers.
    this.physics.add.overlap(
      this.player,
      this.enemy_lasers,
      // Check if player, and enemy laser is alive.
      function (player, laser) {
        if (!player.getData('is_dead') && !laser.getData('is_dead') && !this.is_reviving) {
          // Player, and enemy are still alive, then kill player shooting, and destroy enemy laser.
          this.is_reviving = true;
          player.reduceHealth(-10);
          laser.destroy();
        }
      }, null, this);
    // For not desktop devices use mobile controls.
    if (!this.device['os']['desktop']) {
      this.scene.launch('MobileControls');
    }
  }

  /**
   * @description Method to check enemy type.
   * @function getEnemyType
   * @param {String} type - type of enemy.
   * @returns {Array} enemies - array of enemies in the game.
   */
  getEnemyType(type) {
    let enemies = []; // Initialize array of enemies.

    // Loop through enemies group, and check if type of the enemy is equal to that one given as a parameter for getEnemyType method.
    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      let enemy = this.enemies.getChildren()[i];
      if (enemy.getData('type') === type) {
        enemies.push(enemy);
      }
    }
    return enemies; // Return enemies.
  }

  /**
   * @description Method invoked all the time during the game.
   * @function update
   * @override `Phaser.Scene#update`
   * @returns {void}
   */
  update() {
    // Reviving time for the player after a hit.
    if (this.is_reviving) {
      // Check if required time passed to revive the player.
      if (this.count === 180) {
        // Enough time passed, revive the player.
        this.is_reviving = false; // Set revive as false, because the player is again alive.
        this.player.setReviveState(); // Revive the player.
        this.count = 0; // Reset counting which tracks getting back the player to the action after hitting from one of enemies.
      } else {
        // Not enough time passed yet, keep counting.
        this.player.setReviveState(true); // Make the player in revive state.
        this.count++; // Increase counting to get back the player to the action after hitting from one of enemies.
      }
    }

    // Check if player is alive, otherwise player could still move after his dead.
    if (!this.player.getData('is_dead')) {
      this.player.update(); // Get all updates about player needed to check all the time.

      // According to which key has been pressed make appropriate movement. Moving up/down, and left/right has to be with if/else if, otherwise player won't move.
      if (this.keyW.isDown) {
        this.player.moveUp();
      } else if (this.keyS.isDown) {
        this.player.moveDown();
      }
      if (this.keyA.isDown) {
        this.player.moveLeft();
      } else if (this.keyD.isDown) {
        this.player.moveRight();
      }

      // Shoot on pressing space, clicking mouse, or taping screen.
      if (this.device['os']['desktop']) {
        if (this.keySpace.isDown) {
          this.player.setData('is_shooting', true); // Mark the object as shooting.
        }
        // If player doesn't press space it means there is no shooting.
        else {
          this.player.setData(
            'timerShootTick',
            this.player.getData('shooting_delay') - 1
          );
          this.player.setData('is_shooting', false); // Mark the object as not shooting.
        }
      }
    }

    // Go through all enemies.
    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      let enemy = this.enemies.getChildren()[i]; // Take one of the enemies.

      enemy.update(); // Update enemy about its properties.

      // Add frustum culling to speed up gaming, i.e. avoid rendering items, which left the screen.
      if (enemy.x < -enemy.displayWidth ||
        enemy.x > this.game.config.width + enemy.displayWidth ||
        enemy.y < -enemy.displayHeight * 6 ||
        enemy.y > this.game.config.height + enemy.displayHeight) {
        // Check if enemy exists.
        if (enemy) {
          // Check if enemy is not shooting.
          if (enemy.gameOver !== undefined) {
            enemy.gameOver(); // Kill shooting.
          }
          enemy.destroy(); // Destroy the object.
        }
      }
    }

    // Go through all enemy lasers.
    for (let i = 0; i < this.enemy_lasers.getChildren().length; i++) {
      let enemy_laser = this.enemy_lasers.getChildren()[i]; // Take one of the enemy lasers.

      enemy_laser.update(); // Update enemy laser about its properties.

      // Add frustum culling to speed up gaming, i.e. avoid rendering items, which left the screen.
      if (enemy_laser.x < -enemy_laser.displayWidth ||
        enemy_laser.x > this.game.config.width + enemy_laser.displayWidth ||
        enemy_laser.y < -enemy_laser.displayHeight * 4 ||
        enemy_laser.y > this.game.config.height + enemy_laser.displayHeight) {
        if (enemy_laser) {
          enemy_laser.destroy(); // Destroy the enemy laser object.
        }
      }
    }

    // Go through all player lasers.
    for (let i = 0; i < this.player_lasers.getChildren().length; i++) {
      let player_laser = this.player_lasers.getChildren()[i]; // Take one of the player lasers.

      player_laser.update(); // Update player laser about its properties.

      // Add frustum culling to speed up gaming, i.e. avoid rendering items, which left the screen.
      if (player_laser.x < -player_laser.displayWidth ||
        player_laser.x > this.game.config.width + player_laser.displayWidth ||
        player_laser.y < -player_laser.displayHeight * 6 ||
        player_laser.y > this.game.config.height + player_laser.displayHeight) {
        // Check if player laser exists.
        if (player_laser) {
          player_laser.destroy(); // Destroy the player laser object.
        }
      }
    }

    this.gui.update()
    // Iterate through background layers.
    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update(); // Keep background updated to look like movable during the whole gameplay.
    }
  }
}
