import assume from 'assume';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

export function shallowRender(elem) {
  const renderer = ReactTestUtils.createRenderer();
  renderer.render(elem);
  return { renderer, output: renderer.getRenderOutput() };
}

export function render(elem) {
  const tree = document.createElement('div');
  return { tree, output: ReactDOM.render(elem, tree) };
}

export class MockContext extends React.Component {
  getChildContext() {
    return { onValidChange: this.props.onValidChange };
  }

  render() {
    return this.props.children || null;
  }
}

MockContext.propTypes = { onValidChange: React.PropTypes.func, children: React.PropTypes.element };
MockContext.childContextTypes = { onValidChange: React.PropTypes.func };

export function testRendersAsChildren(Component) {
  describe('#render()', function renderTests() {
    it('renders as its child', function renderAsChildTest() {
      const children = <span>this is a test</span>;
      const { output } = shallowRender(<Component name='test'>{ children }</Component>);
      assume(output).equals(children);
    });

    it('renders nothing if it does not have children', function renderNothingTest() {
      const { output } = shallowRender(<Component name='test' />);
      assume(output).equals(null);
    });
  });
}

export function testValidatesHandlers(Component) {
  describe('validates handlers', function validatesHandlersTests() {
    it('calls handlers in props and context with the initial state and undefined', function initialTest() {
      const name = 'test';
      const propsSpy = sinon.spy();
      const ctxSpy = sinon.spy();

      function test(validates) {
        render(<MockContext onValidChange={ ctxSpy }>
          <Component name={ name } onValidChange={ propsSpy } validates={ validates } />
        </MockContext>);

        let undef;
        assume(propsSpy).is.calledWithExactly(name, validates, undef);
        assume(ctxSpy).is.calledWithExactly(name, validates, undef);
      }

      [true, false, null].forEach(test);
    });

    it('calls handlers in props and context whenever the `validates` prop changes', function updateTest(done) {
      const name = 'test';
      const propsSpy = sinon.spy();
      const ctxSpy = sinon.spy();

      class Fixture extends React.Component {
        constructor () {
          super();

          this.state = {};
        }

        render () {
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
          true
        ];

        let isValid, wasValid;

        function call(i) {
          if (i === valids.length) {
            return void done();
          }

          wasValid = isValid;
          isValid = valids[i];
          elem.setState({ validates: isValid }, function check() {
            assume(propsSpy).is.calledWithExactly(name, isValid, wasValid);
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

