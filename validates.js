import React from 'react';
import { string, func, element, oneOf } from 'prop-types';

const undef = void 0;
function noop() {}

export default class Validates extends React.Component {
  get propsHandler() {
    const { onValidChange = noop } = this.props;
    return onValidChange;
  }

  get ctxHandler() {
    const { onValidChange = noop } = this.context;
    return onValidChange;
  }

  /**
   * If isValid !== wasValid, calls the onValidChange handlers in props and context with the specified arguments.
   *
   * @param {Mixed} isValid Validity. `true`/`false` if the component is valid/invalid; `null` if validation is disabled;
   * `undefined` if there is no validation at all.
   * @param {Mixed} wasValid The previous validity.
   * @param {Object} [oldName] The old name that the component was using. If it is different than the current name, the props and
   * context handlers will be called first with `undefined` to indicate th old name no longer has validation.
   */
  onValidChange(isValid, wasValid, oldName) {
    if (!oldName && isValid === wasValid) {
      // Nothing changed, return.
      return;
    }

    const { propsHandler, ctxHandler } = this;
    const { name } = this.props;

    if (oldName && oldName !== name) {
      if (undef !== wasValid) {
        propsHandler(oldName, undef, wasValid);
        ctxHandler(oldName, undef, wasValid);
      }

      propsHandler(name, isValid, wasValid);
      ctxHandler(name, isValid, wasValid);
    } else if (isValid !== wasValid) {
      propsHandler(name, isValid, wasValid);
      ctxHandler(name, isValid, wasValid);
    }
  }

  /**
   * React lifecycle handler called immediately before the component's initial render
   */
  componentWillMount() {
    // Update the handlers with the initial state
    this.onValidChange(this.props.validates);
  }

  /**
   * React lifecycle handler called when a component finished updating.
   *
   * @param {Object} prevProps Component's old props.
   */
  componentDidUpdate(prevProps) {
    const { validates: wasValid, name: oldName } = prevProps;
    const { validates: isValid } = this.props;

    this.onValidChange(isValid, wasValid, oldName);
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

