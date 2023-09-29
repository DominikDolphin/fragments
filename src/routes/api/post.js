const { createSuccessResponse, createErrorResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
const logger = require('./../../logger.js');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // Get buffer size.

  try {
    // If the content-type is not supported, this handles it and prevents the app from crashing.
    if (Buffer.isBuffer(req.body) === false || req.body == {}) {
      logger.debug('POST did not send proper buffer. Content-type is not be supported.');
      return res.send(createErrorResponse(406, 'Content-type not supported.'));
    }

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
    res.setHeader(
      'Content-Location',
      `${process.env.API_URL || req.headers.host}/v1/fragments/${fragment.id}`
    );

    logger.debug({ fragment }, `Created new fragment`);

    return res.status(201).json(
      createSuccessResponse({
        fragment: fragment,
      })
    );
  } catch (err) {
    throw new Error('Error creating new fragment');
  }
};
