import Engine from 'ember-engines/engine';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';
import config from './config/environment';

const { modulePrefix } = config;

const Eng = Engine.extend({
  modulePrefix,
  Resolver,
  dependencies: {
    services: [
      'access',
      'app',
      'catalog',
      'clusterStore',
      'endpoint',
      'external-utils',
      'github',
      'globalStore',
      'intl',
      'modal',
      'resource-actions',
      'router',
      'scope',
      'session',
      'settings',
      'store',
      'tooltip',
      'user-language',
      'user-theme',
    ],
    externalRoutes: [
      'index',
      'failWhale',
      'authenticated',
      'authenticated.cluster',
      'authenticated.cluster.projects',
      'authenticated.project',
      'authenticated.prefs',
      'logout'
    ]
  }
});

loadInitializers(Eng, modulePrefix);

export default Eng;
