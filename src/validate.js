import React from 'react';
import Validates from './validates';

export default class Validate extends Validates {
  constructor (props) {
    super(props);

    this.state = {
      validates: props.validates,
      valids: {}
    };
  }

  /**
   * Get the child context.
   *
   * @returns {Object} The child context.
   * @private
   */
  getChildContext () {
    return {
      /**
       * Child validity change handler.
       *
       * @param {String} name Identifier for the field whose validity changed
       * @param {Mixed} isValid Validity. `true`/`false` if the component is valid/invalid; `null` if validation is disabled
       */
      onValidChange: (name, isValid) => {
        const { valids } = this.state;
        valids[name] = isValid;
        this.setState({ valids, validates: this.props.validate(valids) });
      }
    }
  }

  /**
   * React lifecycle handler called immediately before the component's initial render.
   */
  componentWillMount () {
    const { validates : isValid = this.state.validates } = this.props;

    // Update the handlers with the initial state
    this.onValidChange(isValid);
  }

  /**
   * React lifecycle handler called when a component is receiving new props.
   *
   * @param {Object} nextProps Component's new props.
   */
  componentWillReceiveProps (nextProps) {
    const { validate } = nextProps;
    this.setState({ validates: validate(this.state.valids) });
  }

  /**
   * React lifecycle handler called when component is about to update.
   *
   * @param {Object} nextProps Component's new props.
   * @param {Object} nextState Component's new state.
   */
  componentWillUpdate (nextProps, nextState) {
    const { validates: wasValid = this.state.validates } = this.props;
    const { validates: isValid = nextState.validates } = nextProps;

    this.onValidChange(isValid, wasValid);
  }
}

Validate.defaultProps = {
  validate: () => null // by default, validation is disabled
};

Validate.propTypes = {
  validate: React.PropTypes.func // validation function
};

// Inherit all propTypes from Validate. In production propTypes are stipped
// so be sure to check for their existence before copying them over.
if (Validates.propTypes) {
  Object.keys(Validates.propTypes).forEach(k => (Validate.propTypes[k] = Validates.propTypes[k]));
}

Validate.childContextTypes = {
  onValidChange: React.PropTypes.func
};

