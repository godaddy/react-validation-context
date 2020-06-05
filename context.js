import addhoc from 'addhoc';
import React from 'react';

/**
 * The custom context.
 *
 * @type {Object}
 * @public
 */
const Context = React.createContext({
  onValidChange: function nope() {}
});

/**
 * Provide HOC for wrapping with a consumer.
 *
 * @param {Function} introduce The function returns a component.
 * @returns {Component} React Component wrapped.
 * @public
 */
const withConsumer = addhoc(getWrappedComponent => (
  <Context.Consumer>
    { context => getWrappedComponent({ context }) }
  </Context.Consumer>
), 'withValidationContext');

export {
  withConsumer,
  Context
};
