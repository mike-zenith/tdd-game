module.exports = {
  /**
   * method before
   * @param browser
   */
  before: function(browser){
    browser.resizeWindow(800, 600);
  },

  'Phaser game loads MainMenu': function (client) {
    const page = client.page.mainMenu();
    page.navigate()
    page
      .waitForElementPresent('@canvas', 3000)
      .waitForPhaser(3000)
      .waitForState('mainmenu', 5000)
      .assert.currentState('mainmenu');
  },

  // 'Preloader shows bitmap'
};
