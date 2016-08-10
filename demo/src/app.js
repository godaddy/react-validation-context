import React from 'react';
import { render } from 'react-dom';

import Form from './form';
import Input from './input';

import 'normalize.css';
import styles from './app.less';

function App() {
  return <div className={styles.app}>
    <Form name="form-example" action=".">
      <Input name="foo" validate={v => /^foo/.test(v)} defaultValue="foo">Must start with "foo"</Input>
      <Input name="bar" validate={v => /bar$/.test(v)}>Must end with "bar"</Input>
      <Input name="any">Anything goes</Input>
      <button type="submit">Submit</button>
    </Form>
  </div>;
}

function renderApp(elem, done) {
  render(<App />, elem, done);
}

const bundleLoadedEvent = new Event('appBundleLoaded');
bundleLoadedEvent.renderApp = renderApp;
window.dispatchEvent(bundleLoadedEvent);

