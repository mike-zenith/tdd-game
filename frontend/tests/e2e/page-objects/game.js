module.exports = {
  url: function () {
    return this.api.launchUrl;
  },
  elements: {
    canvas: 'canvas',
  },
  commands: [
    {
      execute: function (fn) {
        this.api.execute(fn);
      }
    }
  ],
  props: {

  },
  sections: {
  }
};
