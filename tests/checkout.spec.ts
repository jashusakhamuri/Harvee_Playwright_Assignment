import { test, expect } from '../src/fixtures/testFixtures';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';
import checkoutData from '../src/testData/checkoutData.json';
import logger from '../src/config/logger';

test.describe('Checkout Module', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page, config }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    logger.info('Starting checkout test');

    await loginPage.navigate(config.baseURL);
    await loginPage.login(
      config.users.standard.username,
      config.users.standard.password
    );

    await productsPage.verifyProductsPageLoaded();
  });

  // TC4.1 - Verify checkout overview and totals after removing one product
  test('TC4.1 - Verify checkout overview and order totals', async () => {
    logger.info('TC4.1 started');

    const firstProduct = checkoutData.products.firstProduct;
    const secondProduct = checkoutData.products.secondProduct;

    await productsPage.addToCart(firstProduct);
    await productsPage.addToCart(secondProduct);

    await cartPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(2);

    const cartProductNames = await cartPage.getCartItemNames();

    expect(cartProductNames).toEqual([firstProduct, secondProduct]);

    await cartPage.removeItem(secondProduct);

    await expect(cartPage.cartItems).toHaveCount(1);
    expect(await cartPage.getCartItemNames()).toEqual([firstProduct]);

    const expectedSubtotal = (await cartPage.getCartItemPrices())
      .reduce((sum, price) => sum + price, 0);

    await cartPage.proceedToCheckout();

    const customer = checkoutData.validCheckout;

    await cartPage.fillCheckoutDetails(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );

    await cartPage.continueToPayment();

    await expect(cartPage.paymentItemNames).toHaveText([firstProduct]);

    const actualSubtotal = await cartPage.getSubtotal();
    const tax = await cartPage.getTax();
    const total = await cartPage.getTotal();

    expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(actualSubtotal + tax, 2);
    logger.info(`Subtotal: ${actualSubtotal}, Tax: ${tax}, Total: ${total}`);

    logger.info('TC4.1 passed');
  });

  // TC4.2 - Observe checkout behavior when the cart is empty
  test('TC4.2 - Verify checkout behavior with an empty cart', async () => {
    logger.info('TC4.2 started');

    await cartPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(0);

    await cartPage.proceedToCheckout();

    const customer = checkoutData.validCheckout;

    await cartPage.fillCheckoutDetails(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );

    await cartPage.continueToPayment();

    await expect(cartPage.paymentItemNames).toHaveCount(0);

    logger.info('TC4.2 passed: empty-cart checkout behavior observed');
  });

  // TC4.3 - Validate missing required checkout fields using JSON test data
  for (const scenario of checkoutData.missingFieldScenarios) {
    test(`TC4.3 - Validate missing ${scenario.name}`, async () => {
      logger.info(`TC4.3 started: missing ${scenario.name}`);

      await productsPage.addToCart(checkoutData.products.firstProduct);

      await cartPage.openCart();
      await cartPage.proceedToCheckout();

      await cartPage.fillCheckoutDetails(
        scenario.firstName,
        scenario.lastName,
        scenario.postalCode
      );

      await cartPage.continueToPayment();

      await expect(cartPage.errorMessage).toHaveText(
        scenario.expectedError
      );

      logger.info(`TC4.3 passed: missing ${scenario.name}`);
    });
  }

  // TC4.4 - Complete a valid order and verify the confirmation
  test('TC4.4 - Complete checkout successfully', async ({ page }) => {
    logger.info('TC4.4 started');

    const firstProduct = checkoutData.products.firstProduct;
    const secondProduct = checkoutData.products.secondProduct;

    await productsPage.addToCart(firstProduct);
    await productsPage.addToCart(secondProduct);

    await cartPage.openCart();

    const expectedProductNames = [
      firstProduct,
      secondProduct,
    ];

    const expectedSubtotal = (await cartPage.getCartItemPrices())
      .reduce((sum, price) => sum + price, 0);

    await cartPage.proceedToCheckout();

    const customer = checkoutData.validCheckout;

    await cartPage.fillCheckoutDetails(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );

    await cartPage.continueToPayment();

    await expect(cartPage.paymentItemNames).toHaveText(
      expectedProductNames
    );

    const subtotal = await cartPage.getSubtotal();
    const tax = await cartPage.getTax();
    const total = await cartPage.getTotal();

    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    logger.info(`Subtotal: ${subtotal}, Tax: ${tax}, Total: ${total}`);
    await cartPage.finishOrder();

    await cartPage.verifyOrderConfirmation();

    await cartPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(0);

    logger.info('TC4.4 passed: order completed and cart is empty');
  });

  // TC4.5 - Cancel checkout and verify the cart is preserved
  test('TC4.5 - Cancel checkout and continue shopping', async () => {
    logger.info('TC4.5 started');

    const firstProduct = checkoutData.products.firstProduct;

    await productsPage.addToCart(firstProduct);
    await cartPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(1);

    await cartPage.proceedToCheckout();

    await expect(cartPage.firstNameInput).toBeVisible();

    await cartPage.page.getByRole('button', { name: 'Cancel' }).click();

    await expect(cartPage.cartItems).toHaveCount(1);
    expect(await cartPage.getCartItemNames()).toEqual([firstProduct]);

    await cartPage.continueShopping();

    await productsPage.verifyProductsPageLoaded();

    expect(await productsPage.getCartBadgeCount()).toBe(1);

    logger.info('TC4.5 passed');
  });
});