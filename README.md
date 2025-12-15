# @morphsync/utils

> Utility functions for Morphsync applications including encoding, hashing, OTP generation, and serialization.

[![npm version](https://img.shields.io/npm/v/@morphsync/utils.svg)](https://www.npmjs.com/package/@morphsync/utils)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Features

- 🔐 SHA-1 hashing for passwords and tokens
- 🔢 Cryptographically secure OTP generation
- 📝 Base64 encoding and decoding
- 🧹 HTML entity decoding and text normalization
- 📏 String padding utilities
- 📦 Safe error serialization for logging
- ⚡ Zero configuration required
- 🎯 TypeScript-friendly

## Installation

```bash
npm install @morphsync/utils
```

## Quick Start

```javascript
const { sha1, generateOtp, base64Encode, serializeObject } = require('@morphsync/utils');

// Hash password
const hash = sha1('myPassword123');

// Generate OTP
const otp = generateOtp(6); // "482916"

// Encode data
const encoded = base64Encode('Hello World');

// Serialize error
try {
    throw new Error('Something went wrong');
} catch (error) {
    const serialized = serializeObject(error);
    console.log(JSON.stringify(serialized, null, 2));
}
```

## Usage

### Security Utilities

#### SHA-1 Hashing

```javascript
const { sha1 } = require('@morphsync/utils');

// Hash password
const hashedPassword = sha1('userPassword123');

// Verify password
if (sha1(inputPassword) === storedHash) {
    console.log('Password correct');
}

// Generate verification token
const token = sha1(email + timestamp + secret);
```

#### OTP Generation

```javascript
const { generateOtp } = require('@morphsync/utils');

// Generate 6-digit OTP (default)
const otp = generateOtp(); // "482916"

// Generate custom length OTP
const shortOtp = generateOtp(4); // "7293"
const longOtp = generateOtp(8); // "84729163"

// Use in authentication
const userOtp = generateOtp(6);
await sendOtpEmail(userEmail, userOtp);
```

### Encoding Utilities

#### Base64 Encode/Decode

```javascript
const { base64Encode, base64Decode } = require('@morphsync/utils');

// Encode string
const encoded = base64Encode('Hello World'); // "SGVsbG8gV29ybGQ="

// Decode string
const decoded = base64Decode('SGVsbG8gV29ybGQ='); // "Hello World"

// Encode JSON
const token = base64Encode(JSON.stringify({ userId: 123 }));

// Decode JSON
const data = JSON.parse(base64Decode(token));
```

### Text Processing

#### Convert to Plain Text

```javascript
const { convertToPlainText } = require('@morphsync/utils');

// Remove markdown formatting
const plain = convertToPlainText('*Hello* _world_'); // "Hello world"

// Decode HTML entities
const decoded = convertToPlainText('Hello &amp; goodbye'); // "Hello & goodbye"

// Combined example
const text = convertToPlainText('*Bold* &amp; _italic_\n\nNew line');
// Result: "Bold & italic New line"
```

### String Utilities

#### String Padding

```javascript
const { stringPad } = require('@morphsync/utils');

// Pad with zeros
const id = stringPad(1, 6, '0'); // "000001"

// Pad with custom character
const masked = stringPad(42, 8, '*'); // "******42"

// Generate formatted IDs
const orderId = `ORD-${stringPad(123, 8, '0')}`; // "ORD-00000123"
const invoiceNo = `INV-${stringPad(456, 6, '0')}`; // "INV-000456"
```

### Serialization

#### Serialize Objects/Errors

```javascript
const { serializeObject } = require('@morphsync/utils');

// Serialize Error object
try {
    throw new Error('Something went wrong');
} catch (error) {
    const serialized = serializeObject(error);
    console.log(JSON.stringify(serialized, null, 2));
}

// Serialize custom error
const customError = { message: 'Custom error', code: 500 };
const serialized = serializeObject(customError);

// Serialize primitive
const stringError = serializeObject('Simple error');
// Result: { message: "Simple error" }
```

## API Reference

### `sha1(data)`

Generates a SHA-1 hash for the given data.

**Parameters:**
- `data` (string): The data to hash

**Returns:** SHA-1 hash in hexadecimal format (40 characters)

### `generateOtp(length)`

Generates a cryptographically secure OTP consisting of digits only.

**Parameters:**
- `length` (number, optional): The length of the OTP (default: 6)

**Returns:** OTP as a string of digits

### `base64Encode(data)`

Encodes a string to Base64 format.

**Parameters:**
- `data` (string): The string to encode

**Returns:** Base64 encoded string

### `base64Decode(data)`

Decodes a Base64 encoded string.

**Parameters:**
- `data` (string): The Base64 encoded string to decode

**Returns:** Decoded UTF-8 string

### `convertToPlainText(formattedText)`

Converts formatted text (markdown and HTML entities) into plain text.

**Parameters:**
- `formattedText` (string): Text containing markdown and HTML entities

**Returns:** Plain text without formatting

### `stringPad(num, length, char)`

Pads a number or string to a specified length with a given character.

**Parameters:**
- `num` (number|string): The number or string to pad
- `length` (number): The desired total length
- `char` (string): The character to use for padding

**Returns:** Padded string

### `serializeObject(error)`

Safely converts any error or object into a JSON-serializable object.

**Parameters:**
- `error` (*): Any error or object to serialize

**Returns:** JSON-serializable object

## Complete Examples

### Authentication System

```javascript
const { sha1, generateOtp } = require('@morphsync/utils');

class AuthService {
    async register(username, password) {
        const hashedPassword = sha1(password);
        await db.insert({ username, password: hashedPassword });
    }

    async sendLoginOtp(userId, password) {
        const otp = generateOtp(6);
        const loginKey = sha1(password + otp + Date.now());
        
        await db.insert({
            userId,
            otp,
            loginKey,
            expiresAt: Date.now() + 300000
        });
        
        await sendOtpEmail(userEmail, otp);
        return loginKey;
    }

    async verifyOtp(userId, otp, loginKey) {
        const record = await db.findOne({ userId, otp, loginKey });
        return record && record.expiresAt > Date.now();
    }
}
```

### Error Logging

```javascript
const { serializeObject } = require('@morphsync/utils');
const Logger = require('@morphsync/logger');

class ErrorHandler {
    static async logError(error, context) {
        const logger = new Logger();
        const serialized = serializeObject(error);
        
        const logData = {
            ...serialized,
            context,
            timestamp: new Date().toISOString()
        };
        
        logger.write(JSON.stringify(logData, null, 2), 'errors/app');
    }
}

// Usage in Express
app.use((error, req, res, next) => {
    ErrorHandler.logError(error, {
        method: req.method,
        url: req.url,
        userId: req.user?.id
    });
    
    res.status(500).json({ message: 'Internal server error' });
});
```

### Data Processing

```javascript
const { base64Encode, base64Decode, stringPad, convertToPlainText } = require('@morphsync/utils');

// Encode user data for URL
const userData = { userId: 123, role: 'admin' };
const encodedData = base64Encode(JSON.stringify(userData));
const url = `${baseUrl}/dashboard?data=${encodedData}`;

// Decode and parse
const decodedData = base64Decode(encodedData);
const user = JSON.parse(decodedData);

// Process email content for SMS
const emailBody = '*Important* notification &amp; update\n\nDetails here';
const plainText = convertToPlainText(emailBody);
await sendSms(phoneNumber, plainText);

// Generate formatted IDs
const orderId = `ORD-${stringPad(123, 8, '0')}`; // "ORD-00000123"
const invoiceNo = `INV-${stringPad(456, 6, '0')}`; // "INV-000456"
```

### Express Controller

```javascript
const { sha1, serializeObject } = require('@morphsync/utils');
const Logger = require('@morphsync/logger');

class UserController {
    static async login(req, res) {
        const logger = new Logger();
        
        try {
            const { username, password } = req.body;
            const hashedPassword = sha1(password);
            
            const user = await db.findOne({ username, password: hashedPassword });
            
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            logger.write(`User ${username} logged in successfully`, 'auth/info');
            res.json({ success: true, user });
        } catch (error) {
            const serialized = serializeObject(error);
            logger.write(JSON.stringify(serialized, null, 2), 'auth/error');
            res.status(500).json({ message: 'Login failed' });
        }
    }
}
```

## Error Handling

All functions handle errors gracefully:

```javascript
try {
    const hash = sha1('data');
    const otp = generateOtp(6);
    const encoded = base64Encode('text');
} catch (error) {
    console.error('Operation failed:', error.message);
}
```

## Dependencies

- [html-entities](https://www.npmjs.com/package/html-entities) - HTML entity encoding/decoding

## License

ISC

## Author

Morphsync

## Related Packages

- [@morphsync/logger](https://www.npmjs.com/package/@morphsync/logger) - Logger utility with automatic file organization
- [@morphsync/http-request](https://www.npmjs.com/package/@morphsync/http-request) - HTTP request utility
- [@morphsync/mysql-db](https://www.npmjs.com/package/@morphsync/mysql-db) - MySQL query builder

## Support

For issues and questions, please visit the [GitHub repository](https://github.com/morphsync/morphsync-utils).
#   m o r p h s y n c - u t i l s  
 