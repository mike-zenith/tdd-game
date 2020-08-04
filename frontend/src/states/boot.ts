import Phaser from 'phaser-ce';
import * as WebFontLoader from 'webfontloader';
import {
  IMG_LOADER_FILL,
  IMG_LOADER_FRAME,
  STATE_PRELOAD,
} from '../consts';
import { Config } from '../config';

export class Boot extends Phaser.State {
  private ready: boolean;

  private fontsLoaded: boolean;

  private loadingText: Phaser.Text;

  public init(): void {
    this.onFontsLoaded = this.onFontsLoaded.bind(this);
  }

  public create(): void {
    // set up input max pointers
    this.input.maxPointers = 1;
    this.game.stage.backgroundColor = '000000';
    // set up stage disable visibility change
    // this.stage.disableVisibilityChange = true;
    // Set up the scaling method used by the ScaleManager
    // Valid values for scaleMode are:
    // * EXACT_FIT
    // * NO_SCALE
    // * SHOW_ALL
    // * RESIZE
    // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // If you wish to align your game in the middle of the page then you can
    // set this value to true. It will place a re-calculated margin-left
    // pixel value onto the canvas element which is updated on orientation /
    // resizing events. It doesn't care about any other DOM element that may
    // be on the page, it literally just sets the margin.
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    // this.game.scale.compatibility.forceMinimumDocumentHeight = true;
    // this.scale.compatibility.forceMinimumDocumentHeight = true;
    // Force the orientation in landscape or portrait.
    // * Set first to true to force landscape.
    // * Set second to true to force portrait.
    // this.scale.forceOrientation(false, true);
    // this.game.scale.compatibility.forceMinimumDocumentHeight = true;
    // Sets the callback that will be called when the window resize event
    // occurs, or if set the parent container changes dimensions. Use this
    // to handle responsive game layout options. Note that the callback will
    // only be called if the ScaleManager.scaleMode is set to RESIZE.
    // this.scale.setResizeCallback(this.gameResized, this);
    // Set screen size automatically based on the scaleMode. This is only
    // needed if ScaleMode is not set to RESIZE.
    // this.scale.updateLayout(true);
    // Re-calculate scale mode and update screen size. This only applies if
    // ScaleMode is not set to RESIZE.
    this.scale.refresh();

    this.loadingText = this.add.text(this.world.centerX, this.world.centerY, '...', { font: '16px Arial', fill: '#dddddd', align: 'center' });
    this.loadingText.anchor.setTo(0.5, 0.5);

    this.game.add.plugin((window as unknown).PhaserInput.Plugin);
  }

  private onFontsLoaded() {
    this.fontsLoaded = true;
  }

  public preload(): void {
    // Load awesome fonts
    WebFontLoader.load({
      ...Config.fonts,
      active: this.onFontsLoaded,
    });

    this.load.image(IMG_LOADER_FILL, Config.imageMap[IMG_LOADER_FILL]);
    this.load.image(IMG_LOADER_FRAME, Config.imageMap[IMG_LOADER_FRAME]);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
  }

  public update(): void {
    if (this.ready && this.fontsLoaded) {
      this.game.state.start(STATE_PRELOAD);
    }
  }

  private onLoadComplete(): void {
    this.ready = true;
  }
}
