import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductTagPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  heading(name: string) {
    return this.page.getByRole('heading', { level: 1 });
  }

  products() {
    return this.page.locator('.product-item');
  }
}
