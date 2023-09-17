const { createSuccessResponse, createErrorResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // Get all fragments by user
  const fragmentID = req.params.id;

  try {
    let foundFragment = await Fragment.byId(req.user, fragmentID);

    res.status(200).json(
      createSuccessResponse({
        fragments: foundFragment,
      })
    );
  } catch (err) {
    res.setHeader('Cache-Control', 'no-cache');
    res
      .status(404)
      .json(createErrorResponse(`The requested fragment id does not exist. ID: ${fragmentID}`));
  }
};
