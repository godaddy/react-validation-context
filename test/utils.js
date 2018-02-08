import assume from 'assume';
import sinon from 'sinon';
import React from 'react';
import { func, element } from 'prop-types';
import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';

const undef = void 0;

export { undef };

export function shallowRender(elem) {
  const renderer = new ShallowRenderer();
  renderer.render(elem);
  return renderer.getRenderOutput();
}

export function render(elem) {
  return TestRenderer.create(elem);
}

export class MockContext extends React.Component {
  getChildContext() {
    return { onValidChange: this.props.onValidChange };
  }

  render() {
    return this.props.children || null;
  }
}

MockContext.propTypes = {
  onValidChange: func,
  children: element
};

MockContext.childContextTypes = {
  onValidChange: func
};

export function describeRenderAsChildren(Component) {
  describe('#render()', function renderTests() {
    it('renders as its child', function renderAsChildTest() {
      const children = <span>this is a test</span>;
      const output = shallowRender(<Component name='test'>{ children }</Component>);
      assume(output).equals(children);
    });

    it('renders nothing if it does not have children', function renderNothingTest() {
      const output = shallowRender(<Component name='test' />);
      assume(output).equals(null);
    });
  });
}

export function describeValidatesHandlers(Component) {
  describe('validates handlers', function validatesHandlersTests() {
    it('calls handlers in props and context with the initial state and undefined', function initialTest() {
      const name = 'test';
      const propsSpy = sinon.spy();
      const ctxSpy = sinon.spy();

      function test(validates) {
        propsSpy.resetHistory();
        ctxSpy.resetHistory();
        render(<MockContext onValidChange={ ctxSpy }>
          <Component name={ name } onValidChange={ propsSpy } validates={ validates } />
        </MockContext>);

        assume(propsSpy).is.called(1);
        assume(propsSpy).is.calledWithExactly(name, validates, undef);
        assume(ctxSpy).is.called(1);
        assume(ctxSpy).is.calledWithExactly(name, validates, undef);
      }

      [true, false, null].forEach(test);
    });

    it('calls handlers in props and context whenever the `validates` prop changes', function updateTest(done) {
      const name = 'test';
      const propsSpy = sinon.spy();
      const ctxSpy = sinon.spy();

      class Fixture extends React.Component {
        constructor() {
          super();

          this.state = {};
        }

        render() {
          const { validates } = this.state;

          return <MockContext onValidChange={ ctxSpy }>
            <Component name={ name } onValidChange={ propsSpy } validates={ validates } />
          </MockContext>;
        }
      }

      function test(elem) {
        const valids = [
          true,
          false,
          true,
          null,
          true,
          undef,
          true,
          false,
          undef,
          false,
          null,
          undef,
          null
        ];

        let isValid, wasValid;

        function call(i) {
          if (i === valids.length) {
            return void done();
          }

          wasValid = isValid;
          isValid = valids[i];
          propsSpy.resetHistory();
          ctxSpy.resetHistory();
          elem.setState({ validates: isValid }, function check() {
            assume(propsSpy).is.called(1);
            assume(propsSpy).is.calledWithExactly(name, isValid, wasValid);
            assume(ctxSpy).is.called(1);
            assume(ctxSpy).is.calledWithExactly(name, isValid, wasValid);
            call(i + 1);
          });
        }

        call(0);
      }

      render(<Fixture ref={ test } />);
    });
  });
}

export function describeValidatesMountHandlers(Component) {
  describe('mount/unmount', function unmountTests() {
    it('calls the context and props handlers at mount and unmount appropriately', function handlerTest(done) {
      const name = 'test';
      const validates = true;
      const propsSpy = sinon.spy();
      const ctxSpy = sinon.spy();

      class Fixture extends React.Component {
        constructor() {
          super();
          this.state = { shouldMount: false };
        }

        render() {
          const { shouldMount } = this.state;

          const child = shouldMount
            ? <Component name={ name } onValidChange={ propsSpy } validates={ validates } />
            : null;
          return <MockContext onValidChange={ ctxSpy }>
            {child}
          </MockContext>;
        }
      }

      function test(elem) {
        function didUnmount() {
          assume(propsSpy).is.called(1);
          assume(propsSpy).is.calledWithExactly(name, undef, validates);
          assume(ctxSpy).is.called(1);
          assume(ctxSpy).is.calledWithExactly(name, undef, validates);
          done();
        }

        function didMount() {
          assume(propsSpy).is.called(1);
          assume(propsSpy).is.calledWithExactly(name, validates, undef);
          assume(ctxSpy).is.called(1);
          assume(ctxSpy).is.calledWithExactly(name, validates, undef);
          propsSpy.resetHistory();
          ctxSpy.resetHistory();
          elem.setState({ shouldMount: false }, didUnmount);
        }

        assume(propsSpy).is.not.called();
        assume(ctxSpy).is.not.called();
        elem.setState({ shouldMount: true }, didMount);
      }

      render(<Fixture ref={ test } />);
    });
  });
}

