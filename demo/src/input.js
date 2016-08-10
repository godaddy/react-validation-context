import React from 'react';
import classNames from 'classnames';
import { Validates } from 'react-validation-context';

import styles from './input.less';

export default class Input extends React.Component {
  constructor (props) {
    super(...arguments);

    // Set up the initial state based on whether the initial value validates
    const { validate, value, defaultValue } = props;
    this.state = { validates: validate(value || defaultValue) };
  }

  render () {
    const { onChange: origOnChange, onValidChange, name, className, children, ...rest } = this.props;
    const { validates } = this.state;

    // Don't pass down validate function to <input>
    delete rest.validate;

    // Wrap the onChange handler to update `this.state.validates`
    const onChange = (e) => {
      if (origOnChange) {
        origOnChange(e);
      }

      this.setState({ validates: this.props.validate(e.target.value) });
    };

    const labelClasses = classNames(styles.label, {
      [styles.invalid]: validates === false
    });

    const inputClasses = classNames(className, styles.input);

    // Render `input` and validation context-aware `Validates`
    return <Validates validates={validates} onValidChange={onValidChange} name={name}>
      <label className={labelClasses}>
        <input type="text" onChange={onChange} name={name} className={inputClasses} {...rest} />
        <span className={styles.children}>
          {children}
        </span>
      </label>
    </Validates>;
  }
}

Input.propTypes = {
  name: React.PropTypes.string.isRequired, // Input identifier name
  className: React.PropTypes.string, // CSS class name
  validate: React.PropTypes.func, // Validation function. Must return `true`, `false`, or `null`
  value: React.PropTypes.string, // Input value
  defaultValue: React.PropTypes.string, // Default input value
  onChange: React.PropTypes.func, // onChange handler for input
  onValidChange: React.PropTypes.func, // validity change handler
  children: React.PropTypes.node // React children
};

Input.defaultProps = {
  validate: () => null // By default, validation is disabled, so return `null`
};

