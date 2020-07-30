import Phaser from 'phaser-ce';
import { FONT_MAINMENU_TITLE, IMG_TITLE_BG, FONT_MAINMENU_ELEMENTS } from '../consts';
import { Config } from '../config';

export class MainMenu extends Phaser.State {
  public create(): void {
    const bg = this.add.image(this.game.world.centerX, this.game.world.centerY, IMG_TITLE_BG);
    bg.anchor.setTo(0.5);

    const text = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Main menu');
    text.anchor.setTo(0.5);
    text.padding.set(30, 30);
    text.font = Config.fontMap[FONT_MAINMENU_TITLE];
    text.fontSize = 60;

    const multiplayerText = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Multiplayer');
    multiplayerText.addColor('#ffffff', 0);
    multiplayerText.anchor.setTo(0.5);
    multiplayerText.padding.set(30, 30);
    multiplayerText.font = Config.fontMap[FONT_MAINMENU_ELEMENTS];
    multiplayerText.fontSize = 30;
    multiplayerText.alpha = 0;
    multiplayerText.stroke = '#000000';
    multiplayerText.strokeThickness = 1;
    multiplayerText.smoothed = true;
    multiplayerText.setShadow(1.5, 1.5, '#d9b98b', 0, false, true);

    const middleBetweenTopAndCenter = (this.game.world.centerY - text.height) / 2;

    this.game.add.tween(bg)
      .to({ y: middleBetweenTopAndCenter }, 300, 'Linear', true);
    this.game.add.tween(text)
      .to({ y: middleBetweenTopAndCenter }, 300, 'Linear', true);

    this.game.add.tween(multiplayerText).to({ alpha: 1, x: multiplayerText.width / 2 + 40 }, 300, 'Linear', false)
      .delay(150).start();
  }
}
