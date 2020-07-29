const fs = require('fs');

module.exports = {
  /**
   * method before
   * @param browser
   */
  before: function(browser){
    browser.resizeWindow(800, 600);
  },

  /**
   * Tests that Phaser, and your Phaser.Game instance can be loaded ok,
   * and that the expected state is reached by Phaser.StateManager
   *
   * @test
   * @param client
   */
  'Phaser Game Loads Test': function (client) {
    client
      .url(client.launch_url)
      .waitForElementPresent('canvas', 3000)
      .waitForPhaser(3000)
      .waitForGame(3000)
      .waitForState('preload', 3000)
      .assert.currentState('preload');
  },
};
