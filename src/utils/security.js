// Input validation and sanitization utilities
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} content - The HTML content to sanitize
 * @returns {string} Sanitized HTML content
 */
export const sanitizeHTML = (content) => {
  if (!content) return '';
  
  const config = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  };
  
  return DOMPurify.sanitize(content, config);
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid flag and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase, numbers and special characters'
    };
  }

  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validates and sanitizes user input
 * @param {string} input - The input to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with sanitized value
 */
export const validateInput = (input, options = {}) => {
  const {
    minLength = 0,
    maxLength = 1000,
    required = true,
    allowedChars = null
  } = options;

  if (!input && required) {
    return { isValid: false, message: 'Input is required', value: '' };
  }

  if (!input && !required) {
    return { isValid: true, message: '', value: '' };
  }

  if (input.length < minLength) {
    return { 
      isValid: false, 
      message: `Input must be at least ${minLength} characters long`,
      value: input
    };
  }

  if (input.length > maxLength) {
    return {
      isValid: false,
      message: `Input must not exceed ${maxLength} characters`,
      value: input.slice(0, maxLength)
    };
  }

  if (allowedChars && !new RegExp(`^[${allowedChars}]*$`).test(input)) {
    return {
      isValid: false,
      message: 'Input contains invalid characters',
      value: input.replace(new RegExp(`[^${allowedChars}]`, 'g'), '')
    };
  }

  // Sanitize the input
  const sanitized = escapeString(input);
  return { isValid: true, message: '', value: sanitized };
};

/**
 * Escapes special characters in a string
 * @param {string} str - The string to escape
 * @returns {string} Escaped string
 */
export const escapeString = (str) => {
  if (!str) return '';
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}; 