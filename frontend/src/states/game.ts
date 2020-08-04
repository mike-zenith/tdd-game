import Phaser from 'phaser-ce';
import { STATE_MAINMENU } from '../consts';

export class Game extends Phaser.State {
  public init(gameOptions: { room:string }): void {
    if (!gameOptions.room) {
      this.game.state.start(STATE_MAINMENU);
      return;
    }
  }

  public create(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  public update(): void {
    this.game.input.update();
  }
}
