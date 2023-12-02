const { createErrorResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
const logger = require('./../../logger.js');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragmentID = req.params.id;
  logger.debug('WWE ARE IONSIDE GET_ID');
  logger.debug('params are: ' + req.params.id);
  try {
    let foundFragment = await Fragment.byId(req.user, fragmentID);

    let data = await foundFragment.getData();

    // Using writeHead since Express automatically adds UTF-8 to the content-type header
    res.writeHead(200, {
      'Content-Type': foundFragment.type,
      'Content-Length': foundFragment.size,
    });
    res.write(data.toString());
    res.end();

   logger.debug({ foundFragment }, `Got fragment from id ${fragmentID}`);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-cache');
    res
      .status(404)
      .json(
        createErrorResponse(404, `The requested fragment id does not exist. ID: ${fragmentID}`)
      );
  }
};
