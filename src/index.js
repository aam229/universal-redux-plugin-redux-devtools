import React from 'react'
import { compose } from 'redux';
import { hooks, environments, positions, register } from 'universal-redux/lib/hooks';
import { createDevTools, persistState } from 'redux-devtools';

import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor />
  </DockMonitor>
);

register(hooks.CREATE_ROOT_COMPONENT, ( promise ) => {
  return promise.then(( props ) => ({
      ...props,
      additionalComponents: true
    })
  );
}, {
  position: positions.AFTER,
  environments: [
    environments.CLIENT,
    environments.DEVELOPMENT
  ]
});

register(hooks.UPDATE_ROOT_COMPONENT, ({ ...props, additionalComponents }) => {
  return {
    ...props,
    additionalComponents: [
      ...additionalComponents,
      <DevTools key="devtools" />
    ]
  }
}, {
  position: positions.BEFORE,
  environments: [
    environments.CLIENT,
    environments.DEVELOPMENT
  ]
});

register(hooks.CREATE_REDUX_MIDDLEWARE, (middleware) => {
  return compose(
    middleware,
    window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  );
}, {
  position: positions.AFTER,
  environments: [
    environments.CLIENT,
    environments.DEVELOPMENT
  ]
});


register(hooks.CREATE_REDUX_STORE, (store, { router }) => {
  router.listenForReplays(store);
  return store;
}, {
  position: positions.AFTER,
  environments: [
    environments.CLIENT,
    environments.DEVELOPMENT
  ]
});


