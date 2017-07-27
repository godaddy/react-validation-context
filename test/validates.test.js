import assume from 'assume';
import sinon from 'sinon';
import assumeSinon from 'assume-sinon';
import React from 'react';

import {
  undef,
  render,
  MockContext,
  describeRenderAsChildren,
  describeValidatesHandlers,
  describeValidatesMountHandlers
} from './utils';
import Validates from '../validates';

assume.use(assumeSinon);

describe('Validates', function ValidatesTests() {
  describeRenderAsChildren(Validates);
  describeValidatesHandlers(Validates);
  describeValidatesMountHandlers(Validates);

  describe('#onValidChange()', function onValidChangeTests() {
    it('calls the handlers in props and context appropriately', function handlerTest(done) {
      const name = 'test';
      const propsSpy = sinon.spy();
      const ctxSpy = sinon.spy();

      function test(elem) {
        elem.onValidChange(true, true);
        assume(propsSpy).is.not.called();
        assume(ctxSpy).is.not.called();

        let isValid, wasValid;
        function call(nextValid) {
          wasValid = isValid;
          isValid = nextValid;
          elem.onValidChange(isValid, wasValid);
          assume(propsSpy).is.calledWithExactly(name, isValid, wasValid);
          assume(ctxSpy).is.calledWithExactly(name, isValid, wasValid);
        }

        [
          true,
          false,
          true,
          null,
          true
        ].forEach(call);

        done();
      }

      render(<MockContext onValidChange={ ctxSpy }>
        <Validates name={ name } onValidChange={ propsSpy } ref={ test } />
      </MockContext>);
    });

    it('does nothing if no handlers are present', function noHandlersTest(done) {
      function test(elem) {
        elem.onValidChange(true, false);
        done();
      }

      render(<Validates name='test' ref={ test } />);
    });

    it('does nothing if given identical validities', function noChangeTest(done) {
      const ctxSpy = sinon.spy();
      const propsSpy = sinon.spy();
      function test(elem) {
        [
          undef,
          null,
          false,
          true
        ].forEach(state => {
          elem.onValidChange(state, state);
          assume(ctxSpy).is.not.called();
          assume(propsSpy).is.not.called();
        });

        done();
      }

      render(<MockContext onValidChange={ ctxSpy }>
        <Validates name='test' onValidChange={ propsSpy } ref={ test } />
      </MockContext>);
    });

    it('calls the handlers twice appropriately if an old name is given', function newNameTest(done) {
      const name = 'test';
      const propsSpy = sinon.spy();
      const ctxSpy = sinon.spy();

      function test(elem) {
        elem.onValidChange(true, true);
        assume(propsSpy).is.not.called();
        assume(ctxSpy).is.not.called();
        propsSpy.reset();
        ctxSpy.reset();

        const oldName = 'old-name';
        elem.onValidChange(true, false, oldName);
        assume(propsSpy).is.called(2);
        assume(ctxSpy).is.called(2);
        [
          [oldName, undef, false],
          [name, true, false]
        ].forEach(args => {
          assume(propsSpy).is.calledWithExactly(...args);
          assume(ctxSpy).is.calledWithExactly(...args);
        });
        done();
      }

      render(<MockContext onValidChange={ ctxSpy }>
        <Validates name={ name } onValidChange={ propsSpy } ref={ test } />
      </MockContext>);
    });
  });
});

