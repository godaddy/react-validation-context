import assume from 'assume';
import sinon from 'sinon';
import React from 'react';

import { render, MockContext, testRendersAsChildren, testValidatesHandlers } from './utils';
import Validates from '../Validates';

describe('Validates', function ValidatesTests() {
  testRendersAsChildren(Validates);
  testValidatesHandlers(Validates);

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
  });
});

