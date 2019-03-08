import assume from 'assume';
import sinon from 'sinon';
import assumeSinon from 'assume-sinon';
import React from 'react';

import {
  undef,
  render,
  describeRenderAsChildren,
  describeValidatesHandlers,
  describeValidatesMountHandlers
} from './utils';
import Validate from '../validate';
import Validates from '../validates';

assume.use(assumeSinon);

describe('Validate', function ValidatesTests() {
  describeRenderAsChildren(Validate);
  describeValidatesHandlers(Validate);
  describeValidatesMountHandlers(Validate);

  describe('validate handler', function validateHandlerTests() {
    it('defaults to not specifying a validity (i.e. returns `undefined`)', function defaultHandlerTest() {
      function test(elem) {
        const { validate } = elem.props;
        assume(validate()).equals(undef);
      }

      render(<Validate name='test' ref={ test } />);
    });

    it('calls the handler with a map from names to validity states', function handlerCallTest() {
      const validateSpy = sinon.spy();
      render(<Validate name='test' validate={ validateSpy }>
        <div>
          <Validates name='elem0' />
          <Validates name='elem1' validates={ true } />
          <Validates name='elem2' validates={ false } />
          <Validates name='elem3' validates={ null } />
        </div>
      </Validate>);

      assume(validateSpy).is.calledWithExactly({ elem1: true, elem2: false, elem3: null });
    });

    function testHandlerResult(props, check, done) {
      const name = 'test';
      class Fixture extends React.Component {
        constructor() {
          super();

          this.state = {};
        }

        render() {
          const { validate } = this.state;
          return <Validate name={ name } validate={ validate } { ...props } />;
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

          const validateSpy = sinon.spy(function validate() { return isValid; });
          elem.setState({ validate: validateSpy }, function next() {
            assume(validateSpy).is.called(1);
            setTimeout(() => { // Needed to allow state to flush
              check(name, isValid, wasValid);
            });
            call(i + 1);
          });
        }

        call(0);
      }

      render(<Fixture ref={ test } />);
    }

    it('uses the result of the handler as its validity', function handlerValidityTest(done) {
      const onValidChangeSpy = sinon.spy();

      function check(name, isValid, wasValid) {
        assume(onValidChangeSpy).is.calledWithExactly(name, isValid, wasValid);
      }

      testHandlerResult({ onValidChange: onValidChangeSpy }, check, done);
    });

    it('prefers props validates to the handler result', function propsOverrideTest(done) {
      const valids = [true, false, null];
      let i = 0;

      function next() {
        if (++i === valids.length) {
          return void done();
        }

        test(valids[i]);
      }

      function test(validates) {
        const onValidChangeSpy = sinon.spy();

        function check(name) {
          assume(onValidChangeSpy).is.calledWithExactly(name, validates, undef);
        }

        testHandlerResult({ onValidChange: onValidChangeSpy, validates }, check, next);
      }

      test(valids[i]);
    });

    it('calls the validate function with appropriate names if the child names change', function updatedNamesTest(done) {
      const validateSpy = sinon.spy();
      class Fixture extends React.Component {
        constructor() {
          super();

          this.state = {
            childName: 'test-child-name'
          };
        }

        render() {
          const { childName } = this.state;
          return <Validate name='test' validate={ validateSpy }>
            <Validates name={ childName } validates={ true } />
          </Validate>;
        }
      }

      function test(elem) {
        assume(validateSpy).is.calledWithExactly({ 'test-child-name': true });
        validateSpy.resetHistory();
        elem.setState({ childName: 'test-child-name-2' }, function next() {
          assume(validateSpy).is.calledWithExactly({ 'test-child-name-2': true });
          done();
        });
      }

      render(<Fixture ref={ test } />);
    });
  });
});

