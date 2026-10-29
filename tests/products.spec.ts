import { test, expect } from '../src/fixtures/testFixtures';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductPage';
import logger from '../src/config/logger';

test.describe('Product Module', () => {

  let productsPage: ProductsPage;

  test.beforeEach(async ({ page, config }) => {
    logger.info('Starting product module test setup');

    const loginPage = new LoginPage(page);

    await loginPage.navigate(config.baseURL);
    await loginPage.login(
      config.users.standard.username,
      config.users.standard.password
    );

    productsPage = new ProductsPage(page);

    await productsPage.verifyProductsPageLoaded();

    logger.info('Product module setup completed');
  });

  test('TC2.1 - Verify products page loads correctly', async () => {
    logger.info('TC2.1 started: Verify products page');

    expect(await productsPage.getTitle()).toBe('Products');
    expect(await productsPage.getItemCount()).toBeGreaterThan(0);

    const productNames = await productsPage.getItemNames();
    const descriptions = await productsPage.getDescriptions();

    expect(productNames.length).toBeGreaterThan(0);
    expect(descriptions.length).toBe(productNames.length);

    logger.info('TC2.1 passed: Products page verified');
  });

  test('TC2.2 - Sort products by price: Low to High', async () => {
    logger.info('TC2.2 started: Price ascending sort');

    await productsPage.sortBy('Price (low to high)');

    const actualPrices = await productsPage.getItemPrices();
    const expectedPrices = [...actualPrices].sort((a, b) => a - b);
    logger.info(`Actual Prices: ${actualPrices}`);
    logger.info(`Expected Prices: ${expectedPrices}`);

    expect(actualPrices).toEqual(expectedPrices);

    logger.info('TC2.2 passed: Prices sorted from low to high');
  });

  test('TC2.3 - Sort products by price: High to Low', async () => {
    logger.info('TC2.3 started: Price descending sort');

    await productsPage.sortBy('Price (high to low)');

    const actualPrices = await productsPage.getItemPrices();
    const expectedPrices = [...actualPrices].sort((a, b) => b - a);
    logger.info(`Actual Prices: ${actualPrices}`);
    logger.info(`Expected Prices: ${expectedPrices}`);

    expect(actualPrices).toEqual(expectedPrices);

    logger.info('TC2.3 passed: Prices sorted from high to low');
  });

  test('TC2.4 - Sort products by name: A to Z', async () => {
    logger.info('TC2.4 started: Name ascending sort');

    await productsPage.sortBy('Name (A to Z)');

    const actualNames = await productsPage.getItemNames();
    const expectedNames = [...actualNames].sort((a, b) =>
      a.localeCompare(b)
    );

    logger.info(`Actual Names: ${actualNames}`);
    logger.info(`Expected Names: ${expectedNames}`);

    expect(actualNames).toEqual(expectedNames);

    logger.info('TC2.4 passed: Names sorted A to Z');
  });

  test('TC2.5 - Sort products by name: Z to A', async () => {
    logger.info('TC2.5 started: Name descending sort');

    await productsPage.sortBy('Name (Z to A)');

    const actualNames = await productsPage.getItemNames();
    const expectedNames = [...actualNames].sort((a, b) =>
      b.localeCompare(a)
    );

    logger.info(`Actual Names: ${actualNames}`);
    logger.info(`Expected Names: ${expectedNames}`);

    expect(actualNames).toEqual(expectedNames);

    logger.info('TC2.5 passed: Names sorted Z to A');
  });

  test('TC2.6 - Add two products and verify cart badge', async () => {
    logger.info('TC2.6 started: Add two products to cart');

    const productNames = await productsPage.getItemNames();

    expect(productNames.length).toBeGreaterThanOrEqual(2);

    await productsPage.addToCart(productNames[0]);
    await productsPage.addToCart(productNames[1]);
    logger.info(`Added products to cart: ${productNames[0]}, ${productNames[1]}`);

    expect(await productsPage.getCartBadgeCount()).toBe(2);

    logger.info('TC2.6 passed: Cart badge shows two items');
  });

  test('TC2.7 - Remove one product and verify cart badge', async () => {
    logger.info('TC2.7 started: Remove one product from cart');

    const productNames = await productsPage.getItemNames();

    expect(productNames.length).toBeGreaterThanOrEqual(2);

    await productsPage.addToCart(productNames[0]);
    await productsPage.addToCart(productNames[1]);

    expect(await productsPage.getCartBadgeCount()).toBe(2);

    await productsPage.removeFromCart(productNames[0]);

    expect(await productsPage.getCartBadgeCount()).toBe(1);

    logger.info('TC2.7 passed: Cart badge shows one item after removal');
  });

});