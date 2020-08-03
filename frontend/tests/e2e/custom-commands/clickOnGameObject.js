const Events = require('events');

module.exports = class ClickOnGameObject extends Events {
  command(object, ms) {
    this.api
      .gameObjectDispatch(object, 'onInputDown', ms || 500)
      .execute(
        function () {
          document.querySelector('canvas').click();
        },
        [],
        () => this.emit('complete'));

    return this;
  }
};
