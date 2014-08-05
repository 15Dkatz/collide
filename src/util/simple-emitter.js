
// All we want is an eventEmitter that doesn't use #call or #apply,
// by expecting 0-1 arguments. 
// We couldn't find this on npm, so we make our own.

module.exports = SimpleEventEmitter;

function SimpleEventEmitter() {
}

SimpleEventEmitter.prototype = {
  listeners: [],
  on: function(eventType, listener) {
    this.listeners[eventType] || (this.listeners[eventType] = []);
    this.listeners[eventType].push(listener);
  },
  once: function(eventType, listener) {
    this.on(eventType, function onceFn() {
      this.off(eventType, onceFn);
      this.off(eventType, listener);
    });
    this.on(eventType, listener);
  },
  // Built-in limitation: we only expect 0-1 arguments
  // This is to save as much perf as possible when sending
  // events every frame.
  emit: function(eventType, arg) {
    var listeners = this.listeners[eventType] || [];
    var i = 0;
    var len = listeners.length;
    if (arguments.length === 2) {
      for (i = 0; i < len; i++) listeners[i](arg);
    } else {
      for (i = 0; i < len; i++) listeners[i]();
    }
  },
  off: function(eventType, listenerToRemove) {
    if (!eventType) {
      //Remove all listeners
      for (eventType in this.listeners) {
        this.off(eventType);
      }
    } else  {
      var listeners = this.listeners[eventType];
      if (listeners) {
        if (!listenerToRemove) {
          listeners.length = 0;
        } else {
          var index = listeners.indexOf(listenerToRemove);
          listeners.splice(index, 1);
        }
      }
    }
  } 
};
