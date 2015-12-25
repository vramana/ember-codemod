function initialize(application) {
  application.inject('route', 'service:session');
}

export default {
  name: 'inject-session',
  initialize
}

const initialize2 = application => {
  application.inject('route', 'service:session');
}

export default {
  name: 'inject-session',
  initialize: initialize2
}

export default {
  name: 'inject-session',
  initialize: function(application) {
    application.inject('route', 'service:session');
  }
}
