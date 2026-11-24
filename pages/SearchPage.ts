import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/search');
  }

  keyword() {
    return this.page.locator('#Q');
  }

  advancedSearchToggle() {
    return this.page.locator('#As');
  }

  categoryControl() {
    return this.page.locator('#Cid');
  }

  minimumPrice() {
    return this.page.locator('#Pf');
  }

  maximumPrice() {
    return this.page.locator('#Pt');
  }

  searchButton() {
    return this.page.getByRole('button', { name: 'Search', exact: true }).last();
  }

  searchResults() {
    return this.page.locator('.product-item');
  }
}
