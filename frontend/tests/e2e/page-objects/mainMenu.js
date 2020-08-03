const { registerObjectFinder } = require('../custom-commands/_phaserUtil');

module.exports = {
  url: function () {
    return this.api.launchUrl;
  },
  elements: {
    canvas: 'canvas'
  },
  commands: [
    {
      goToMainMenu: function() {
        return this.waitForPhaser(3000)
          .api.execute(registerObjectFinder)
          .waitForState('mainmenu', 5000)
      },
      goToMultiplayerMenu: function() {
        return this.goToMainMenu()
          .waitForObject('Multiplayer', 3000)
          .clickOnGameObject('Multiplayer', 500)
          .waitForObject('Room', 2000)
      },
    },
  ]
};
