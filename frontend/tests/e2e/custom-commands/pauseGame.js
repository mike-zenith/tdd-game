const Events = require('events');

module.exports = class PauseGame extends Events {
  command(state = true) {
    this.state = !!state;

    return new Promise((resolve, reject) => {
      this.api.execute(function (state) {
        Phaser.GAMES[0].paused = state;
      }, [this.state], resolve);

    }).then(() => this.emit('complete'));
  }
}
