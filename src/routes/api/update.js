const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  let fragmentByUser;
  try {
    fragmentByUser = await Fragment.byId(req.user, req.params.id);
  } catch (err) {
    logger.debug(err);
    return res.status(404).json(createErrorResponse(404, 'No fragment found with that id!'));
  }

  try {
    if (Buffer.isBuffer(req.body) === false || req.body == {}) {
      logger.debug('POST did not send proper buffer. Content-type is not be supported.');
      return res.send(createErrorResponse(415, 'Content-type not supported.'));
    }

    if (req.headers['content-type'] != fragmentByUser.type) {
      throw new Error(
        `Content type: ${req.headers['content-type']} must be the same as the fragment's content type: ${fragmentByUser.type}`
      );
    }

    const buff = Buffer.from(req.body);
    const buffSize = buff.length;
    fragmentByUser.size = buffSize;

    await fragmentByUser.save();
    await fragmentByUser.setData(buff);

    logger.info(`Fragment has been updated with id: ${fragmentByUser.id}`);
    return res.status(200).json(createSuccessResponse({ fragment: fragmentByUser }));
  } catch (err) {
    logger.debug(err);
    return res.status(400).json(createErrorResponse(400, err.message));
  }
};
