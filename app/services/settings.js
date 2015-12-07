import Ember from 'ember';
import C from 'ui/utils/constants';

function normalizeName(str) {
  return str.replace(/\./g, C.SETTING.DOT_CHAR).toLowerCase();
}

function denormalizeName(str) {
  return str.replace(C.SETTING.DOT_CHAR,'.').toLowerCase();
}

export default Ember.Service.extend({
  all: null,

  init() {
    this._super();
    this.set('all', this.get('store').allUnremoved('activesetting'));
  },

  unknownProperty(key) {
    var obj = this.findByName(key);
    if ( obj )
    {
      var val = obj.get('value');
      if ( val === 'false' )
      {
        return false;
      }
      else if ( val === 'true' )
      {
        return true;
      }
      else
      {
        return val;
      }
    }

    return null;
  },

  setUnknownProperty(key, value) {
    var obj = this.findByName(key);

    if ( value === undefined )
    {
      // Delete by set to undefined is not needed for settings
      throw new Error('Deleting settings is not supported');
    }

    if ( !obj )
    {
      obj = this.get('store').createRecord({
        type: 'setting',
        name: denormalizeName(key),
      });
    }

    obj.set('value', value+''); // Values are all strings in settings.
    obj.save().then(() => {
      this.notifyPropertyChange(normalizeName(key));
    });

    return value;
  },

  findByName(name) {
    return this.get('asMap')[normalizeName(name)];
  },

  asMap: function() {
    var out = {};
    (this.get('all')||[]).forEach((setting) => {
      var name = normalizeName(setting.get('name'));
      out[name] = setting;
    });

    return out;
  }.property('all.@each.{name,value}'),

  uiVersion: function() {
    return 'v' + this.get('app.version');
  }.property('app.version'),

  rancherVersion: Ember.computed.alias('asMap.'+C.SETTING.VERSION_RANCHER+'.value'),
  composeVersion: Ember.computed.alias('asMap.'+C.SETTING.VERSION_COMPOSE+'.value'),
  cattleVersion: Ember.computed.alias('asMap.'+C.SETTING.VERSION_CATTLE+'.value'),
  dockerMachineVersion: Ember.computed.alias('asMap.'+C.SETTING.VERSION_MACHINE+'.value'),
  goMachineVersion: Ember.computed.alias('asMap.'+C.SETTING.VERSION_GMS+'.value'),

  hasVm: Ember.computed.equal('asMap.'+C.SETTING.VM_ENABLED+'.value', 'true'),
});