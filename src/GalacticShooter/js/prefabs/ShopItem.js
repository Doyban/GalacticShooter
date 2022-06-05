import { scalePercX, scalePercY } from "../game";

/**
 * @class ShopItem
 * @description Create ShopItem state.
 */
export class ShopItem {
  /**
   * @constructor
   * @param {Phaser.State} game - Phaser.State
   * @param {Object} pos - position `{x, y}`
   * @param {Number} multiplier - number
   */
  constructor(game, pos, multiplier) {
    this._game = game;
    this.backgroundLayers = [];
    this.multiplier = multiplier;
    this.position = pos;
    this.visible = false;
    this._build();
  }

  /**
   * @function _build
   * @description Create graphic elements for the ShopItem.
   */
  _build() {
    this.createBackground();
    this.createScoreText();
    this.createScoreXText();
    this.createScoreMultiplierText();

    // Scale elements creating the ShopItem.
    [this.background, this.gameScoreText, this.gameScoreMultiplierText, this.gameScoreTextX].forEach(value => {
      value.setScale(scalePercX, scalePercY);
    });
  }

  /**
   * @function createBackground
   * @description Create background of the ShopItem.
   */
  createBackground() {
    // Create background.
    this.background = this._game.add.sprite(this.position.x, this.position.y, 'gui', 'blue_button07.png');
    this.background.setInteractive();
    this.background.on("pointerup", this.onItemClicked.bind(this), this);
    this.backgroundLayers.push(this.background);
  }

  /**
   * @callback
   * @description Listen on input down of ShopItem and perform necessary actions if it occurs.
   */
  onItemClicked() {
    alert(`item clicked ${this.multiplier}`)
  }

  /**
   * @function createScoreText
   * @description Create Score text of the ShopItem.
   */
  createScoreText() {
    this.gameScoreText = this._game.add.text(this.position.x, (this.position.y - 15 * scalePercY), 'Score', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.gameScoreText.setOrigin(0.5);
    this.gameScoreText.stroke = '#627577';
    this.gameScoreText.strokeThickness = 2.2;
  }

  /**
   * @function createScoreXText
   * @description Create "x" text between "Score" and "[VALUE_IN_THE_ARRAY]".
   */
  createScoreXText() {
    this.gameScoreText.autoRound = true;
    this.gameScoreText.lineSpacing = 5;
    this.gameScoreTextX = this._game.add.text(this.position.x - (10 * scalePercX), this.position.y + (8 * scalePercY), 'x', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.gameScoreTextX.setOrigin(0.5);
    this.gameScoreTextX.stroke = '#627577';
    this.gameScoreTextX.strokeThickness = 3;
  }

  /**
   * @function createScoreMultiplierText
   * @description Create "[VALUE_IN_THE_ARRAY]" text before "Score x".
   */
  createScoreMultiplierText() {
    this.gameScoreMultiplierText = this._game.add.text(this.position.x + (10 * scalePercX), this.position.y + (8 * scalePercY), this.multiplier, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.gameScoreMultiplierText.setOrigin(0.5);
    this.gameScoreMultiplierText.stroke = '#627577';
    this.gameScoreMultiplierText.strokeThickness = 3;
  }

  /**
    * @function show
    * @description Show/close all the game objects of the ShopItem.
    * @param {boolean} [flag=false] - flag to show/close the ShopItem.
    */
  show(flag = false) {
    // Make elements visible, depending by the flag.
    for (let i = 0; i < this.backgroundLayers.length; i++) {
      const backgroundLayer = this.backgroundLayers[i];
      backgroundLayer.visible = flag;
    }
  }
}
