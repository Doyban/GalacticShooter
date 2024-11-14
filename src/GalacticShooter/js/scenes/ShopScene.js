import Phaser from "phaser";
import ScrollingBackground from "../prefabs/ScrollingBackground";
import { scalePercX, scalePercY } from "../game";
import { ShopItem } from "../prefabs/ShopItem";

/**
 * @class
 * @description Create Shop state.
 */
export class ShopScene extends Phaser.Scene {
  /**
   * @constructor
   * @param {Phaser.State} game - current state of the game where this popup needs to be rendered
   */
  constructor() {
    super({ key: "ShopScene" });
    this.backgroundLayers = [];
  }

  /**
   * @function create
   * @description Create and show all the game objects of the popup.
   */
  create() {
    this.createBackground();
    this.createCloseButton();
    this.createShopItems();
  }

  /**
  * @function createBackground
  * @description Create background with respective tile for background.
  */
  createBackground() {
    // Add scrolling background to the menu.
    for (let i = 0; i < 10; i++) {
      let keys = ['background1_image', 'background2_image'];
      let key = keys[Phaser.Math.Between(0, keys.length - 1)];
      let bg = new ScrollingBackground(this, key, i * 20);
      this.backgroundLayers.push(bg);
    }
  }

  /**
  * @function createCloseButton
  * @description Create the close button to close the shop.
  */
  createCloseButton() {
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
    this.closeButton.setInteractive();
    this.closeButton.on("pointerup", this._onCloseButton, this);

    // Scale buttons creating the ShopScene.
    [this.closeButton, this.closeButtonIcon].forEach((gameObject) => gameObject.setScale(scalePercX, scalePercY));
  }

  /**
  * @function createShopItems
  * @description Create all the shop items to the shop popup
  * @param {Number} [count=4] - number of items that can be add to the store
  */
  createShopItems(count = 4) {
    const valX = 35;
    const valY = 40;
    let positions = [[-valX, -valY], [valX, -valY], [-valX, valY], [valX, valY]]; // Positions of ShopItems.
    let mulitpliers = [2, 3, 4, 6]; // Text "Score x[VALUE_IN_THIS_ARRAY]".

    // Add ShopItems to the backgroundLayers array.
    for (let i = 0; i < count; i++) {
      this.backgroundLayers.push(new ShopItem(this, { x: (this.game.config.width * 0.5) + positions[i][0] * scalePercX, y: (this.game.config.height * 0.5) + positions[i][1] * scalePercY }, mulitpliers[i]));
    }

    // Prepare products for In App Purchases (IAP's).
    const store = CdvPurchase.store;
    const { ProductType, Platform } = CdvPurchase;

    for (const i in this.mulitpliers) {
      store.register({
        id: `scorex${this.mulitpliers[i]}`, // Android requires just ID, but iOS full .com.doyban.myApp.scorexA path.
        platform: Platform.GOOGLE_PLAY,
        type: ProductType.CONSUMABLE,
      });
    }
  }

  /**
   * @function show
   * @description Show/close all the game objects of the popup.
   * @param {boolean} [flag=false] - flag to show/close the popup.
   */
  show(flag = false) {
    // Make elements visible, depending by the flag.
    for (let i = 0; i < this.backgroundLayers.length; i++) {
      const backgroundLayer = this.backgroundLayers[i];
      if (backgroundLayer instanceof ShopItem) {
        backgroundLayer.show(flag);
      } else {
        backgroundLayer.visible = flag;
      }
    }
  }

  /**
  * @callback _onCloseButton
  * @description Listen on input down of close button and perform necessary actions if it occurs.
  */
  _onCloseButton() {
    this.scene.start('MainMenuScene');
  }
}
