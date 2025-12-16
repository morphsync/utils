/**
 * @package @morphsync/utils                           // Public package identifier for Morphsync utility helpers
 * @description                                        // High-level package description
 * Professional utility functions for Morphsync         // Indicates production-grade reusable utilities
 * backend and service-layer applications.              // Clarifies intended usage scope
 *
 * @version 1.1.3                                      // Current package version
 * @author Jay Chauhan                                 // Package author
 * @license MIT                                        // Open-source license declaration
 */

const crypto = require('crypto');                      // Node.js built-in cryptography module for secure operations
const { decode } = require('html-entities');           // Library function to decode HTML entities into plain text

/**
 * Encodes a string into Base64 format.
 * Used for safe transport, encoding, and obfuscation.
 *
 * @param {string} data                                 // Raw input string to encode
 * @returns {string}                                   // Base64 encoded output
 */
const base64Encode = (data) => {                        // Defines Base64 encoding utility function
    return Buffer.from(data).toString('base64');        // Converts string to buffer and encodes to Base64
};

/**
 * Decodes a Base64 encoded string back to UTF-8.
 *
 * @param {string} data                                 // Base64 encoded input string
 * @returns {string}                                   // Decoded UTF-8 string
 */
const base64Decode = (data) => {                        // Defines Base64 decoding utility function
    return Buffer.from(data, 'base64').toString('utf8');// Decodes Base64 buffer back to readable string
};

/**
 * Converts formatted text into clean plain text.
 * Removes markdown formatting and decodes HTML entities.
 *
 * @param {string} formattedText                        // Text containing markdown or HTML entities
 * @returns {string}                                   // Clean plain-text output
 */
const convertToPlainText = (formattedText) => {         // Defines text normalization utility
    let text = decode(formattedText);                   // Decodes HTML entities into readable characters
    text = text.replace(/\*([^*]+)\*/g, '$1')           // Removes asterisk-based markdown formatting
               .replace(/_([^_]+)_/g, '$1');             // Removes underscore-based markdown formatting
    text = text.replace(/\n+/g, ' ');                   // Replaces multiple line breaks with a single space
    return text.trim();                                 // Trims leading and trailing whitespace
};

/**
 * Pads a number or string on the left side to a fixed length.
 *
 * @param {number|string} num                            // Value to be padded
 * @param {number} length                                // Desired total string length
 * @param {string} char                                  // Character used for padding
 * @returns {string}                                     // Left-padded string result
 */
const stringPad = (num, length, char) => {               // Defines string padding utility
    return String(num).padStart(length, char);           // Converts input to string and applies left padding
};

/**
 * Safely serializes any error or object into a JSON-safe structure.
 * Prevents crashes during logging or API responses.
 *
 * @param {*} error                                      // Any error, object, or primitive value
 * @returns {Object}                                     // Serializable object representation
 */
const serializeObject = (error) => {                     // Defines safe serialization helper
    if (error instanceof Error) {                        // Checks if input is a native Error object
        return {                                         // Returns structured error object
            name: error.name,                            // Error class name
            message: error.message,                      // Error message description
            stack: error.stack,                          // Stack trace for debugging
            ...error                                     // Spreads additional enumerable properties
        };
    }
    if (typeof error === "object" && error !== null) {   // Handles generic non-null objects
        return error;                                    // Returns object as-is
    }
    return {                                             // Handles primitive values safely
        message: String(error)                           // Converts value to string message
    };
};

/**
 * Generates a SHA-1 hash for the given input string.
 *
 * @param {string} data                                  // Input string to hash
 * @returns {string}                                     // SHA-1 hash in hexadecimal format
 */
const sha1 = (data) => {                                 // Defines SHA-1 hashing utility
    return crypto.createHash('sha1')                     // Creates SHA-1 hash instance
        .update(data, 'utf8')                            // Updates hash with UTF-8 encoded data
        .digest('hex');                                  // Outputs hash as hexadecimal string
};

/**
 * Generates a cryptographically secure numeric OTP.
 *
 * @param {number} [length=6]                             // Length of OTP (default: 6 digits)
 * @returns {string}                                     // Generated OTP as a string
 */
const generateOtp = (length = 6) => {                    // Defines OTP generation utility
    const digits = '0123456789';                         // Allowed characters for OTP
    let otp = '';                                        // Initializes OTP accumulator
    for (let i = 0; i < length; i++) {                   // Iterates for desired OTP length
        const randomIndex = crypto.randomInt(0, digits.length); // Secure random index generation
        otp += digits[randomIndex];                      // Appends random digit to OTP
    }
    return otp;                                          // Returns generated OTP
};

/**
 * Formats a date into a specified string format.
 *
 * @param {string} [format='YYYY-MM-DD HH:mm:ss']        // Desired output format
 * @param {string|Date} [dateInput=null]                 // Date to format (null = current date)
 * @returns {string}                                     // Formatted date string
 */
const date = (format = 'YYYY-MM-DD HH:mm:ss', dateInput = null) => {
    const now = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(now.getTime())) throw new Error('Invalid date input');

    const monthNamesFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNamesShort = monthNamesFull.map(name => name.slice(0, 3));
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = String(now.getDate()).padStart(2, '0');
    const hours24 = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const hours12 = hours24 % 12 || 12;
    const ampm = hours24 >= 12 ? 'PM' : 'AM';

    const formatMap = {
        'YYYY': year, 'YY': String(year).slice(-2), 'MMMM': monthNamesFull[month], 'MMM': monthNamesShort[month],
        'MM': String(month + 1).padStart(2, '0'), 'M': month + 1, 'DD': day,
        'HH': String(hours24).padStart(2, '0'), 'hh': String(hours12).padStart(2, '0'),
        'mm': minutes, 'ss': seconds, 'A': ampm
    };

    let formattedDate = format;
    for (const [placeholder, value] of Object.entries(formatMap)) {
        formattedDate = formattedDate.replace(new RegExp(placeholder, 'g'), value);
    }
    return formattedDate;
};

/**
 * Adds or subtracts time units to/from a date.
 *
 * @param {string|Date} [dateInput=null]                 // Date to modify (null = current date)
 * @param {number} value                                  // Amount to add (positive) or subtract (negative)
 * @param {string} [unit='days']                          // Unit: 'years', 'months', 'days', 'hours', 'minutes', 'seconds'
 * @returns {Date}                                        // Modified date object
 */
const addDate = (dateInput = null, value, unit = 'days') => {
    const date = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(date.getTime())) throw new Error('Invalid date input');

    switch (unit.toLowerCase()) {
        case 'years': date.setFullYear(date.getFullYear() + value); break;
        case 'months': date.setMonth(date.getMonth() + value); break;
        case 'days': date.setDate(date.getDate() + value); break;
        case 'hours': date.setHours(date.getHours() + value); break;
        case 'minutes': date.setMinutes(date.getMinutes() + value); break;
        case 'seconds': date.setSeconds(date.getSeconds() + value); break;
        default: throw new Error(`Unsupported unit: ${unit}`);
    }
    return date;
};

module.exports = {                                      // Exposes public utilities for package consumers
    base64Encode,                                       // Base64 encoding helper
    base64Decode,                                       // Base64 decoding helper
    convertToPlainText,                                 // Text normalization helper
    stringPad,                                          // String padding helper
    serializeObject,                                    // Safe serialization helper
    sha1,                                                // SHA-1 hashing helper
    generateOtp,                                        // OTP generation helper
    date,                                               // Date formatting helper
    addDate                                             // Date manipulation helper
};
