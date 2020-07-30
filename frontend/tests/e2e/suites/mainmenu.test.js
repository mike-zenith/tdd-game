module.exports = {
  /**
   * method before
   * @param browser
   */
  before: function (browser) {
    browser.resizeWindow(800, 600);
  },

  /**
   * @test
   * @param client
   */
  'MainMenu: multiplayer available': function (client) {
    const page = client.page.mainMenu();
    page
      .navigate()
      .waitForPhaser(3000)
      .waitForState('mainmenu', 5000)
      .pauseGame()
      .assert.gameTextOnScreen('Multiplayer', 5000)
  },
}
