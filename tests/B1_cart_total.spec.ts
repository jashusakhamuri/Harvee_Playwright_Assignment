
import { test, expect } from '../src/fixtures/testFixtures';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';
import checkoutData from '../src/testData/checkoutData.json';
import logger from '../src/config/logger';

test('TC17 - Checkout total equals subtotal plus tax', async ({
  page,
  config,
}) => {
  logger.info('TC17 started: Checkout total verification');

  // Reuse existing Page Object classes
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // 1. Login using the existing configuration fixture
  await loginPage.navigate(config.baseURL);

  await loginPage.login(
    config.users.standard.username,
    config.users.standard.password,
  );

  // 2. Verify the Products page is loaded
  await productsPage.verifyProductsPageLoaded();

  // 3. Add a product from the existing test data
  const productName = checkoutData.products.firstProduct;

  await productsPage.addToCart(productName);

  expect(await productsPage.getCartBadgeCount()).toBe(1);

  // 4. Open the cart and verify its contents
  await cartPage.openCart();

  expect(await cartPage.getCartItemCount()).toBe(1);
  expect(await cartPage.getCartItemNames()).toEqual([productName]);

  // 5. Start checkout
  await cartPage.proceedToCheckout();

  // 6. Enter checkout details from the existing test data
  const customer = checkoutData.validCheckout;

  await cartPage.fillCheckoutDetails(
    customer.firstName,
    customer.lastName,
    customer.postalCode,
  );

  await cartPage.continueToPayment();

  // 7. Verify the selected product appears in the overview
  await expect
    .poll(() => cartPage.getPaymentItemNames())
    .toEqual([productName]);

  // 8. Read the subtotal, tax, and total using CartPage methods
  const subtotal = await cartPage.getSubtotal();
  const tax = await cartPage.getTax();
  const total = await cartPage.getTotal();

  logger.info(
    `Checkout amounts: subtotal=${subtotal}, tax=${tax}, total=${total}`,
  );

  // 9. Verify total = subtotal + tax, using integer cents
  const expectedTotalInCents =
    Math.round(subtotal * 100) + Math.round(tax * 100);

  const actualTotalInCents = Math.round(total * 100);

  expect(actualTotalInCents).toBe(expectedTotalInCents);

  // 10. Complete the order and verify confirmation
  await cartPage.finishOrder();

  await cartPage.verifyOrderConfirmation();

  // 11. Return to Products and verify the cart is empty
  await expect
    .poll(() => page.url())
    .toContain('checkout-complete.html');

  await page.goto(`${config.baseURL}/inventory.html`);

  await productsPage.verifyProductsPageLoaded();

  expect(await productsPage.getCartBadgeCount()).toBe(0);

  logger.info('TC17 passed: Checkout total and order flow verified');
});
