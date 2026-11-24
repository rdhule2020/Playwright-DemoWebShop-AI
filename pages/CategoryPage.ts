import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(path: string): Promise<void> {
    await this.open(path);
  }

  heading(name: string) {
    return this.page.getByRole('heading', { name, exact: true });
  }

  categoryLink(name: string) {
    return this.page.getByRole('link', { name, exact: true }).first();
  }

  products() {
    return this.page.locator('.product-item');
  }

  productLink(name: string) {
    return this.page.getByRole('link', { name: new RegExp(name, 'i') });
  }

  sortControl() {
    return this.page.locator('#products-orderby');
  }

  pageSizeControl() {
    return this.page.locator('#products-pagesize');
  }

  nextPageLink() {
    return this.page.getByRole('link', { name: /Next/i });
  }

  previousPageLink() {
    return this.page.getByRole('link', { name: /Previous/i });
  }
}
