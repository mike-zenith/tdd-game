/* eslint-disable import/no-extraneous-dependencies */
import 'pixi';
import 'p2';
import Phaser from 'phaser-ce';

import { Config } from './config';

import { Boot } from './states/boot';
import { Preload } from './states/preload';
import { Game } from './states/game';
import { STATE_BOOT, STATE_GAME, STATE_PRELOAD } from './consts';

class Template extends Phaser.Game {
  constructor() {
    super(Config.gameWidth, Config.gameHeight, Phaser.CANVAS);

    this.state.add(STATE_BOOT, Boot, false);
    this.state.add(STATE_PRELOAD, Preload, false);
    this.state.add(STATE_GAME, Game, false);

    this.state.start(STATE_BOOT);
  }
}

window.onload = () => {
  // eslint-disable-next-line no-new
  new Template();
  console.log(Phaser.GAMES);
};
