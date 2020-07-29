import Phaser from 'phaser-ce';
import { STATE_GAME } from '../consts';

export class Preload extends Phaser.State {
  private ready: boolean;

  public preload(): void {
    // Load awesome fonts
    // Load sprites

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
  }

  public update(): void {
    if (this.ready) {
      this.game.state.start(STATE_GAME);
    }
  }

  private onLoadComplete(): void {
    this.ready = true;
  }
}
