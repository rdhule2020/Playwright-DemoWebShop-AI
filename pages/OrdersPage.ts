import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrdersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/customer/orders');
  }

  orderRows() {
    return this.page.locator('.order-item');
  }

  detailsButtons() {
    return this.page.getByRole('button', { name: /Details/i });
  }

  orderTotal() {
    return this.page.locator('.order-total');
  }
}
