import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductEmailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  friendEmail() {
    return this.page.getByLabel(/Friend's email/i);
  }

  senderEmail() {
    return this.page.getByLabel(/Your email address/i);
  }

  personalMessage() {
    return this.page.getByLabel(/Personal message/i);
  }

  sendButton() {
    return this.page.getByRole('button', { name: /Send email/i });
  }
}
