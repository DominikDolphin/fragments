const { createSuccessResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
/**
 * Get a list of fragments for the current user
 */
module.exports = async(req, res) => {

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
  res.status(201).json(fragment);
};
