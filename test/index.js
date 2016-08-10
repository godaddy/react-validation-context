import assume from 'assume';
import assumeSinon from 'assume-sinon';

assume.use(assumeSinon);


import { jsdom } from 'jsdom';

global.document = jsdom();
global.window = document.defaultView;


import './validates';
import './validate';

