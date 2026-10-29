import { test, expect } from '../src/fixtures/testFixtures';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductPage';
import logger from '../src/config/logger';

test.describe('Login Module', () => {
  test('TC1.1 - Standard user can log in successfully', async ({
    page,
    config,
  }) => {
    logger.info('TC1.1 started: Standard user login');

    const loginPage = new LoginPage(page);

    await loginPage.navigate(config.baseURL);

    await loginPage.login(
      config.users.standard.username,
      config.users.standard.password,
    );

    await expect(page).toHaveURL(/inventory\.html/);

    logger.info('TC1.1 passed: Standard user login');
  });

  test('TC1.2 - Locked-out user cannot log in', async ({
    page,
    config,
  }) => {
    logger.info('TC1.2 started: Locked-out user login');

    const loginPage = new LoginPage(page);

    await loginPage.navigate(config.baseURL);

    await loginPage.login(
      config.users.lockedOut.username,
      config.users.lockedOut.password,
    );

    await expect(loginPage.errorMessage).toBeVisible();

    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out.',
    );

    logger.info('TC1.2 passed: Locked-out user error verified');
  });

  test('TC1.3 - Problem user can log in successfully', async ({
    page,
    config,
  }) => {
    logger.info('TC1.3 started: Problem user login');

    const loginPage = new LoginPage(page);

    await loginPage.navigate(config.baseURL);

    await loginPage.login(
      config.users.problem.username,
      config.users.problem.password,
    );

    await expect(page).toHaveURL(/inventory\.html/);

    logger.info('TC1.3 passed: Problem user login');
  });

  test('TC1.4 - Performance glitch user can log in successfully', async ({
    page,
    config,
  }) => {
    logger.info('TC1.4 started: Performance glitch user login');

    const loginPage = new LoginPage(page);

    await loginPage.navigate(config.baseURL);

    await loginPage.login(
      config.users.performanceGlitch.username,
      config.users.performanceGlitch.password,
    );

    await expect(page).toHaveURL(/inventory\.html/);

    logger.info('TC1.4 passed: Performance glitch user login');
  });




  test('TC07 - Products URL cannot be accessed after logout', async ({
  page,
  config,
}) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);

  // Login successfully
  await loginPage.navigate(config.baseURL);
  await loginPage.login(
    config.users.standard.username,
    config.users.standard.password,
  );

  await expect(page).toHaveURL(/inventory\.html/);

  // Logout
  await productsPage.logout();

  // Attempt to access the protected page directly
  await page.goto(`${config.baseURL}/inventory.html`);

  // Verify access is denied
  await loginPage.verifyLoginPageVisible();
  await expect(page).not.toHaveURL(/inventory\.html/);
});


});