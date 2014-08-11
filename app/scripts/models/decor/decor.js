Physics.body('decor', 'convex-polygon', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
        gameType: 'decor',
        treatment: options.treatment || 'static',
      };

      parent.init.call(this, $.extend({}, defaults, options));
    },
  };
  
});
