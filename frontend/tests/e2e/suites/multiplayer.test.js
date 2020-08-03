const io = require('socket.io');

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
    this.page.end();
    this.page = null;
    this.io.close(done);
  },

  'Multiplayer: connects client to server': async function (browser) {
    const roomName = 'r12';
    const port = 3111;
    const connectionAddress = `http://frontend:${port}`;

    let clientConnected = false;
    this.io.listen(port);

    browser.execute(function (connectionAddress) {
      window.WS_SERVER = connectionAddress;
    }, [connectionAddress])

    await this.page.typeToGameInput('roomName', roomName, 1000);
    await this.page.clickOnGameObject('GoButton')
    await this.page.waitForConnection(this.io, 3000, client => {
      clientConnected = true;
    });
    await this.page.assert.ok(clientConnected);
  }

  // @todo 'Multiplayer: does not connect when room name is empty'
}
