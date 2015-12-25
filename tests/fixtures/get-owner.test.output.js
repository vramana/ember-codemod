import Ember from 'ember';

const {
  getOwner
} = Ember;

export default Ember.Helper.extend({
  init() {
    this._super(...arguments);

    this.customThing = getOwner(this).lookup('custom:thing');
  }
});
