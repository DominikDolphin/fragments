const { Fragment } = require('../../model/fragment.js');
const logger = require('../../logger.js');
var md = require('markdown-it')();
const sharp = require('sharp');
const removeMarkdown = require('remove-markdown');

// const removeMarkdown = require('markdown-to-text');
// var result = md.render('# markdown-it rulezz!');

module.exports = async (req, res) => {
  const fragmentID = req.params.id;
  const param_extention = req.params.ext;

  try {
    // Get the fragment by ID
    let foundFragment = await Fragment.byId(req.user, fragmentID);

    // Check the param extention and get the corresponding content-type.
    let extensionToConvertTo;
    switch (param_extention) {
      case 'md':
        extensionToConvertTo = 'text/markdown';
        break;
      case 'html':
        extensionToConvertTo = 'text/html';
        break;
      case 'txt':
        extensionToConvertTo = 'text/plain';
        break;
      case 'png':
        extensionToConvertTo = 'image/png';
        break;
      case 'jpg':
        extensionToConvertTo = 'image/jpeg';
        break;
    }

    // If the fragment's format is not compatible with the requested format, return 415.
    if (!foundFragment.formats.includes(extensionToConvertTo)) {
      throw new Error(
        `The fragment's format (${foundFragment.type}) cannot be converted to ${param_extention}`
      );
    }

    // Get the data from the fragment.
    let data = await foundFragment.getData();

    // Data that will be returned to the client.
    let convertedData;

    // Based on the requested format, convert the data.
    switch (extensionToConvertTo) {
      case 'text/html':
        convertedData = md.render(data.toString(), {});
        break;
      case 'image/png':
        // use sharp to convert to png
        try {
          convertedData = await sharp(data).png().toBuffer();
        } catch (err) {
          logger.error(err);
          throw new Error(`Error converting to png`);
        }
        break;

      case 'text/plain':
        if (foundFragment.type == 'text/markdown') {
          convertedData = removeMarkdown(data.toString());
        } else {
          convertedData = data.toString();
        }

        break;
      default:
        convertedData = data.toString();
    }

    // return the converted data.
    res.status(200).json(convertedData);
    logger.debug(
      { convertedData },
      `Converted data from type ${foundFragment.type} to ${param_extention}`
    );
  } catch (err) {
    res.setHeader('Cache-Control', 'no-cache');
    res.status(415).json({
      error: err.message,
    });
  }
};
