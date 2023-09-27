const { createSuccessResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
const logger = require('./../../logger.js');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // Get buffer size.
  let buffer = Buffer.from(req.body);
  let bufferSize = buffer.length;

  // Create the fragment
  const fragment = new Fragment({
    ownerId: req.user,
    type: req.headers['content-type'],
    size: bufferSize,
  });

  await fragment.save();
  await fragment.setData(buffer);

  //Respond with the fragment.
  res.setHeader('Content-Location', `${req.headers.host}/v1/fragments/${fragment.id}`);
  res.status(201).json(
    createSuccessResponse({
      fragment: fragment,
    })
  );

  logger.debug({ fragment }, `Created new fragment`);
};
