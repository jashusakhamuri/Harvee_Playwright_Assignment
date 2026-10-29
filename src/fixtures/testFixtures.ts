import { test as base, expect } from '@playwright/test';
import { loadProperties } from '../config/propertiesLoader';
import logger from '../config/logger';

type UserCredentials = {
  username: string;
  password: string;
};

type TestConfig = {
  baseURL: string;
  users: {
    standard: UserCredentials;
    lockedOut: UserCredentials;
    problem: UserCredentials;
    performanceGlitch: UserCredentials;
  };
};

type TestFixtures = {
  config: TestConfig;
};

function required(value: string | undefined, key: string): string {
  if (!value) {
    logger.error(`Missing required property: ${key}`);
    throw new Error(`Missing required property: ${key}`);
  }

  return value;
}

export const test = base.extend<TestFixtures>({
  config: async ({}, use) => {
    logger.info('Starting test configuration setup');

    let config: TestConfig;

    try {
      logger.info('Loading environment.properties');

      const environment = loadProperties(
        'src/config/environment.properties',
      );

      logger.info('Loading users.properties');

      const users = loadProperties('src/config/users.properties');

      config = {
        baseURL: required(environment['qa.url'], 'qa.url'),

        users: {
          standard: {
            username: required(
              users['standard.username'],
              'standard.username',
            ),
            password: required(
              users['standard.password'],
              'standard.password',
            ),
          },

          lockedOut: {
            username: required(
              users['lockedOut.username'],
              'lockedOut.username',
            ),
            password: required(
              users['lockedOut.password'],
              'lockedOut.password',
            ),
          },

          problem: {
            username: required(
              users['problem.username'],
              'problem.username',
            ),
            password: required(
              users['problem.password'],
              'problem.password',
            ),
          },

          performanceGlitch: {
            username: required(
              users['performanceGlitch.username'],
              'performanceGlitch.username',
            ),
            password: required(
              users['performanceGlitch.password'],
              'performanceGlitch.password',
            ),
          },
        },
      };

      logger.info('Test configuration loaded successfully');
      logger.info(`Target application: ${config.baseURL}`);
      logger.info('Credentials loaded for all four configured users');
    } catch (error) {
      logger.error(
        'Test configuration setup failed',
        error instanceof Error ? error.message : String(error),
      );

      throw error;
    }

    await use(config);

    logger.info('Test configuration fixture completed');
  },
});

export { expect };