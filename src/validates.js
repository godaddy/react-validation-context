import React from 'react';

export default class Validates extends React.Component {
  /**
   * If isValid !== wasValid, calls the onValidChange handlers in props and context with the specified arguments.
   *
   * @param {Mixed} isValid Validity. `true`/`false` if the component is valid/invalid; `null` if validation is disabled
   * @param {Mixed} wasValid The previous validity. May be `undefined` if this is the first update.
   */
  onValidChange (isValid, wasValid) {
    if (isValid === wasValid) {
      return;
    }

    const { onValidChange: propsHandler, name } = this.props;
    const { onValidChange: ctxHandler } = this.context;

    if (propsHandler) {
      propsHandler(name, isValid, wasValid);
    }

    if (ctxHandler) {
      ctxHandler(name, isValid, wasValid);
    }
  }

  /**
   * React lifecycle handler called immediately before the component's initial render
   */
  componentWillMount () {
    // Update the handlers with the initial state
    this.onValidChange(this.props.validates);
  }

  /**
   * React lifecycle handler called when component is about to update.
   *
   * @param {Object} nextProps Component's new props.
   */
  componentWillUpdate (nextProps) {
    const { validates: wasValid } = this.props;
    const { validates: isValid } = nextProps;

    this.onValidChange(isValid, wasValid);
  }

  /**
   * Renders the component.
   *
   * @returns {React.DOM} Rendered component.
   */
  render () {
    return this.props.children || null;
  }
}

Validates.propTypes = {
  validates: React.PropTypes.oneOf([true, false, null]),
  onValidChange: React.PropTypes.func,
  name: React.PropTypes.string.isRequired,
  children: React.PropTypes.element
};

Validates.contextTypes = {
  onValidChange: React.PropTypes.func
};

