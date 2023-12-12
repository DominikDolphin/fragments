// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB

const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    // Validate Data
    if (type == undefined) {
      throw new Error('Type for fragment is required');
    }
    if (ownerId == undefined) {
      throw new Error('OwnerID for fragment is required');
    }
    if (typeof size !== 'number') {
      throw new Error('Size must be a number');
    }
    if (size < 0) {
      throw new Error('Size must be greater than 0');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error('Not a supported type');
    }

    // Set Data
    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = new Date(created || Date.now()).toISOString();
    this.updated = new Date(updated || Date.now()).toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    let frag = await readFragment(ownerId, id);
    if (!frag) {
      throw new Error('Fragment does not exist');
    }

    if (!(frag instanceof Fragment)) {
      let fragInstance = new Fragment({
        id: frag.id,
        ownerId: frag.ownerId,
        type: frag.type,
        size: frag.size,
        created: frag.created,
        updated: frag.updated,
      });

      return fragInstance;
    }

    return frag;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!data) {
      throw new Error('SetData requires a buffer');
    }

    this.size = data.length;
    this.updated = new Date().toISOString();

    try {
      return await writeFragmentData(this.ownerId, this.id, data);
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        console.error(
          'The requested resource could not be found. Please check if the resource exists and if you have the necessary permissions to access it.'
        );
        // handle error
      } else {
        throw error;
      }
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const mimeType = this.mimeType;
    return mimeType.startsWith('text/');
  }

  /**
   * Returns true if this fragment is a image/* mime type
   * @returns {boolean} true if fragment's type is image/*
   */
  get isImage() {
    const mimeType = this.mimeType;
    return mimeType.startsWith('image/');
  }

  /**
   * Returns true if this fragment is an application/* mime type
   * @returns {boolean} true if fragment's type is image/*
   */
  get isApplication() {
    const mimeType = this.mimeType;
    return mimeType.startsWith('application/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    switch (this.mimeType) {
      case 'text/plain':
        return ['text/plain'];
      case 'text/markdown':
        return ['text/markdown', 'text/html', 'text/plain'];
      case 'text/html':
        return ['text/html', 'text/plain'];
      case 'application/json':
        return ['application/json', 'text/plain'];
      case 'image/png':
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
      case 'image/jpeg':
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
      case 'image/webp':
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
      case 'image/gif':
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
      default:
        return [];
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const { type } = contentType.parse(value);

    const validContentType = [
      'text/plain',
      'text/markdown',
      'text/html',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ];

    return validContentType.includes(type);
  }
}

module.exports.Fragment = Fragment;
