import { func } from 'prop-types';
import Validates from './validates';

const undef = void 0;

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
 * The `Validate` component is used to wrap a component which has descendants that may be validated, and provides an interface for
 * validating all of those descendants. It extends `Validates` to provide the same interface for listening for validation changes
 * on the component itself.
 *
 * **NOTE**: This component is able to keep track of all conforming descendant components (not just direct children) via the React
 * `context` api.
 */
export default class Validate extends Validates {
  /**
   * Creates a new instance of the component.
   *
   * @param {Object} props - The component's props.
   */
  constructor(props) {
    super(props);

    this.state = {
      validates: undef, // validity that results from calling the validate() function from props
      valids: {}        // set of validities for descendent components; key is component name, value is validity
    };
  }

  /**
   * Whether or not the component currently validates.
   *
   * @type {Validity}
   * @private
   */
  get validates() {
    // Prefer props over state.
    const { validates = this.state.validates } = this.props;
    return validates;
  }

  /**
   * Get the child context.
   *
   * @returns {Object} The child context.
   */
  getChildContext() {
    return {
      /**
       * Child validity change handler.
       *
       * @param {String} name Identifier for the field whose validity changed.
       * @param {Validity} isValid The field's current validity.
       */
      onValidChange: (name, isValid) => {
        const { valids } = this.state;
        const { validate } = this.props;

        if (isValid === undef) {
          delete valids[name];
        } else {
          valids[name] = isValid;
        }
        this.setState({ valids, validates: validate(valids) });
      }
    };
  }

  /**
   * React lifecycle handler called immediately after the component's initial render.
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
   */
  componentDidUpdate(prevProps, prevState) {
    const executeOnValidChange = () => {
      const isValid = this.validates;
      // Prefer props over state.
      const { validates: wasValid = prevState.validates, name: prevName } = prevProps;
      this.onValidChange(isValid, wasValid, prevName);
    };

    if (this.props.validate !== prevProps.validate) {
      this.setState({ validates: this.props.validate(this.state.valids) }, () => {
        executeOnValidChange();
      });
    } else {
      executeOnValidChange();
    }
  }

  /**
   * React lifecycle handler called when component is about to be unmounted.
   */
  componentWillUnmount() {
    // Update the handlers with `isValid=undefined` to notify them that the component no longer is being validated
    this.onValidChange(undef, this.validates);
  }
}

Validate.defaultProps = {
  validate: () => {} // by default, no validation defined.
};

Validate.propTypes = {
  validate: func.isRequired // validation function
};

// Inherit all propTypes from Validate. In production propTypes are stripped
// so be sure to check for their existence before copying them over.
if (Validates.propTypes) {
  Object.keys(Validates.propTypes).forEach(k => (Validate.propTypes[k] = Validates.propTypes[k]));
}

Validate.childContextTypes = {
  onValidChange: func
};

