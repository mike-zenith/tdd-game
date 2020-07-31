const util = require('util');
const GameObjectDispatch = require('./gameObjectDispatch');
const WaitForSelector = require('./_waitForSelector');
const { callPhaserObjectEvent } = require('./_phaserUtil');

/**
 * @method typeToGameInput
 * @param {string} objectSelector
 * @param {string} text
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports a placeholder: %d for the time (e.g. Phaser was not in the page for %d ms).
 * @api commands
 */
function typeToGameInput() {
  GameObjectDispatch.call(this);
}

util.inherits(typeToGameInput, GameObjectDispatch);

/**
 * @method command
 * @param {string} selector
 * @param {string} text
 * @param {number|function|string} milliseconds
 * @param {function|boolean|string|number} callbackOrAbort
 * @returns {typeToGameInput}
 */
typeToGameInput.prototype.command = function commandFn(selector, text, milliseconds, callbackOrAbort) {
  WaitForSelector.prototype.command.apply(this, [{ object: selector, text: text }, milliseconds || 500, callbackOrAbort]);
  return this;
}


/**
 * @method getProtocolCommand
 * @param callback
 * @returns {*}
 */
typeToGameInput.prototype.getProtocolCommand = function (callback) {
  const self = this;
  return this.api.execute(
    callPhaserObjectEvent,
    [this.selector.object, 'setText', [this.selector.text]],
    function (result) {
      callback.call(self, result);
    });
};

module.exports = typeToGameInput;
