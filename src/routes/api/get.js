const { createSuccessResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  
  // Get all fragments by user
  const toExpand = (req.query.expand == 1);
  res.status(200).json(
    createSuccessResponse({
      fragments: await Fragment.byUser(req.user, toExpand),
    })
  );
};
