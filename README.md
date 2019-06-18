# react-validation-context

There are several scenarios where a parent component's validation depends on
whether or not its descendant elements validate. By using the [React `context`
api][react-docs-context], manual crawling of the React render tree can be
avoided. Instead, a handler function in the context can be called to update the
parent's state whenever the descendant updates. This simplifies the
implementation of validation in the parent component.

## Install

This package is available on `npm`. Install it using:

```sh
npm install --save react-validation-context
```

## Usage

This library revolves around the idea of "validity". A component can have one of
the following validities:

- `@typedef {(undefined|null|Boolean)} Validity`
  - `undefined` - No validation state defined. This is the default.
  - `null` - Validation is disabled.
  - `true` - Validation passed.
  - `false` - Validation failed.

It is useful to know when a component's validity changes. As such, this library
attempts to provide a uniform API for validation change handlers. In general, a
validity change handler has the following API:

- `{Function} onValidChange` - Validity change handler.
  - `@param {String} name` - The unique identifier for the component whose
    validity changed.
  - `@param {Validity} isValid` - The current validity of the component.
  - `@param {Validity} wasValid` - The previous validity of the component.

The `name` identifier is also key to this library. It allows a collection of
descendants to be validated by a parent component. Essentially, this library
provides a way of tracking the validities of these various names. Note that this
is **not** the same as tracking the validities of the components themselves,
since a component's name may change as well!

## `Validates`

The `Validates` component is used to wrap a component that can be validated,
providing the logic for validation change handlers.

### Props

- `{String} name` - A unique identifier for the component. Required.
- `{Validity} validates` - The component's validity.
- `{Function} onValidChange` - Validity change handler.
- `{ReactElement} children` - Children. The component only accepts a single
  child, and will simply render as that child.

#### When is the `onValidChange` handler called?

The function passed as the `onValidChange` prop will be called when:

- The component mounts and the `validates` prop is not `undefined`
- The component unmounts and the `validates` prop is not `undefined`
- The component's `validates` prop changes

During these cases, the `onValidChange` handler is called with:

- The component's `name` prop
- The component's validity
- The component's previous validity

However, if the component's `name` changes and the `validates` prop is not
`undefined`, then the `onValidChange` handler will first be called with:

- The previous `name` prop
- `undefined`, to indicate that the previous `name` no longer has validation defined
- The component's previous validity, if applicable

Then, if the `validates` prop has changed, the `onValidChange` handler is called
**a second time**.

### Context

If `onValidChange` is present in `Validate`'s context, it will call that context
handler whenever the `onValidChange` handler in the props would be called, as
described above.

### Example usage

```jsx
import React from 'react';
import { string, func } from 'prop-types';
import { Validates } from 'react-validation-context';

/**
 * An input that only validates when its value is non-empty and non-whitespace.
 */
export default class RequiredInput extends React.Component {
  constructor(props) {
    super();

    // Set up the initial state based on whether the initial value validates
    const { value, defaultValue } = props;
    const validates = this.validate(value || defaultValue);
    this.state = { validates };

    this.onChange = this.onChange.bind(this);
  }

  // Check that the value exists and is non-whitespace
  validate(value) {
    return value && value.trim().length > 0;
  }

  // Wrap the onChange handler to update `this.state.validates`
  onChange(e) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }

    const validates = this.validate(e.target.value);
    this.setState({ validates });
  }

  render() {
    const { onChange } = this;
    const { onValidChange, name, ...inputProps } = this.props;
    const { validates } = this.state;

    // Set up `input` props
    Object.assign(inputProps, { onChange, name });

    // Render `input` and validation context-aware `Validates`
    return <Validates validates={ validates } onValidChange={ onValidChange } name={ name }>
      <input type='text' { ...inputProps } />
    </Validates>;
  }
}

RequiredInput.propTypes = {
  name: string.isRequired, // Input identifier name
  value: string, // Input value
  defaultValue: string, // Default input value
  onChange: func, // onChange handler for input
  onValidChange: func // validity change handler
};
```

## `Validate`

The `Validate` component is used to wrap a component which has descendants that
may be validated, and provides an interface for validating all of those
descendants. It extends `Validates` to provide the same interface for listening
for validation changes on the component itself.

**NOTE**: This component is able to keep track of all conforming descendant
components (not just direct children) via the [React `context` api][react-docs-context].

### Props

- `{Function} validate` - Validation function for descendants.
  - `@param {Object} valids` - The keys are the descendant `name`s, and the
    values are their `{Validity}`s.
  - `@returns {Validity}` - The validity of this component.

This component also inherits all the props of `Validate`.

#### When is the `validate` function called?

The function passed as the `validate` prop will be called whenever the component
must validate its descendants. This can occur when the component first mounts,
or when at least one of its descendants has changed its name **or** validity.

Whenever the `validate` function is called, it is given a single argument: an
`Object` whose keys are the `name`s of the descendant components, and whose
values are their validities. The `validate` function should then return the
validity of the component.

### Context

If `onValidChange` is present in `Validate`'s context, it will call that context
handler appropriately.

### Example usage

```jsx
import React from 'react';
import { string, func, node } from 'prop-types';
import { Validate } from 'react-validation-context';

import styles from './form.less';

export default class Form extends React.Component {
  constructor() {
    super();

    // The form is initially valid
    this.state = { validates: true };

    this.onValidChange = this.onValidChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // Wrap the onValidChange handler to set this.state.validates
  onValidChange(name, isValid, wasValid) {
    const { onValidChange } = this.props;
    if (onValidChange) {
      onValidChange(name, isValid, wasValid);
    }

    this.setState({ validates: isValid });
  }

  // Wrap the onSubmit handler to prevent submission if the form is invalid
  onSubmit(e) {
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(e);
    }

    if (!this.state.validates) {
      e.preventDefault();
    }
  }

  // The form is invalid if there are any invalid items in its validation context
  validate(valids) {
    return Object.keys(valids).every(k => valids[k] !== false);
  }

  render() {
    const { onSubmit, onValidChange, validate } = this;
    const { children, name, ...formProps } = this.props;
    delete formProps.onValidChange; // avoid passing down `onValidChange` from props

    // Set up `form` props
    Object.assign(formProps, { onSubmit, name });

    // Render `form` and create validation context `Validate` (which is also validation context-aware)
    return <Validate validate={ validate } onValidChange={ onValidChange } name={ name }>
      <form { ...formProps }>
        {children}
      </form>
    </Validate>;
  }
}

Form.propTypes = {
  name: string.isRequired, // Form identifier name
  onSubmit: func, // onSubmit handler for form
  onValidChange: func, // validity change handler
  children: node // React children
};
```

## Demo

For a more in-depth demonstration, see the example project under `demo/`.

## License

[MIT](LICENSE)

[react-docs-context]: https://facebook.github.io/react/docs/context.html (React context API docs)
