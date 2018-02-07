function EventEmitter() {
  var emitter = {};
  var events = {};

  const listeningTo = function(event) {
    return !!events[event];
  }

  emitter.on = function(event, handler, context) {
    events[event] = events[event] || [];
    events[event] = events[event].concat({
      handler: handler,
      context: context,
    });
  };

  emitter.off = function(event, handler, context) {
    if (!events[event]) {
      return;
    }
    for (var i = 0; i < events[event].length; i++) {
      if (events[event][i].handler === handler && events[event][i].context === context) {
        events[event] = events[event].slice(0, i).concat(events[event].slice(i + 1));
      }
    }
  };

  emitter.emit = function(event) {
    if (!events[event]) {
      return;
    }
    for (var i = 0; i < events[event].length; i++) {
      events[event][i].handler.apply(events[event][i].context, Array.prototype.slice.call(arguments, 1));
    }
  };

  emitter.maybeReportError = function(error) {
    if (!error) {
      return;
    }
    if (listeningTo('error')) {
      this.emit('error', error);
    } else {
      console.error(error.message);
    }
  }
  return emitter;
}

export default EventEmitter;
