import React from 'react';

import Form from './form';
import Input from './input';

import 'normalize.css';
import styles from './app.less';

export default function App() {
  return <div className={ styles.app }>
    <Form name='form-example' action='.'>
      <Input name='foo' validate={ v => /^foo/.test(v) } defaultValue='foo'>
        Must start with &quot;foo&quot;
      </Input>
      <Input name='bar' validate={ v => /bar$/.test(v) }>
        Must end with &quot;bar&quot;
      </Input>
      <Input name='any'>Anything goes</Input>
      <button type='submit'>Submit</button>
    </Form>
  </div>;
}

