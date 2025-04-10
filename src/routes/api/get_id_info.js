const { createSuccessResponse, createErrorResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
const logger = require('./../../logger.js');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragmentID = req.params.id;

  try {
    let foundFragment = await Fragment.byId(req.user, fragmentID);

    res.status(200).json(
      createSuccessResponse({
        fragments: foundFragment,
      })
    );

    logger.debug({ foundFragment }, `Found fragments by ID info`);
  } catch (err) {
    res
      .status(404)
      .json(
        createErrorResponse(404, `The requested fragment id does not exist. ID: ${fragmentID}`)
      );

    logger.debug({ fragmentID }, `unable to find fragment`);
  }
};
