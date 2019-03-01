import React from 'react';
import { string, func, element, oneOf } from 'prop-types';

const undef = void 0;
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
 * The `Validates` component is used to wrap a component that can be validated, providing the logic for validation change
 * handlers.
 */
export default class Validates extends React.Component {
  /**
   * If `isValid !== wasValid` or `prevName !== this.props.name`, calls the onValidChange handlers in props and context with the
   * specified arguments.
   *
   * @protected
   * @param {Validity} isValid The current validity.
   * @param {Validity} wasValid The previous validity.
   * @param {Object} [prevName] The previous name that the component was using. If it is different than the current name, the
   * props and context handlers will be called first with `undefined` to indicate the previous name no longer has validation.
   */
  onValidChange(isValid, wasValid, prevName) {
    const { onValidChange: propsHandler = noop } = this.props;
    const { onValidChange: ctxHandler = noop } = this.context;
    const { name } = this.props;

    const nameChanged = prevName && prevName !== name;
    const validChanged = isValid !== wasValid;
    if (nameChanged && (undef !== wasValid)) {
      propsHandler(prevName, undef, wasValid);
      ctxHandler(prevName, undef, wasValid);
    }

    if (nameChanged || validChanged) {
      propsHandler(name, isValid, wasValid);
      ctxHandler(name, isValid, wasValid);
    }
  }

  /**
   * React lifecycle handler called immediately before the component's initial render
   */
  componentDidMount() {
    // Update the handlers with the initial state
    this.onValidChange(this.props.validates);
  }

  /**
   * React lifecycle handler called when a component finished updating.
   *
   * @param {Object} prevProps Component's previous props.
   */
  componentDidUpdate(prevProps) {
    const { validates: wasValid, name: prevName } = prevProps;
    const { validates: isValid } = this.props;

    this.onValidChange(isValid, wasValid, prevName);
  }

  /**
   * React lifecycle handler called when component is about to be unmounted.
   */
  componentWillUnmount() {
    // Update the handlers with `isValid=undefined` to notify them that the component no longer is being validated
    this.onValidChange(undef, this.props.validates);
  }

  /**
   * Renders the component.
   *
   * @returns {React.DOM} Rendered component.
   */
  render() {
    return this.props.children || null;
  }
}

Validates.propTypes = {
  validates: oneOf([true, false, null]),
  onValidChange: func,
  name: string.isRequired,
  children: element
};

Validates.contextTypes = {
  onValidChange: func
};

