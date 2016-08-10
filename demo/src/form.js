import React from 'react';
import classNames from 'classnames';
import { Validate } from 'react-validation-context';

import styles from './form.less';

export default class Form extends React.Component {
  constructor () {
    super(...arguments);

    // The form is initially valid
    this.state = { validates: true };
  }

  render () {
    const { onValidChange: origOnValidChange, onSubmit: origOnSubmit, children, name, className, ...rest } = this.props;
    const { validates } = this.state;

    // The form is invalid if there are any invalid items in its validation context
    const validate = valids => Object.keys(valids).every(k => valids[k] !== false);

    // Wrap the onValidChange handler to set this.state.validates
    const onValidChange = (name, isValid, wasValid) => {
      if (origOnValidChange) {
        origOnValidChange(name, isValid, wasValid);
      }

      this.setState({ validates: isValid });
    }

    // Wrap the onSubmit handler to prevent submission if the form is invalid
    const onSubmit = e => {
      if (origOnSubmit) {
        origOnSubmit(e);
      }

      if (!this.state.validates) {
        e.preventDefault();
      }
    }

    const classes = classNames(className, styles.form, {
      [styles.invalid]: validates === false
    });

    // Render `form` and create validation context `Validate` (which is also validation context-aware)
    return <Validate validate={validate} onValidChange={onValidChange} name={name}>
      <form onSubmit={onSubmit} name={name} className={classes} {...rest}>
        {children}
      </form>
    </Validate>;
  }
}

Form.propTypes = {
  name: React.PropTypes.string.isRequired, // Form identifier name
  className: React.PropTypes.string, // CSS class name
  onSubmit: React.PropTypes.func, // onSubmit handler for form
  onValidChange: React.PropTypes.func, // validity change handler
  children: React.PropTypes.node // React children
};

