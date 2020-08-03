const util = require('util');
const WaitForSelector = require('./_waitForSelector');
const { dispatchPhaserObjectEvent } = require('./_phaserUtil');

/**
 * @method gameObjectDispatch
 * @param {string} objectSelector
 * @param {string} event
 * @param {array} args array of arguments to dispatch
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports a placeholder: %d for the time (e.g. Phaser was not in the page for %d ms).
 * @api commands
 */
function gameObjectDispatch() {
  WaitForSelector.call(this);
  this.expectedValue = 'found';
}

util.inherits(gameObjectDispatch, WaitForSelector);

/**
 * @method command
 * @param {string} selector
 * @param {string} event
 * @param {array} args
 * @param {number|function|string} milliseconds
 * @param {function|boolean|string|number} callbackOrAbort
 * @returns {gameObjectDispatch}
 */
gameObjectDispatch.prototype.command = function commandFn() {
  const [selector, event, ... remainingArgs] = arguments;
  const dispatch = {
    object: selector,
    event: event,
    args: []
  }
  if (Array.isArray(remainingArgs[0])) {
    dispatch.args = remainingArgs.shift();
  }
  remainingArgs.unshift(dispatch);
  WaitForSelector.prototype.command.apply(this, remainingArgs);
  return this;
}

gameObjectDispatch.prototype.phaserComponentFound = function(result, now) {
  const defaultMsg = 'Object was found after %d milliseconds.';
  return this.pass(result, defaultMsg, now - this.startTimer);
};

gameObjectDispatch.prototype.phaserComponentNotFound = function(result, now) {
  if (now - this.startTimer < this.ms) {
    this.reschedule();
    return this;
  }

  const defaultMsg = 'Timed out while waiting for Object for %d milliseconds.';
  return this.fail({value:false}, 'not found', this.expectedValue, defaultMsg, now - this.startTimer);
};

/**
 * @method getProtocolCommand
 * @param callback
 * @returns {*}
 */
gameObjectDispatch.prototype.getProtocolCommand = function (callback) {
  const self = this;
  return this.api.execute(
    dispatchPhaserObjectEvent,
    [this.selector.object, this.selector.event, this.selector.args],
    function (result) {
      callback.call(self, result);
    })
};



module.exports = gameObjectDispatch;
