import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/');
  }

  category(name: string) {
    return this.page.getByRole('link', { name, exact: true }).first();
  }

  featuredProduct(name: string) {
    return this.page.getByRole('link', { name: new RegExp(name, 'i') });
  }

  newsletterEmail() {
    return this.page.locator('#newsletter-email');
  }

  subscribeButton() {
    return this.page.getByRole('button', { name: 'Subscribe' });
  }

  newsletterResult() {
    return this.page.locator('#newsletter-result-block');
  }

  pollOptions() {
    return this.page.locator('.poll-options input[type="radio"]');
  }

  poll() {
    return this.page.locator('.poll');
  }

  async selectFirstPollOption(): Promise<void> {
    await this.pollOptions().first().check();
  }

  async vote(): Promise<void> {
    await this.page.getByRole('button', { name: 'Vote' }).click();
  }

  pollResult() {
    return this.page.locator('.poll-results');
  }
}
