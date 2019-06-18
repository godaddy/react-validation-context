const { Validates, Context, withConsumer, Validate } = require('../index');
const { shallow, mount } = require('enzyme');
const { describe, it } = require('mocha');
const assume = require('assume');
const React = require('react');

describe('React Validation Context', function () {
  it('exposes all API methods', function () {
    assume(Validate).exists();
    assume(Validates).exists();
    assume(Context).is.a('object');
    assume(Context.Consumer).exists();
    assume(Context.Provider).exists();
    assume(withConsumer).is.a('function');
  });

  describe('#validates', function () {
    let wrapper;

    function create(props = {}, child) {
      const context = shallow((
        <Validates { ...props }>
          { child && child }
        </Validates>
      ), {
        lifecycleExperimental: true
      });

      wrapper = context.dive();
    }

    it('returns the children', function () {
      create({ name: 'example' }, (<h1>Im an example</h1>));

      assume(wrapper.html()).equals('<h1>Im an example</h1>');
    });

    it('works without childen', function () {
      create({ name: 'example' });

      assume(wrapper.html()).equals('');
    });

    it('calls the `onValidChange` method on validates change', function (next) {
      const states = [
        { name: 'child', valid: false, was: undefined },
        { name: 'child', valid: true, was: false }
      ];

      function change(name, valid, was) {
        const expect = states.shift();
        assume({ name, valid, was }).deep.equals(expect);

        if (!states.length) return next();
      }

      const enzyme = mount(<Validates name='child' validates={ false } onValidChange={ change } />, {
        wrappedWith(root) {
          return (
            <Validate name='example'>
              { root }
            </Validate>
          );
        }
      });

      enzyme.setProps({ validates: true });
    });

    it('calls the `onValidChange` method on name change', function (next) {
      const states = [
        { name: 'child', valid: false, was: undefined },
        { name: 'child', valid: undefined, was: false },
        { name: 'renamed', valid: true, was: false }
      ];

      function change(name, valid, was) {
        const expect = states.shift();
        const actual = { name, valid, was };

        assume(actual).deep.equals(expect);
        if (!states.length) return next();
      }

      const enzyme = mount(<Validates name='child' validates={ false } onValidChange={ change } />, {
        wrappedWith(root) {
          return (
            <Validate name='example'>
              { root }
            </Validate>
          );
        }
      });

      enzyme.setProps({ name: 'renamed', validates: true });
    });

    it('sets validates as undefined on unmount', function (next) {
      const states = [
        { name: 'child', valid: false, was: undefined },
        { name: 'child', valid: undefined, was: false }
      ];

      function change(name, valid, was) {
        const expect = states.shift();
        const actual = { name, valid, was };

        assume(actual).deep.equals(expect);
        if (!states.length) return next();
      }

      const enzyme = mount(<Validates name='child' validates={ false } onValidChange={ change } />, {
        wrappedWith(root) {
          return (
            <Validate name='example'>
              { root }
            </Validate>
          );
        }
      });

      enzyme.unmount();
    });
  });

  describe('#validate', function () {
    let wrapper;
    let instance;

    function create(props = {}, child) {
      const context = shallow((
        <Validate { ...props }>
          { child && child }
        </Validate>
      ), {
        lifecycleExperimental: true
      });

      //
      // We need "unpeel" the HOC layers to actually access the right component.
      //
      wrapper = context.dive().dive().dive();
      instance = wrapper.instance();
    }

    it('returns the children', function () {
      create({ name: 'example' }, (<h1>Im an example</h1>));

      assume(wrapper.html()).equals('<h1>Im an example</h1>');
    });

    it('works without childen', function () {
      create({ name: 'example' });

      assume(wrapper.html()).equals('');
    });

    it('returns undefined when when no `validates` is provided', function () {
      create({ name: 'example ' });

      const result = instance.props.validate();
      assume(result).is.a('undefined');
    });

    it('calls the `validate` with a map from names to validity states', function (next) {
      const states = [
        { elem1: true },
        { elem1: true, elem2: false },
        { elem1: true, elem2: false, elem3: null }
      ];

      function validate(validation) {
        const expect = states.shift();
        assume(validation).deep.equals(expect);

        if (!states.length) return next();
      }

      mount(
        <Validate name='example' validate={ validate }>
          <Validates name='elem0' />
          <Validates name='elem1' validates={ true } />
          <Validates name='elem2' validates={ false } />
          <Validates name='elem3' validates={ null } />
        </Validate>
      );
    });

    it('trigger validate on unmount', function (next) {
      const states = [
        { child: false },
        { }
      ];

      function validate(actual) {
        const expect = states.shift();

        assume(actual).deep.equals(expect);
        if (!states.length) return next();
      }

      const enzyme = mount(
        <Validate name='example' validate={ validate }>
          <Validates name='child' validates={ false } />
        </Validate>
      );

      enzyme.unmount();
    });

    it('triggers onValidChange on unmount', function (next) {
      const states = [
        { name: 'example', valid: false, was: undefined },
        { name: 'example', valid: undefined, was: false }
      ];

      function change(name, valid, was) {
        const expect = states.shift();
        const actual = { name, valid, was };

        assume(actual).deep.equals(expect);
        if (!states.length) return next();
      }

      function validate(valids) {
        return Object.keys(valids).every(k => valids[k] !== false);
      }

      const enzyme = mount(
        <Validate name='example' onValidChange={ change } validate={ validate }>
          <Validates name='child' validates={ false } />
        </Validate>
      );

      enzyme.unmount();
    });
  });
});
