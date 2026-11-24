import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(slug: string): Promise<void> {
    await this.open(`/${slug}`);
  }

  heading(name: string) {
    return this.page.getByRole('heading', { name, exact: true });
  }

  productArea() {
    return this.page.locator('.product-details-page .overview');
  }

  price() {
    return this.productArea().locator('.product-price');
  }

  quantity() {
    return this.productArea().locator('input[name*="EnteredQuantity"]');
  }

  addToCartButton() {
    return this.productArea().locator('input[value="Add to cart"]').first();
  }

  addToWishlistButton() {
    return this.page.locator('input[value="Add to wishlist"], button:has-text("Add to wishlist")');
  }

  addToCompareButton() {
    return this.productArea().locator('input[value="Add to compare list"]');
  }

  emailFriendButton() {
    return this.productArea().locator('input[value="Email a friend"]');
  }

  reviewLink() {
    return this.page.getByRole('link', { name: /Add your review/i });
  }

  productTag(name: string) {
    return this.page.getByRole('link', { name, exact: true });
  }

  optionSelects() {
    return this.productArea().locator('select[name^="product_attribute_"]');
  }

  optionRadio(value: string) {
    return this.productArea().locator(`input[type="radio"][value="${value}"]`);
  }

  optionalCheckboxes() {
    return this.productArea().locator('input[type="checkbox"][name^="product_attribute_"]');
  }

  giftCardRecipientName() {
    return this.productArea().getByLabel(/Recipient's Name/i);
  }

  giftCardRecipientEmail() {
    return this.productArea().getByLabel(/Recipient's Email/i);
  }

  giftCardSenderName() {
    return this.productArea().getByLabel(/Your Name/i);
  }

  giftCardSenderEmail() {
    return this.productArea().getByLabel(/Your Email/i);
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantity().fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton().click();
    await this.page
      .locator('.bar-notification')
      .filter({ hasText: /added to your shopping cart/i })
      .waitFor({ state: 'visible' });
  }

  async addToWishlist(): Promise<void> {
    await this.addToWishlistButton().click();
    await this.page
      .locator('.bar-notification')
      .filter({ hasText: /added to your wishlist/i })
      .waitFor({ state: 'visible' });
  }

  async addToCompare(): Promise<void> {
    await this.addToCompareButton().click();
  }

  async openEmailFriend(): Promise<void> {
    await this.emailFriendButton().click();
  }

  async selectDefaultRadioOptions(): Promise<void> {
    const groups = await this.productArea()
      .locator('input[type="radio"][name^="product_attribute_"]')
      .evaluateAll((inputs) => [...new Set(inputs.map((input) => (input as HTMLInputElement).name))]);

    for (const name of groups) {
      const firstOption = this.productArea().locator(`input[type="radio"][name="${name}"]`).first();
      if (!(await firstOption.isChecked())) {
        await firstOption.check();
      }
    }
  }

  async selectComputerConfiguration(): Promise<void> {
    const selects = this.optionSelects();
    if (await selects.count()) {
      await selects.nth(0).selectOption({ label: '2.5 GHz Intel Pentium Dual-Core E2200 [+15.00]' });
    }
    if (await selects.count() > 1) {
      await selects.nth(1).selectOption({ label: '8GB [+60.00]' });
    }

    const radioGroups = await this.productArea()
      .locator('input[type="radio"][name^="product_attribute_"]')
      .evaluateAll((inputs) => [...new Set(inputs.map((input) => (input as HTMLInputElement).name))]);

    for (const name of radioGroups) {
      const options = this.productArea().locator(`input[type="radio"][name="${name}"]`);
      const optionCount = await options.count();
      if (!optionCount) {
        continue;
      }
      const labels = await options.evaluateAll((inputs) =>
        inputs.map((input) => {
          const element = input as HTMLInputElement;
          return element.labels?.[0]?.innerText ?? '';
        }),
      );
      const preferredIndex = labels.findIndex((label) => /Windows 10|400 GB/i.test(label));
      const selectedIndex = preferredIndex >= 0 ? preferredIndex : 0;
      const selected = options.nth(selectedIndex);
      if (!(await selected.isChecked())) {
        await selected.check();
      }
    }

    const software = this.optionalCheckboxes();
    for (let index = 0; index < await software.count(); index += 1) {
      const option = software.nth(index);
      if (await option.isChecked()) {
        await option.uncheck();
      }
    }
  }
}
