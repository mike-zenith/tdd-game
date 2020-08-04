import Phaser from 'phaser-ce';
import { STATE_MAINMENU } from '../consts';
import { createConnection, Sync } from '../sync/connection';
import { Config } from '../config';

export class Game extends Phaser.State {
  private client: Sync

  public init(gameOptions: { room:string }): void {
    if (!gameOptions.room) {
      this.game.state.start(STATE_MAINMENU);
      return;
    }

    this.client = createConnection(Config.websocketServerAddress);
    this.client.lobby(gameOptions.room);
  }

  public create(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  public update(): void {
    this.game.input.update();
  }
}
