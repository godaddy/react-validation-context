import Validates from './validates';
import { Context }  from './context';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * This library revolves around the idea of "validity". A component can have one of the following validities:
 *
 * - `undefined` - No validation state defined. This is the default.
 * - `null` - Validation is disabled.
 * - `true` - Validation passed.
 * - `false` - Validation failed.
 *
 * @typedef {(undefined|null|Boolean)} Validity
 */

/**
 * The `Validate` component is used to wrap a component which has descendants
 * that may be validated, and provides an interface for validating all of those
 * descendants. It extends `Validates` to provide the same interface for
 * listening for validation changes on the component itself.
 *
 * **NOTE**: This component is able to keep track of all conforming descendant
 * components (not just direct children) via the React `context` api.
 *
 * @public
 */
class Validate extends Validates {
  constructor() {
    super(...arguments);

    this.state = {
      //
      // Validity that results from calling the validate() function from props
      //
      validates: undefined,

      //
      // Set of validities for descendent components; key is component name,
      // value is validity.
      //
      valids: {}
    };

    this.processValidChange = this.processValidChange.bind(this);
  }

  /**
   * Whether or not the component currently validates.
   *
   * @type {Validity}
   * @private
   */
  get validates() {
    return this.props.validates || this.state.validates;
  }

  /**
   * Child validity change handler.
   *
   * @param {String} name Identifier for the field whose validity changed.
   * @param {Validity} isValid The field's current validity.
   * @private
   */
  processValidChange(name, isValid) {
    const { valids } = this.state;
    const { validate } = this.props;

    if (isValid === undefined) {
      delete valids[name];
    } else {
      valids[name] = isValid;
    }

    this.setState({ valids, validates: validate(valids) });
  }

  /**
   * React lifecycle handler called immediately after the component's initial
   * render.
   *
   * @private
   */
  componentDidMount() {
    // Update the handlers with the initial state
    this.onValidChange(this.validates);
  }

  /**
   * React lifecycle handler called when a component finished updating.
   *
   * @param {Object} prevProps Component's previous props.
   * @param {Object} prevState Component's previous state.
   * @private
   */
  componentDidUpdate(prevProps, prevState) {
    const executeOnValidChange = () => {
      const isValid = this.validates;
      // Prefer props over state.
      const { validates: wasValid = prevState.validates, name: prevName } = prevProps;
      this.onValidChange(isValid, wasValid, prevName);
    };

    if (this.props.validate !== prevProps.validate) {
      this.setState({ validates: this.props.validate(this.state.valids) }, executeOnValidChange);
    } else {
      executeOnValidChange();
    }
  }

  /**
   * React lifecycle handler called when component is about to be unmounted.
   *
   * @public
   */
  componentWillUnmount() {
    //
    // Update the handlers with `isValid=undefined` to notify them that the
    // component no longer is being validated
    //
    this.onValidChange(undefined, this.validates);
  }

  /**
   * Renders the component.
   *
   * @returns {Context.Provider} Rendered component.
   * @public
   */
  render() {
    return (
      <Context.Provider value={{ onValidChange: this.processValidChange }}>
        { this.props.children }
      </Context.Provider>
    );
  }
}

Validate.defaultProps = {
  validate: () => {} // by default, no validation defined.
};

/**
 * Specify the PropTypes for validation purposes.
 *
 * @type {Object}
 */
Validate.propTypes = {
  validate: PropTypes.func.isRequired // validation function
};

// Inherit all propTypes from Validate. In production propTypes are stripped
// so be sure to check for their existence before copying them over.
if (Validates.propTypes) {
  Object.keys(Validates.propTypes).forEach(function each(key) {
    Validate.propTypes[key] = Validates.propTypes[key];
  });
}

//
// Expose the interface.
//
export default Validate;
