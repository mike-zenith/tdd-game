const io = require('socket.io');
const assert = require('assert');

module.exports = {

  page: null,
  io: null,

  /**
   * method before
   * @param browser
   */
  before: function (browser) {
    browser.resizeWindow(800, 600);
  },

  beforeEach: function(browser) {
    this.io = io();
    this.page = browser.page.mainMenu().navigate().goToMultiplayerMenu();
  },

  afterEach: function(done) {
    this.page = null;
    this.io.close(done);
  },

  'Multiplayer: connects client to server': function (browser) {
    const roomName = 'r12';
    const port = 3000;
    const connectionAddress = `http://frontend:${port}`;

    let clientConnected = false;

    this.io.on('connection', client => {
      clientConnected = true;
    });
    this.io.listen(port);

    browser.execute(function (connectionAddress) {
      window.WS_SERVER = connectionAddress;
    }, [connectionAddress])

    this.page.goToMultiplayerMenu()
      .typeToGameInput('roomName', roomName)
      .gameObjectDispatch('GoButton', 'onInputDown', 3000)
      .assert.currentState('game', 5000)
      .assert.ok(clientConnected);
  }

  // @todo 'Multiplayer: does not connect when room name is empty'
}
