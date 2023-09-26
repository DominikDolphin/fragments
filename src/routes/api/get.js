const { createSuccessResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
const logger = require('./../../logger.js');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // Get all fragments by user
  const toExpand = req.query.expand == 1;

  let fragmentsByUser = await Fragment.byUser(req.user, toExpand);

  res.status(200).json(
    createSuccessResponse({
      fragments: fragmentsByUser,
    })
  );

  logger.debug({ fragmentsByUser }, `Got fragments by user`);
};
