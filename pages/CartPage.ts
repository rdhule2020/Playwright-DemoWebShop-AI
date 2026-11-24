import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/cart');
  }

  items() {
    return this.page.locator('.cart-item-row');
  }

  quantityInputs() {
    return this.page.locator('.cart-item-row input.qty-input');
  }

  updateCartButton() {
    return this.page.getByRole('button', { name: /Update shopping cart/i });
  }

  removeCheckboxes() {
    return this.page.locator('.cart-item-row input[name^="removefromcart"]');
  }

  emptyMessage() {
    return this.page.getByText('Your Shopping Cart is empty!');
  }

  continueShoppingButton() {
    return this.page.getByRole('button', { name: /Continue shopping/i });
  }

  couponCode() {
    return this.page.locator('[name="discountcouponcode"]');
  }

  applyCouponButton() {
    return this.page.locator('[name="applydiscountcouponcode"]');
  }

  termsCheckbox() {
    return this.page.locator('#termsofservice');
  }

  checkoutButton() {
    return this.page.locator('#checkout');
  }

  estimateShippingButton() {
    return this.page.getByRole('button', { name: /Estimate shipping/i });
  }

  shippingCountry() {
    return this.page.locator('#CountryId');
  }

  shippingPostalCode() {
    return this.page.locator('#ZipPostalCode');
  }

  shippingEstimate() {
    return this.page.locator('.shipping-options');
  }

  couponError() {
    return this.page.getByText(/The coupon code you entered couldn't be applied to your order/i);
  }

  termsError() {
    return this.page.locator('.terms-of-service-warning-box, .message-error');
  }

  subtotal() {
    return this.page.locator('.cart-total-right').first();
  }
}
