import Ember from 'ember';

export default Ember.Helper.extend({
  init() {
    this._super(...arguments);

    this.customThing = this.container.lookup('custom:thing');
  }
});
