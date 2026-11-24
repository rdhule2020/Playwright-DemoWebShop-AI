import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ComparePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/compareproducts');
  }

  comparisonTable() {
    return this.page.locator('.compare-products-table');
  }

  clearButton() {
    return this.page.getByRole('button', { name: /Clear list/i });
  }

  productNames() {
    return this.comparisonTable().locator('a');
  }
}
