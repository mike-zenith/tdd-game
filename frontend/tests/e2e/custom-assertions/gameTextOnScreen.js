const util = require('util');
const { findPhaserObjectWithName } = require('../custom-commands/_phaserUtil');

exports.assertion = function(expected) {

  const DEFAULT_MSG = 'Testing if Phaser.Text rendered on screen: %s.';
  const STATE_NOT_FOUND = DEFAULT_MSG + ' ' + 'Text is not rendered.';
  /**
   * The message which will be used in the test output and
   * inside the XML reports
   * @type {string}
   */
  this.message = util.format(DEFAULT_MSG, expected);

  /**
   * A value to perform the assertion on. If a function is
   * defined, its result will be used.
   * @type {function|*}
   */
  this.expected = expected;

  /**
   * The method which performs the actual assertion. It is
   * called with the result of the value method as the argument.
   * @type {function}
   */
  this.pass = function(phaserObject) {
    return !!phaserObject;
  };

  /**
   * @methd failure
   * @param result
   * @returns {boolean}
   */
  this.failure = function(result) {
    const failed = (result === false);
    if (failed) {
      this.message = msg || util.format(STATE_NOT_FOUND, expected);
    }
    return failed;
  };

  /**
   * The method which returns the value to be used on the
   * assertion. It is called with the result of the command's
   * callback as argument.
   * @type {function}
   */
  this.value = function(result) {
    return result.value;
  };

  /**
   * Performs a protocol command/action and its result is
   * passed to the value method via the callback argument.
   * @type {function}
   */
  this.command = function(callback) {

    return this.api.execute(findPhaserObjectWithName, [expected], callback);

  };

};


