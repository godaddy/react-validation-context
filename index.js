const { withConsumer, Context } = require('./context');
const Validates = require('./validates');
const Validate = require('./validate');

module.exports = {
  Validates: withConsumer(Validates),
  Validate: withConsumer(Validate),
  withConsumer,
  Context
};
