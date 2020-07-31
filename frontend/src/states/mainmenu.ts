import Phaser from 'phaser-ce';
import {
  FONT_MAINMENU_TITLE,
  IMG_TITLE_BG,
  FONT_MAINMENU_ELEMENTS,
  FONT_MAINMENU_BUTTON,
  IMG_BUTTON_MAINMENU_FRAME, IMG_BUTTON_MAINMENU_DEFAULT, STATE_GAME,
} from '../consts';
import { Config } from '../config';

export class MainMenu extends Phaser.State {
  public game: PhaserInput.InputFieldGame;

  private multiplayerText: Phaser.Text;

  private multiplayerSubmenu: Phaser.Group;

  public create(): void {
    const bg = this.add.image(this.game.world.centerX, this.game.world.centerY, IMG_TITLE_BG);
    bg.anchor.setTo(0.5);

    const text = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Main menu');
    text.anchor.setTo(0.5);
    text.padding.set(30, 30);
    text.font = Config.fontMap[FONT_MAINMENU_TITLE];
    text.fontSize = 60;

    const multiplayerText = this.createMenuText(this.game.world.centerX, this.game.world.centerY, 'Multiplayer');
    multiplayerText.alpha = 0;
    multiplayerText.inputEnabled = true;
    multiplayerText.events.onInputDown.add(this.onMultiplayerClicked, this);
    this.multiplayerText = multiplayerText;

    const middleBetweenTopAndCenter = (this.game.world.centerY - text.height) / 2;

    this.game.add.tween(bg)
      .to({ y: middleBetweenTopAndCenter }, 300, 'Linear', true);
    this.game.add.tween(text)
      .to({ y: middleBetweenTopAndCenter }, 300, 'Linear', true);

    this.game.add.tween(multiplayerText).to({ alpha: 1, x: multiplayerText.width / 2 + 40 }, 300, 'Linear', false)
      .delay(150).start();
  }

  private createMenuText(x: number, y: number, text: string): Phaser.Text {
    // as this.add instantly renders its necessary to either pre-fill with alpha or render manually
    const phaserText = this.add.text(x, y, text, { fill: 'rgba(0,0,0,0)' });
    phaserText.addColor('#ffffff', 0);
    phaserText.anchor.setTo(0.5);
    phaserText.padding.set(30, 30);
    phaserText.font = Config.fontMap[FONT_MAINMENU_ELEMENTS];
    phaserText.fontSize = 30;
    phaserText.alpha = 0;
    phaserText.stroke = '#000000';
    phaserText.strokeThickness = 1;
    phaserText.smoothed = true;
    phaserText.setShadow(1.5, 1.5, '#d9b98b', 0, false, true);
    return phaserText;
  }

  private createButton(x: number, y: number, text: string): Phaser.Group {
    const group = this.add.group();
    group.interactive = true;
    group.inputEnableChildren = true;
    group.x = x;
    group.y = y;
    group.name = `${text}Button`;

    const textComponent = this.createMenuText(0, 0, text);
    textComponent.font = Config.fontMap[FONT_MAINMENU_BUTTON];
    textComponent.alpha = 1;
    textComponent.padding.setTo(10, 10);
    textComponent.addColor('#000000', 0);

    const frame = this.add.image(0, 0, IMG_BUTTON_MAINMENU_FRAME);
    frame.width = textComponent.width + 10;
    frame.height = textComponent.height;

    const fill = this.add.image(0, 0, IMG_BUTTON_MAINMENU_DEFAULT);
    fill.width = frame.width - 4;
    fill.height = frame.height - 9;

    const fillHover = this.add.graphics(0, 0);
    fillHover.blendMode = 4;
    fillHover.alpha = 0;
    fillHover.beginFill(0x00ccff, 1);
    fillHover.drawRect(0, 0, fill.width, fill.height);
    fillHover.endFill();

    fill.alignIn(frame, Phaser.CENTER, 0, -1);
    fillHover.alignIn(frame, Phaser.CENTER, 0, -1);
    textComponent.alignIn(frame, Phaser.CENTER, 3);

    group.addMultiple([fill.sendToBack(), fillHover, frame, textComponent.bringToTop()]);

    return group;
  }

  onMultiplayerClicked() {
    if (this.multiplayerSubmenu) {
      this.multiplayerSubmenu.alpha = this.multiplayerSubmenu.alpha > 0.1 ? 0 : 1;
      const input = (this.multiplayerSubmenu.getAt(1) as PhaserInput.InputField);
      input.blockInput = !input.blockInput;
      input.input.useHandCursor = !input.input.useHandCursor;
      return;
    }

    this.multiplayerSubmenu = this.add.group();

    const roomText = this.createMenuText(this.game.world.centerX, this.game.world.centerY, 'Room');
    roomText.alignTo(this.multiplayerText, Phaser.RIGHT_TOP, 40, 0);
    roomText.alpha = 1;
    this.multiplayerSubmenu.add(roomText);

    const inputField = this.game.add.inputField(roomText.x, roomText.y, {
      font: '12px Arial',
      fill: '#000000',
      fillAlpha: 1,
      fontWeight: 'bold',
      width: 100,
      max: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: '#cccccc',
      borderRadius: 6,
      placeHolder: 'yo',
      textAlign: 'left',
    });
    inputField.key = 'roomName';
    inputField.alignTo(roomText, Phaser.RIGHT_TOP, 0, -13);
    this.multiplayerSubmenu.add(inputField);

    const goButton = this.createButton(this.game.world.centerX, this.game.world.centerY, 'Go');
    goButton.alignTo(inputField, Phaser.RIGHT_CENTER, 40, 0);
    goButton.onChildInputOver.add(() => {
      const text = goButton.getAt(3) as Phaser.Text;
      text.addColor('#ffffff', 0);
      const fillOverlay = goButton.getAt(1) as Phaser.Image;
      fillOverlay.alpha = 1;
    });
    goButton.onChildInputOut.add(() => {
      const text = goButton.getAt(3) as Phaser.Text;
      text.addColor('#000000', 0);
      const fillOverlay = goButton.getAt(1) as Phaser.Image;
      fillOverlay.alpha = 0;
    });
    goButton.onChildInputDown.add(() => {
      if (inputField.value && inputField.value.length > 1) {
        this.game.state.start(STATE_GAME, true, false, {
          room: inputField.value,
        });
      }
    });
    this.multiplayerSubmenu.add(goButton);

    this.multiplayerSubmenu.alpha = 1;
  }
}
