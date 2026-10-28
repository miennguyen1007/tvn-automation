import { faker } from '@faker-js/faker';

/**
 * Test data factory — generates randomized but realistic test data.
 * Use this to avoid hardcoded values and enable parallel test execution.
 */
export const TestData = {
  /**
   * Generate a valid user object
   */
  validUser: () => ({
    firstName:  faker.person.firstName(),
    lastName:   faker.person.lastName(),
    email:      faker.internet.email(),
    password:   faker.internet.password({ length: 12, memorable: true }),
    phone:      faker.phone.number(),
  }),

  /**
   * Generate an invalid email format string
   */
  invalidEmails: [
    'not-an-email',
    'missing@domain',
    '@nodomain.com',
    'space in@email.com',
    '',
  ],

  /**
   * Boundary values for password
   */
  passwordBoundary: {
    tooShort:   'abc',        // below minimum
    minimum:    'abcd1234',   // exactly min length (8 chars)
    maximum:    'A'.repeat(128), // extremely long
    withSpaces: 'pass word123',
    specialChars: '!@#$%^&*()',
  },

  /**
   * SQL injection payloads (for security testing)
   */
  sqlInjection: [
    "' OR 1=1 --",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users --",
  ],

  /**
   * XSS payloads (for security testing)
   */
  xssPayloads: [
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert(1)>',
    '"><script>alert(document.cookie)</script>',
  ],
};
