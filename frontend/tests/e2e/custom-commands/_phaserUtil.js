function findPhaserObjectWithName(name) {
  function recursiveGetNamedObject(gameObjects) {
    for(let i = 0; i<gameObjects.length; i++) {
      const gameObject = gameObjects[i];
      if (!gameObject) {
        continue;
      }
      if (gameObject.key && typeof gameObject.key === 'string' && gameObject.key === name) {
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

  return null !== recursiveGetNamedObject(window.Phaser.GAMES[0].stage.children[0].children);
}

module.exports.findPhaserObjectWithName = findPhaserObjectWithName;
