import Phaser from 'phaser-ce';

export class Game extends Phaser.State {
  private cursors: Phaser.CursorKeys;

  public create(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  public update(): void {
    this.game.input.update();
  }
}
