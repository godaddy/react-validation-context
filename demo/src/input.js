import React from 'react';
import { string, func, node } from 'prop-types';
import classNames from 'classnames';
import { Validates } from 'react-validation-context';

import styles from './input.less';

export default class Input extends React.Component {
  constructor(props) {
    super(...arguments);

    // Set up the initial state based on whether the initial value validates
    const { validate, value, defaultValue } = props;
    this.state = { validates: validate(value || defaultValue) };

    this.onChange = this.onChange.bind(this);
  }

  // Wrap the onChange handler to update `this.state.validates`
  onChange(e) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }

    this.setState({ validates: this.props.validate(e.target.value) });
  }

  render() {
    const { onChange } = this;
    const { onValidChange, name, className, children, validate, ...inputProps } = this.props;
    void validate; // needs to be destructured to avoid inclusion in `inputProps`
    const { validates } = this.state;


    const labelClasses = classNames(styles.label, {
      [styles.invalid]: validates === false
    });

    const inputClasses = classNames(className, styles.input);

    // Set up `input` props
    Object.assign(inputProps, { onChange, name, className: inputClasses });

    // Render `input` and validation context-aware `Validates`
    return <Validates validates={ validates } onValidChange={ onValidChange } name={ name }>
      <label className={ labelClasses }>
        <input type='text' { ...inputProps } />
        <span className={ styles.children }>
          {children}
        </span>
      </label>
    </Validates>;
  }
}

Input.propTypes = {
  name: string.isRequired, // Input identifier name
  className: string, // CSS class name
  validate: func, // Validation function. Must return `true`, `false`, or `null`
  value: string, // Input value
  defaultValue: string, // Default input value
  onChange: func, // onChange handler for input
  onValidChange: func, // validity change handler
  children: node // React children
};

Input.defaultProps = {
  validate: () => null // By default, validation is disabled, so return `null`
};

