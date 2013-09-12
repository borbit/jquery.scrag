/*  
  jQuery.Scrag 0.0.1
*/

(function($, undefined) {

$.fn.scrag = function(op) {
  return this.each(function() {
    var $this = $(this);
    if (!$this.data('scrag')) {
      $this.data('scrag', new Scrag($this, op));
    }
  });
};

function Scrag($el, options) {
  this.$el = $el;
  this.options = options;
  this.scaleFactor = 2;
  this.stopTimer = 0;

  var self = this;
  this.onmousewheel = function(e) {
    self.handle(e);

    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  };

  if (!~navigator.userAgent.indexOf('Chrome') &&
       ~navigator.userAgent.indexOf('Safari/532.0')) {
    this.scaleFactor = 1200;
  } else if (~navigator.userAgent.indexOf('Safari')) {
    this.scaleFactor = 60;
  }

  this.enable();
}

var Proto = Scrag.prototype;

Proto.enable = function() {
  var el = this.$el.get(0);
  if (el.addEventListener) {
    el.addEventListener('mousewheel', this.onmousewheel, false);
    el.addEventListener('DOMMouseScroll', this.onmousewheel, false);
  }
};

Proto.handle = function(e) {
  var delta = this.getWheelDelta(e);
  
  if (!this.scragging) {
    this.deltaX = 0;
    this.deltaY = 0;
  }

  this.deltaX += ~~(delta[0] * this.options.sensitivity);
  this.deltaY += ~~(delta[1] * this.options.sensitivity);

  var data = {
    deltaX: this.deltaX
  , deltaY: this.deltaY
  };

  if (!this.scragging) {
    this.$el.trigger('dragstart', data);
    this.scragging = true;
  }

  this.$el.trigger('drag', data);

  if (this.stopTimer) {
    clearTimeout(this.stopTimer);
  }

  var self = this;
  this.stopTimer = setTimeout(function() {
    self.$el.trigger('dragend', data);
    self.scragging = false;
  }, 100);
};

Proto.getWheelDelta = function(e) {
  // FIREFOX
  if (e.axis != null) {
    if (e.axis == e.HORIZONTAL_AXIS) {
      return [-e.detail / this.scaleFactor, 0];
    }
    if (e.axis == e.VERTICAL_AXIS) {
      return [0, -e.detail / this.scaleFactor];
    }
  }
  // WEBKIT
  if (e.wheelDeltaX != null && e.wheelDeltaY != null) {
    return [
      e.wheelDeltaX / this.scaleFactor,
      e.wheelDeltaY / this.scaleFactor
    ];
  }
  // OPERA
  if (e.detail != null && e.axis == null) {
    return [0, -e.detail / this.scaleFactor];
  }
  return [0, 0];
};

})(jQuery);