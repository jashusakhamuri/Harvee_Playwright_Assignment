import { Page, Locator } from '@playwright/test';
import logger from '../config/logger';
import { expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', {
      name: 'Login',
    });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate(baseURL: string): Promise<void> {
    logger.info('Navigating to the application login page');

    await this.page.goto(baseURL);
  }

  async login(username: string, password: string): Promise<void> {
    logger.info('Entering login credentials');

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    logger.info('Submitting the login form');

    await this.loginButton.click();
  }

  async verifyLoginPageVisible(): Promise<void> {
  await expect(this.usernameInput).toBeVisible();
}
}