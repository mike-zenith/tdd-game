import Phaser from 'phaser-ce';
import {
  IMG_BUTTON_MAINMENU_DEFAULT,
  IMG_BUTTON_MAINMENU_FRAME,
  IMG_LOADER_FILL, IMG_LOADER_FRAME, IMG_TITLE_BG, STATE_MAINMENU,
} from '../consts';
import { Config } from '../config';

export class Preload extends Phaser.State {
  public init(): void {
    this.onLoadComplete = this.onLoadComplete.bind(this);
  }

  public preload(): void {
    const loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, IMG_LOADER_FRAME);
    loaderBg.anchor.setTo(0.5);
    loaderBg.width = this.game.world.bounds.halfWidth;
    const loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, IMG_LOADER_FILL);
    loaderBar.width = this.game.world.bounds.halfWidth;
    loaderBar.alignIn(loaderBg, Phaser.TOP_LEFT, -14, -7);
    loaderBar.sendToBack();

    this.load.setPreloadSprite(loaderBar);
    this.load.onLoadComplete.add(this.onLoadComplete);

    this.load.image(IMG_TITLE_BG, Config.imageMap[IMG_TITLE_BG]);
    this.load.image(IMG_BUTTON_MAINMENU_FRAME, Config.imageMap[IMG_BUTTON_MAINMENU_FRAME]);
    this.load.image(IMG_BUTTON_MAINMENU_DEFAULT, Config.imageMap[IMG_BUTTON_MAINMENU_DEFAULT]);
  }

  private onLoadComplete(): void {
    this.game.state.start(STATE_MAINMENU);
  }
}
