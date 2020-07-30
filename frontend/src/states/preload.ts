import Phaser from 'phaser-ce';
import {
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
    const loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, IMG_LOADER_FILL);
    loaderBar.alignIn(loaderBg, Phaser.TOP_LEFT, 5, 5);

    this.load.setPreloadSprite(loaderBar);
    this.load.onLoadComplete.add(this.onLoadComplete);

    this.load.image(IMG_TITLE_BG, Config.imageMap[IMG_TITLE_BG]);
  }

  private onLoadComplete(): void {
    this.game.state.start(STATE_MAINMENU);
  }
}
