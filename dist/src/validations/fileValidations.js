import { EXCEEDS_MAX_FILE_SIZE, INVALID_FILE_TYPE, FILE_TOO_SMALL } from '../constants/appMessages';
const FILE_CONSTRAINTS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    MIN_FILE_SIZE: 1024,
    MAX_FILENAME_LENGTH: 255,
    ALLOWED_IMAGE_TYPES: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
    ],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
};
export async function validateUploadData({ filename, contentType, size }) {
    if (!filename || !contentType || typeof size !== 'number') {
        throw new Error('Invalid request. Required: filename, contentType, size (number)');
    }
    // Validate filename length
    if (filename.length > FILE_CONSTRAINTS.MAX_FILENAME_LENGTH) {
        throw new Error(`Filename too long. Maximum ${FILE_CONSTRAINTS.MAX_FILENAME_LENGTH} characters allowed`);
    }
    // Validate file extension
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    if (!FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
        throw new Error(`Invalid file extension. Allowed: ${FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`);
    }
    // Validate content type
    if (!FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(contentType)) {
        throw new Error(INVALID_FILE_TYPE);
    }
    if (size > FILE_CONSTRAINTS.MAX_FILE_SIZE) {
        throw new Error(EXCEEDS_MAX_FILE_SIZE);
    }
    if (size < FILE_CONSTRAINTS.MIN_FILE_SIZE) {
        throw new Error(FILE_TOO_SMALL);
    }
}
