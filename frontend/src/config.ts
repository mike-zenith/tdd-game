import {
  FONT_MAINMENU_TITLE,
  FONT_MAINMENU_ELEMENTS,
  IMG_LOADER_FILL,
  IMG_LOADER_FRAME,
  IMG_TITLE_BG,
  IMG_BUTTON_MAINMENU_DEFAULT,
  FONT_MAINMENU_BUTTON, IMG_BUTTON_MAINMENU_FRAME,
} from './consts';

export class Config {
  static gameWidth: number = 800;

  static gameHeight: number = 480;

  static fonts: { google: { families: string[] }} = {
    google: {
      families: ['Bangers'],
    },
  };

  static fontMap: { [key:string]: string } = {
    [FONT_MAINMENU_TITLE]: 'Bangers',
    [FONT_MAINMENU_ELEMENTS]: 'Bangers',
    [FONT_MAINMENU_BUTTON]: 'Bangers',
  };

  static imageMap: { [key: string]: string } = {
    [IMG_LOADER_FRAME]: 'assets/images/button_08_frame.png',
    [IMG_LOADER_FILL]: 'assets/images/button_08.png',
    [IMG_TITLE_BG]: 'assets/images/text_bg_01.png',
    [IMG_BUTTON_MAINMENU_FRAME]: 'assets/images/button_03_frame.png',
    [IMG_BUTTON_MAINMENU_DEFAULT]: 'assets/images/button_03.png',
  };

  static get websocketServerAddress(): string {
    return (window as any).WS_SERVER;
  }
}
