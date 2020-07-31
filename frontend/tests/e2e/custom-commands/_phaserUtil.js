/**
 * This file contains functions that are sent to selenium, which means they can not contain references
 * to other functions. Duplications found in this file are necessary, otherwise pre-registering them
 * globally would be necessary.
 */

/**
 * @param name {string}
 * @param visibleOnly {boolean}
 * @returns {boolean}
 */
function findPhaserObjectWithName(name, visibleOnly) {
  function recursiveGetNamedObject(gameObjects) {
    for(let i = 0; i<gameObjects.length; i++) {
      const gameObject = gameObjects[i];
      if (!gameObject) {
        continue;
      }
      if (gameObject.key && typeof gameObject.key === 'string' && gameObject.key === name) {
        return gameObject;
      }
      if (gameObject.name === name) {
        return gameObject;
      }
      if (gameObject._text === name) {
        return gameObject;
      }
      if (gameObject.children && gameObject.children.length) {
        const found = recursiveGetNamedObject(gameObject.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  const found = recursiveGetNamedObject(window.Phaser.GAMES[0].world.children);
  if (!found) {
    return false;
  }
  if (!visibleOnly) {
    return true;
  }
  return found.alpha > 0.1;
}

/**
 *
 * @param name {string}
 * @param dispatchEvent {string}
 * @param dispatchArguments {array}
 * @returns {boolean}
 */
function dispatchPhaserObjectEvent(name, dispatchEvent, dispatchArguments) {
  function recursiveGetNamedObject(gameObjects) {
    for(let i = 0; i<gameObjects.length; i++) {
      const gameObject = gameObjects[i];
      if (!gameObject) {
        continue;
      }
      if (gameObject.key && typeof gameObject.key === 'string' && gameObject.key === name) {
        return gameObject;
      }
      if (gameObject.name === name) {
        return gameObject;
      }
      if (gameObject._text === name) {
        return gameObject;
      }
      if (gameObject.children && gameObject.children.length) {
        const found = recursiveGetNamedObject(gameObject.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  const found = recursiveGetNamedObject(window.Phaser.GAMES[0].world.children);
  if (!found) {
    return false;
  }
  if (found.events[dispatchEvent]) {
    found.events[dispatchEvent].dispatch(... dispatchArguments);
    return true;
  }
  if (found[dispatchEvent] && found[dispatchEvent].dispatch) {
    found[dispatchEvent].dispatch(... dispatchArguments);
    return true;
  }
  const childEvtName = dispatchEvent.replace("on", "onChild");
  if (found[childEvtName] && found[childEvtName].dispatch) {
    found[childEvtName].dispatch(... dispatchArguments);
    return true;
  }
  return false;
}

function callPhaserObjectEvent(name, method, args) {
  function recursiveGetNamedObject(gameObjects) {
    for(let i = 0; i<gameObjects.length; i++) {
      const gameObject = gameObjects[i];
      if (!gameObject) {
        continue;
      }
      if (gameObject.key && typeof gameObject.key === 'string' && gameObject.key === name) {
        return gameObject;
      }
      if (gameObject.name === name) {
        return gameObject;
      }
      if (gameObject._text === name) {
        return gameObject;
      }
      if (gameObject.children && gameObject.children.length) {
        const found = recursiveGetNamedObject(gameObject.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  const found = recursiveGetNamedObject(window.Phaser.GAMES[0].world.children);
  if (!found) {
    return false;
  }
  if (!(method in found)) {
    return false;
  }
  found[method].apply(found, args);
  return true;
}

module.exports.findPhaserObjectWithName = findPhaserObjectWithName;
module.exports.dispatchPhaserObjectEvent = dispatchPhaserObjectEvent;
module.exports.callPhaserObjectEvent = callPhaserObjectEvent;
