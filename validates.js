import React from 'react';
import { string, func, element, oneOf } from 'prop-types';

const undef = void 0;
function noop() {}

export default class Validates extends React.Component {
  /**
   * If `isValid !== wasValid` or `prevName !== this.props.name`, calls the onValidChange handlers in props and context with the
   * specified arguments.
   *
   * @param {Mixed} isValid Validity. `true`/`false` if the component is valid/invalid; `null` if validation is disabled;
   * `undefined` if there is no validation at all.
   * @param {Mixed} wasValid The previous validity.
   * @param {Object} [prevName] The previous name that the component was using. If it is different than the current name, the
   * props and context handlers will be called first with `undefined` to indicate th old name no longer has validation.
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

