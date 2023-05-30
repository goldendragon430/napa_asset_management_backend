/* eslint-disable @typescript-eslint/no-var-requires */
const crypt = require("crypto");
const key = "secret key";

// Encrypt a string using AES
export const encryptString = (message: string) => {
  const cipher = crypt.createCipher("aes-256-cbc", key);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decrypt an AES-encrypted string
export const decryptString = (ciphertext: string) => {
  const decipher = crypt.createDecipher("aes-256-cbc", key);
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
