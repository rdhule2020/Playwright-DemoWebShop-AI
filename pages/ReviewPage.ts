import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(productId: number): Promise<void> {
    await this.open(`/productreviews/${productId}`);
  }

  reviewTitle() {
    return this.page.locator('#AddProductReview_Title');
  }

  reviewText() {
    return this.page.locator('#AddProductReview_ReviewText');
  }

  rating(value: number) {
    return this.page.locator(`#addproductrating_${value}`);
  }

  submitButton() {
    return this.page.getByRole('button', { name: /Submit review/i });
  }
}
