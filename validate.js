import { func } from 'prop-types';
import Validates from './validates';

const undef = void 0;

export default class Validate extends Validates {
  constructor(props) {
    super(props);

    this.state = {
      validates: undef,
      valids: {}
    };
  }

  get validates() {
    // Prefer props over state.
    const { validates = this.state.validates } = this.props;
    return validates;
  }

  /**
   * Get the child context.
   *
   * @returns {Object} The child context.
   * @private
   */
  getChildContext() {
    return {
      /**
       * Child validity change handler.
       *
       * @param {String} name Identifier for the field whose validity changed
       * @param {Mixed} isValid Validity. `true`/`false` if the component is valid/invalid; `null` if validation is disabled, and
       * `undefined` if there is no validation for this name.
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
   * React lifecycle handler called immediately before the component's initial render.
   */
  componentWillMount() {
    // Update the handlers with the initial state
    this.onValidChange(this.validates);
  }

  /**
   * React lifecycle handler called when a component is receiving new props.
   *
   * @param {Object} nextProps Component's new props.
   */
  componentWillReceiveProps(nextProps) {
    const { validate } = nextProps;
    if (validate === this.props.validate) {
      return;
    }

    const { valids } = this.state;

    // Compute new validity, update state
    this.setState({ validates: validate(valids) });
  }

  /**
   * React lifecycle handler called when a component finished updating.
   *
   * @param {Object} prevProps Component's old props.
   * @param {Object} prevState Component's old state.
   */
  componentDidUpdate(prevProps, prevState) {
    const isValid = this.validates;

    // Prefer props over state.
    const { validates: wasValid = prevState.validates, name: oldName } = prevProps;
    this.onValidChange(isValid, wasValid, oldName);
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

