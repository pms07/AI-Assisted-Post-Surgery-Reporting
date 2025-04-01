// polyfill.cjs
const { webcrypto } = require('node:crypto');
console.log("Node version:", process.version);

// Ensure global crypto exists
if (!globalThis.crypto) {
  globalThis.crypto = {};
}

// Explicitly assign getRandomValues and subtle
globalThis.crypto.getRandomValues = webcrypto.getRandomValues.bind(webcrypto);
globalThis.crypto.subtle = webcrypto.subtle;

console.log("Crypto polyfill applied. globalThis.crypto.getRandomValues:", globalThis.crypto.getRandomValues);
