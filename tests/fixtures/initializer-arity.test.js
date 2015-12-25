function initialize(container, application) {
  application.inject('route', 'service:session');
}

export default {
  name: 'inject-session',
  initialize
}

const initialize2 = (container, application) => {
  application.inject('route', 'service:session');
}

export default {
  name: 'inject-session',
  initialize: initialize2
}

export default {
  name: 'inject-session',
  initialize: function(container, application) {
    application.inject('route', 'service:session');
  }
}
