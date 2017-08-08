import React from 'react';
import { string, func, node } from 'prop-types';
import classNames from 'classnames';
import { Validate } from 'react-validation-context';

import styles from './form.less';

export default class Form extends React.Component {
  constructor() {
    super(...arguments);

    // The form is initially valid
    this.state = { validates: true };

    this.onValidChange = this.onValidChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // Wrap the onValidChange handler to set this.state.validates
  onValidChange(name, isValid, wasValid) {
    const { onValidChange } = this.props;
    if (onValidChange) {
      onValidChange(name, isValid, wasValid);
    }

    this.setState({ validates: isValid });
  }

  // Wrap the onSubmit handler to prevent submission if the form is invalid
  onSubmit(e) {
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(e);
    }

    if (!this.state.validates) {
      e.preventDefault();
    }
  }

  // The form is invalid if there are any invalid items in its validation context
  validate(valids) {
    return Object.keys(valids).every(k => valids[k] !== false);
  }

  render() {
    const { onSubmit, onValidChange, validate } = this;
    const { children, name, className, ...formProps } = this.props;
    const { validates } = this.state;

    const classes = classNames(className, styles.form, {
      [styles.invalid]: validates === false
    });

    // Set up `form` props
    Object.assign(formProps, { onSubmit, name, className: classes });

    // Render `form` and create validation context `Validate` (which is also validation context-aware)
    return <Validate validate={ validate } onValidChange={ onValidChange } name={ name }>
      <form { ...formProps }>
        {children}
      </form>
    </Validate>;
  }
}

Form.propTypes = {
  name: string.isRequired, // Form identifier name
  className: string, // CSS class name
  onSubmit: func, // onSubmit handler for form
  onValidChange: func, // validity change handler
  children: node // React children
};

