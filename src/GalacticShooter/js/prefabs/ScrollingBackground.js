/**
 * @class ScrollingBackground
 * @description Define scrollable background.
 */
export default class ScrollingBackground {
  /**
   * @constructor
   * @param {Object} scene - scene object.
   * @param {Number} key - pseudorandom number.
   * @param {Number} velocity_y - velocity with the y (vertical) direction.
   */
  constructor(scene, key, velocity_y) {
    // Set up basic properties for scrolling background.
    this.scene = scene;
    this.key = key;
    this.velocity_y = velocity_y;

    this.layers = this.scene.add.group(); // Add layers to scene group.

    this.createMovableBackground(); // Create layers.
  }

  /**
   * @description Create movable background of the game.
   * @function createMovableBackground
   * @returns {void}
   */
  createMovableBackground() {
    // Create 3 backgrounds to give an illusion that they're moving, but it's just a continuous flow.
    for (let i = 0; i < 3; i++) {
      // Set up layer.
      let layer = this.scene.add.sprite(0, 0, this.key);
      layer.y = (layer.displayHeight * i);

      // Set up properties of movable background.
      let flipX = Phaser.Math.Between(0, 6) > 2 ? -1 : 1;
      let flipY = Phaser.Math.Between(0, 6) > 2 ? -1 : 1;
      if (this.scene.game.device.os.desktop) {
        layer.setScale(flipX * 2, flipY * 2);
      } else {
        layer.setScale(flipX * 4, flipY * 2);
      }
      layer.setDepth(-5 - i);

      // Apply properties to the game.
      this.scene.physics.world.enableBody(layer, 0);
      layer.body.velocity.y = this.velocity_y;
      this.layers.add(layer);
    }
  }

  /**
   * @description Method invoked all the time during the game.
   * @function update
   * @override `Phaser.Scene#update`
   * @returns {void}
   */
  update() {
    // Allow background layers to wrap back around to the bottom.
    if (this.layers.getChildren()[0].y > 0) {
      for (let i = 0; i < this.layers.getChildren().length; i++) {
        let layer = this.layers.getChildren()[i];
        layer.y = (-layer.displayHeight) + (layer.displayHeight * i);
      }
    }
  }
}