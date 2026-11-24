import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InformationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(path: '/shipping-returns' | '/privacy-policy'): Promise<void> {
    await this.open(path);
  }

  heading(name: string) {
    return this.page.getByRole('heading', { name, exact: true });
  }
}
