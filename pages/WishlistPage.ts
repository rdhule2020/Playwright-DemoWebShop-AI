import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishlistPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/wishlist');
  }

  productRows() {
    return this.page.locator('.cart-item-row');
  }

  emptyMessage() {
    return this.page.getByText('The wishlist is empty!');
  }

  addToCartButton() {
    return this.page.getByRole('button', { name: /Add to cart/i });
  }

  updateButton() {
    return this.page.getByRole('button', { name: /Update wishlist/i });
  }
}
