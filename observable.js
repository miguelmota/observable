(function(root) {

  function observable(el) {
    var _this = this,
    callbacks = {};

    el.on = function(name, fn) {
      if (typeof fn !== 'function') {
        throw new TypeError('Second argument for "on" method must be a function.');
      }
      (callbacks[name] = callbacks[name] || []).push(fn);
      return el;
    };

    el.one = function(name, fn) {
      fn.one = true;
      return el.on.call(el, name, fn);
    };

    el.off = function(name, fn) {
      if (name === '*') return (callbacks = {}, callbacks);
      if (!callbacks[name]) return;
      if (fn) {
        if (typeof fn !== 'function') {
          throw new TypeError('Second argument for "off" method must be a function.');
        }
        callbacks[name] = callbacks[name].map(function(fm, i) {
          if (fm === fn) {
            callbacks[name].splice(i, 1);
          }
        });
      } else {
        delete callbacks[name];
      }
    };

    el.trigger = function(name /*, args */) {
      if (!callbacks[name] || !_size(callbacks[name])) return;
      var args = [].slice.call(arguments, 1);

      callbacks[name].forEach(function(fn, i) {
        if (fn) {
          fn.apply(fn, args);
          if (fn.one) {
            callbacks[name].splice(i, 1);
          }
        }
      });
      return el;
    };

    return el;
  }

  function _size(col) {
    if (Array.isArray(col)) {
      return col.length;
    }
    return 0;
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = observable;
    }
    exports.observable = observable;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return observable;
    });
  } else {
    root.observable = observable;
  }

})(this);