import { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  async open(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  getHeaderLink(name: RegExp | string) {
    return this.page.getByRole('link', { name });
  }

  getSearchBox() {
    return this.page.locator('#small-searchterms');
  }

  getFooterLink(name: RegExp | string) {
    return this.page.getByRole('link', { name });
  }
}
