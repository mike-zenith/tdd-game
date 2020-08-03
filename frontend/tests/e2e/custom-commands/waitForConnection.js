const Events = require('events');

module.exports = class WaitForConnection extends Events {
  _timeout = null;

  command(server, ms, callback) {
    let cb = (typeof ms === 'function' ? ms : callback) || (() => {});
    let waitUntil = ms || 3000;

    server.on('connection', client => {
      cb.apply(this.api, client);
      this.emit('complete');
    });

    this._timeout = setTimeout((self) => {
      cb.apply(self.api, null);
      self.emit('complete');
    }, waitUntil, this)

    return this;
  }
};
