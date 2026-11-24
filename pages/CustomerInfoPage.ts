import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomerInfoPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/customer/info');
  }

  firstName() {
    return this.page.locator('#FirstName');
  }

  lastName() {
    return this.page.locator('#LastName');
  }

  saveButton() {
    return this.page.getByRole('button', { name: /Save/i });
  }

  async updateName(firstName: string, lastName: string): Promise<void> {
    await this.firstName().fill(firstName);
    await this.lastName().fill(lastName);
    await this.saveButton().click();
  }
}
