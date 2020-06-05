import { withConsumer, Context } from './context';
import Validates from './validates';
import Validate from './validate';

const ValidatesConsumer = withConsumer(Validates);
const ValidateConsumer = withConsumer(Validate);

export {
  ValidatesConsumer as Validates,
  ValidateConsumer as Validate,
  withConsumer,
  Context
};
