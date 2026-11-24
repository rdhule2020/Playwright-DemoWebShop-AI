import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  email() {
    return this.page.locator('#Email');
  }

  recoverButton() {
    return this.page.getByRole('button', { name: /Recover/i });
  }

  async requestReset(email: string): Promise<void> {
    await this.email().fill(email);
    await this.recoverButton().click();
  }
}
