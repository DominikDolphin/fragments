const { createSuccessResponse } = require('../../response.js');
const { Fragment } = require('../../model/fragment.js');
/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // Get buffer size.
  let bufferSize = Buffer.from(req.body).length;

  // Create the fragment
  let newFragment = new Fragment({
    ownerId: req.user,
    type: req.headers['content-type'],
    size: bufferSize,
  });

  //Save the fragment
  //TODO
  // newFragment.save();

  //Respond with the fragment.
  res.status(201).json(newFragment);
};
