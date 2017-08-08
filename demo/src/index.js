import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './app';

const appDiv = document.createElement('div');
appDiv.id = 'app';
document.body.appendChild(appDiv);

/**
 * Starts the app by rendering it into the page.
 */
function start() {
  render(<AppContainer>
    <App />
  </AppContainer>, appDiv);
}

start();

if (module.hot) {
  module.hot.accept('./app', start);

  module.hot.dispose(() =>
    document.body.removeChild(appDiv)
  );
}

