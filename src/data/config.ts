import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Centralized configuration for the automation project.
 * All environment-sensitive values should be defined here.
 */
export const config = {
  baseUrl:    process.env.BASE_URL     || 'https://tvn-sut.info',
  env:        process.env.ENV          || 'staging',
  headless:   process.env.HEADLESS     !== 'false',

  credentials: {
    admin: {
      username: process.env.ADMIN_USERNAME || 'admin@tvn-sut.info',
      password: process.env.ADMIN_PASSWORD || '',
    },
    user: {
      username: process.env.USER_USERNAME || 'user@tvn-sut.info',
      password: process.env.USER_PASSWORD || '',
    },
  },

  timeouts: {
    short:      5_000,
    medium:    15_000,
    long:      30_000,
    pageLoad:  30_000,
  },
};
