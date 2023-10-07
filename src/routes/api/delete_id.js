const { createSuccessResponse, createErrorResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
const logger = require('./../../logger.js');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragmentID = req.params.id;

  try {
    await Fragment.delete(req.user, fragmentID);

    res.status(200).json(createSuccessResponse());
    logger.debug({ fragmentID }, `Deleted Fragment`);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-cache');
    res
      .status(404)
      .json(
        createErrorResponse(404, `The requested fragment id does not exist. ID: ${fragmentID}`)
      );

    logger.debug({ fragmentID }, `Unable to delete requested fragment id`);
  }
};
