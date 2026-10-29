import { test, expect } from '../src/fixtures/testFixtures';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';
import logger from '../src/config/logger';
import checkoutData from '../src/testData/checkoutData.json';

test.describe('Cart Module', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page, config }) => {
    logger.info('Starting cart module test setup');

    const loginPage = new LoginPage(page);

    await loginPage.navigate(config.baseURL);
    await loginPage.login(
      config.users.standard.username,
      config.users.standard.password
    );

    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await productsPage.verifyProductsPageLoaded();

    logger.info('Cart module setup completed');
  });

  test('TC3.1 - Add one product and verify cart', async () => {
    logger.info('TC3.1 started');

    const firstProduct = checkoutData.products.allProducts[0];

    // Add one product
    await productsPage.addToCart(firstProduct);

    expect(await productsPage.getCartBadgeCount()).toBe(1);

    // Open cart and verify
    await cartPage.openCart();

    expect(await cartPage.getCartItemCount()).toBe(1);
    expect(await cartPage.getCartItemNames()).toEqual([firstProduct]);

    logger.info('TC3.1 passed');
  });

  test('TC3.2 - Add two products and verify cart', async () => {
    logger.info('TC3.2 started');

    const expectedProducts = checkoutData.products.allProducts.slice(0, 2);

    // Add two products
    for (const product of expectedProducts) {
      await productsPage.addToCart(product);
    }

    expect(await productsPage.getCartBadgeCount()).toBe(2);

    await cartPage.openCart();

    expect(await cartPage.getCartItemCount()).toBe(2);
    expect(await cartPage.getCartItemNames()).toEqual(expectedProducts);

    logger.info('TC3.2 passed');
  });

  test('TC3.3 - Add two products, remove one, and verify cart', async () => {
    logger.info('TC3.3 started');

    const [firstProduct, secondProduct] =
      checkoutData.products.allProducts;

    await productsPage.addToCart(firstProduct);
    await productsPage.addToCart(secondProduct);

    expect(await productsPage.getCartBadgeCount()).toBe(2);

    await cartPage.openCart();

    expect(await cartPage.getCartItemCount()).toBe(2);

    // Remove the first product
    await cartPage.removeItem(firstProduct);

    // Verify remaining product
    expect(await cartPage.getCartItemCount()).toBe(1);
    expect(await cartPage.getCartItemNames()).toEqual([secondProduct]);

    // Return to Products page and verify badge
    await cartPage.continueShopping();

    expect(await productsPage.getCartBadgeCount()).toBe(1);

    logger.info('TC3.3 passed');
  });

  test('TC3.4 - Add three products and verify cart', async () => {
    logger.info('TC3.4 started');

    const expectedProducts = checkoutData.products.allProducts.slice(0, 3);

    for (const product of expectedProducts) {
      await productsPage.addToCart(product);
    }

    expect(await productsPage.getCartBadgeCount()).toBe(3);

    await cartPage.openCart();

    expect(await cartPage.getCartItemCount()).toBe(3);
    expect(await cartPage.getCartItemNames()).toEqual(expectedProducts);

    logger.info('TC3.4 passed');
  });

  test('TC3.5 - Add three products, remove one, and verify remaining cart', async () => {
    logger.info('TC3.5 started');

    const expectedProducts = checkoutData.products.allProducts.slice(0, 3);

    for (const product of expectedProducts) {
      await productsPage.addToCart(product);
    }

    expect(await productsPage.getCartBadgeCount()).toBe(3);

    await cartPage.openCart();

    // Remove the second product
    await cartPage.removeItem(expectedProducts[1]);

    const remainingProducts = [
      expectedProducts[0],
      expectedProducts[2],
    ];

    expect(await cartPage.getCartItemCount()).toBe(2);
    expect(await cartPage.getCartItemNames()).toEqual(remainingProducts);

    await cartPage.continueShopping();

    expect(await productsPage.getCartBadgeCount()).toBe(2);

    logger.info('TC3.5 passed');
  });

  test('TC3.6 - Add all six products and verify cart contents', async () => {
    logger.info('TC3.6 started');

    const expectedProducts = checkoutData.products.allProducts;

    for (const product of expectedProducts) {
      await productsPage.addToCart(product);
    }

    expect(await productsPage.getCartBadgeCount()).toBe(
      expectedProducts.length
    );

    await cartPage.openCart();

    expect(await cartPage.getCartItemCount()).toBe(
      expectedProducts.length
    );

    expect(await cartPage.getCartItemNames()).toEqual(expectedProducts);

    logger.info('TC3.6 passed');
  });
});