import { Page, Locator, expect } from '@playwright/test';
import logger from '../config/logger';

export class CartPage {
  readonly page: Page;

  // Shopping cart
  readonly cartButton: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
 

  // Checkout information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Checkout overview / payment summary
  readonly paymentItemNames: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Order confirmation
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Shopping cart locators
    this.cartButton = page.locator('.shopping_cart_link');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator(
      '.cart_item .inventory_item_name'
    );
    this.cartItemPrices = page.locator(
      '.cart_item .inventory_item_price'
    );

    this.checkoutButton = page.getByRole('button', {
      name: 'Checkout',
    });

    this.continueShoppingButton = page.getByRole('button', {
      name: 'Continue Shopping',
    });

    // Checkout information locators
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.errorMessage = page.locator('[data-test="error"]');

    // Checkout overview locators
    this.paymentItemNames = page.locator(
      '.cart_list .inventory_item_name'
    );
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('#finish');

    // Confirmation locator
    this.confirmationMessage = page.locator(
      '#checkout_complete_container h2'
    );
  }

  // =========================
  // Shopping Cart Actions
  // =========================

  async openCart(): Promise<void> {
    logger.info('Opening shopping cart');
    await this.cartButton.click();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    const names = await this.cartItemNames.allTextContents();

    return names.map(name => name.trim());
  }

  async getCartItemPrices(): Promise<number[]> {
    const prices = await this.cartItemPrices.allTextContents();

    return prices.map(price => this.parsePrice(price));
  }

  async removeItem(itemName: string): Promise<void> {
    const item = this.cartItems.filter({
      has: this.page.locator('.inventory_item_name', {
        hasText: itemName,
      }),
    });

    await expect(item).toHaveCount(1);

    await item.getByRole('button', {
      name: 'Remove',
    }).click();

    logger.info(`Removed product from cart: ${itemName}`);
  }

  

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();

    logger.info('Continuing shopping');
  }

  async proceedToCheckout(): Promise<void> {
    logger.info('Proceeding to checkout');

    await this.checkoutButton.click();
  }

 
  // Checkout Information


  async fillCheckoutDetails(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);

    logger.info('Checkout information entered');
  }

  async continueToPayment(): Promise<void> {
    logger.info('Submitting checkout information');

    await this.continueButton.click();
  }

  async getCheckoutErrorMessage(): Promise<string> {
    return (
      await this.errorMessage.textContent()
    )?.trim() ?? '';
  }


  // Checkout Overview


  async getPaymentItemNames(): Promise<string[]> {
    const names = await this.paymentItemNames.allTextContents();

    return names.map(name => name.trim());
  }

  private parsePrice(text: string): number {
    const match = text.match(/\$([\d,]+\.\d{2})/);

    if (!match) {
      throw new Error(`Unable to parse price from text: "${text}"`);
    }

    return Number(match[1].replace(/,/g, ''));
  }

  private async getAmount(locator: Locator): Promise<number> {
    const text = await locator.textContent();

    if (!text) {
      throw new Error('Unable to read checkout amount');
    }

    return this.parsePrice(text);
  }

  async getSubtotal(): Promise<number> {
    return this.getAmount(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.getAmount(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.getAmount(this.totalLabel);
  }

  async finishOrder(): Promise<void> {
    logger.info('Finishing customer order');

    await this.finishButton.click();
  }

  
  // Order Confirmation
  

  async getConfirmationMessage(): Promise<string> {
    return (
      await this.confirmationMessage.textContent()
    )?.trim() ?? '';
  }

  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.confirmationMessage).toHaveText(
      'Thank you for your order!'
    );

    logger.info('Order confirmation successfully verified');
  }
}