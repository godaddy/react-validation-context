import PropTypes from 'prop-types';
import { Component } from 'react';

function noop() {}

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
 * It is useful to know when a component's validity changes. As such, this library attempts to provide a uniform API for
 * validation change handlers. In general, a validity change handler has the following API:
 *
 * @callback onValidChange
 * @param {String} name - The unique identifier for the component whose validity changed.
 * @param {Validity} isValid - The current validity of the component.
 * @param {Validity} wasValid - The previous validity of the component.
 */

/**
 * The `Validates` component is used to wrap a component that can be validated,
 * providing the logic for validation change handlers.
 *
 * @class {Validates}
 * @public
 */
class Validates extends Component {
  /**
   * If `isValid !== wasValid` or `prevName !== this.props.name`, calls the
   * onValidChange handlers in props and context with the specified arguments.
   *
   * @protected
   * @param {Validity} isValid The current validity.
   * @param {Validity} wasValid The previous validity.
   * @param {Object} [prevName] The previous name that the component was using.
   * If it is different than the current name, the props and context handlers
   * will be called first with `undefined` to indicate the previous name no
   * longer has validation.
   */
  onValidChange(isValid, wasValid, prevName) {
    const { onValidChange: propsHandler = noop, name, context } = this.props;
    const { onValidChange: ctxHandler = noop } = context;

    const nameChanged = prevName && prevName !== name;
    const validChanged = isValid !== wasValid;

    if (nameChanged && (undefined !== wasValid)) {
      propsHandler(prevName, undefined, wasValid);
      ctxHandler(prevName, undefined, wasValid);
    }

    if (nameChanged || validChanged) {
      propsHandler(name, isValid, wasValid);
      ctxHandler(name, isValid, wasValid);
    }
  }

  /**
   * React lifecycle handler called immediately after the component's initial
   * render.
   *
   * @private
   */
  componentDidMount() {
    this.onValidChange(this.props.validates);
  }

  /**
   * React lifecycle handler called when a component finished updating.
   *
   * @param {Object} prevProps Component's previous props.
   * @private
   */
  componentDidUpdate(prevProps) {
    const { validates: wasValid, name: prevName } = prevProps;
    const { validates: isValid } = this.props;

    this.onValidChange(isValid, wasValid, prevName);
  }

  /**
   * Update the handlers with `isValid=undefined` to notify them that the
   * component no longer is being validated.
   *
   * @private
   */
  componentWillUnmount() {
    this.onValidChange(undefined, this.props.validates);
  }

  /**
   * Renders the component.
   *
   * @returns {Component|Null} Rendered component.
   * @public
   */
  render() {
    return this.props.children || null;
  }
}

/**
 * Specify the PropTypes for validation purposes.
 *
 * @type {Object}
 */
Validates.propTypes = {
  validates: PropTypes.oneOf([true, false, null]),
  onValidChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  context: PropTypes.object
};

//
// Expose the interface.
//
export default Validates;
