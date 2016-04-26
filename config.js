var environments = require('universal-redux/lib/hooks').environments;

module.exports = {
  environments: [
    environments.CLIENT,
    environments.DEVELOPMENT
  ]
};