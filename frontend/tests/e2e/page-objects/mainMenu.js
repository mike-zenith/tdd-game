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
          .waitForState('mainmenu', 5000)
      },
      goToMultiplayerMenu: function() {
        return this.goToMainMenu()
          .gameObjectDispatch('Multiplayer', 'onInputDown', 500)
          .waitForObject('Room', 2000)
      },
    },
  ]
};
