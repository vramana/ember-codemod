import Ember from 'ember';

import getOwner from 'ember-getowner-polyfill';

export default Ember.Helper.extend({
  init() {
    this._super(...arguments);

    this.customThing = getOwner(this).lookup('custom:thing');
  }
});
