module.exports = {

  page: null,
  /**
   * method before
   * @param browser
   */
  before: function (browser) {
    browser.resizeWindow(800, 600);
  },

  beforeEach: function(browser) {
    this.page = browser.page.mainMenu().navigate()
  },

  afterEach: function() {
    this.page = null;
  },

  'MainMenu: multiplayer available': function () {
    this.page
      .waitForPhaser(3000)
      .waitForState('mainmenu', 5000)
      .assert.gameTextOnScreen('Multiplayer', 5000)
  },

  'MainMenu: selecting multiplayer opens room selection': function () {
    this.page.goToMainMenu()
      .gameObjectDispatch('Multiplayer','onInputDown', 500)
      .assert.gameTextOnScreen('Room', 3000)
      .assert.gameTextOnScreen('roomName', 3000)
      .assert.gameTextOnScreen('Go', 5000)
  },

  'MainMenu: room selector can be toggled by clicking multiplayer': function () {
    this.page.goToMultiplayerMenu()
      .gameObjectDispatch('Multiplayer', 'onInputDown', 500)
      .assert.not.gameTextOnScreen('Room', 5000)
      .assert.not.gameTextOnScreen('roomName', 3000)
      .assert.not.gameTextOnScreen('Go', 5000)
  },
}
