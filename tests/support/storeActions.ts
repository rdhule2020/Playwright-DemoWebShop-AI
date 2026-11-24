import { Page } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { CheckoutAddress, CheckoutPage } from '../../pages/CheckoutPage';
import { ProductPage } from '../../pages/ProductPage';

export async function addSimpleComputer(page: Page, quantity = 1): Promise<void> {
  const product = new ProductPage(page);
  await product.goto('simple-computer');
  await product.selectDefaultRadioOptions();
  if (quantity !== 1) {
    await product.setQuantity(quantity);
  }
  await product.addToCart();
}

export async function beginGuestCheckout(page: Page, address: CheckoutAddress): Promise<CheckoutPage> {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  await cart.goto();
  if (await cart.termsCheckbox().isVisible().catch(() => false)) {
    await cart.termsCheckbox().check();
  }
  await cart.checkoutButton().click();
  await checkout.continueGuestCheckout();
  await checkout.fillBillingAddress(address);
  await checkout.continue();
  await checkout.shippingAddressSelect().waitFor({ state: 'visible' });
  return checkout;
}

export async function proceedShippingAndPayment(checkout: CheckoutPage): Promise<void> {
  await checkout.shippingAddressSelect().waitFor({ state: 'visible' });
  await checkout.continue();
  await checkout.shippingOptions().first().waitFor({ state: 'visible' });
  await checkout.selectFirstShippingOption();
  await checkout.continue();
  await checkout.paymentOptions().first().waitFor({ state: 'visible' });
  await checkout.selectFirstPaymentOption();
  await checkout.continue();
  await checkout.continue();
  await checkout.confirmOrderButton().waitFor({ state: 'visible' });
}
