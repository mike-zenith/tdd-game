import Phaser from 'phaser-ce';
import * as io from 'socket.io-client';
import { STATE_MAINMENU } from '../consts';
import { Config } from '../config';

export class Game extends Phaser.State {
  public init(gameOptions: { room:string }): void {
    if (!gameOptions.room) {
      this.game.state.start(STATE_MAINMENU);
      return;
    }

    const socket = io.connect(Config.websocketServerAddress);
    socket.on('connect', () => {
    });
    socket.on('disconnect', () => {
    });
  }

  public create(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  public update(): void {
    this.game.input.update();
  }
}
