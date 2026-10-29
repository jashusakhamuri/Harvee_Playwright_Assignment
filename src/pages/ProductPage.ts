import { Page, Locator, expect } from '@playwright/test';
import logger from '../config/logger';

export class ProductsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productDescriptions: Locator;
  readonly productPrices: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
 

  constructor(page: Page) {
    this.page = page;

    // Product page elements
    this.pageTitle = page.locator('.title');
    this.productCards = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productDescriptions = page.locator('.inventory_item_desc');
    this.productPrices = page.locator('.inventory_item_price');


    // Cart and sorting elements
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async getTitle(): Promise<string> {
    return (await this.pageTitle.textContent())?.trim() ?? '';
  }

  async getDescriptions(): Promise<string[]> {
    return this.productDescriptions.allTextContents();
  }

  async getItemCount(): Promise<number> {
    return this.productCards.count();
  }

  async getItemNames(): Promise<string[]> {
    const names = await this.productNames.allTextContents();
    return names.map(name => name.trim());
  }

  async getItemPrices(): Promise<number[]> {
    const prices = await this.productPrices.allTextContents();

    return prices.map(price =>
      Number(price.trim().replace('$', ''))
    );
  }

  async verifyProductsPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.productCards.first()).toBeVisible();

    logger.info('Products page loaded successfully');
  }

  async sortBy(option: string): Promise<void> {
    logger.info(`Sorting products using option: ${option}`);

    await this.sortDropdown.selectOption({ label: option });
  }

  async addToCart(itemName: string): Promise<void> {
    const product = this.productCards.filter({
      has: this.page.locator('.inventory_item_name', {
        hasText: itemName,
      }),
    });

    await expect(product).toHaveCount(1);

    await product.getByRole('button', {
      name: 'Add to cart',
    }).click();

    logger.info(`Added product to cart: ${itemName}`);
  }

  async removeFromCart(itemName: string): Promise<void> {
    const product = this.productCards.filter({
      has: this.page.locator('.inventory_item_name', {
        hasText: itemName,
      }),
    });

    await expect(product).toHaveCount(1);

    await product.getByRole('button', {
      name: 'Remove',
    }).click();

    logger.info(`Removed product from cart: ${itemName}`);
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.count() === 0) {
      return 0;
    }

    return Number((await this.cartBadge.textContent())?.trim() ?? '0');
  }

  async logout(): Promise<void> {
  await this.page.locator('#react-burger-menu-btn').click();
  await this.page.locator('#logout_sidebar_link').click();
}




  
}  