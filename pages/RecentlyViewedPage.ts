import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RecentlyViewedPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/recentlyviewedproducts');
  }

  products() {
    return this.page.locator('.product-item');
  }
}
