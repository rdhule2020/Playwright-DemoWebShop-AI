import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { checkoutAddress, newCustomer } from './support/testData';
import { addSimpleComputer, beginGuestCheckout, proceedShippingAndPayment } from './support/storeActions';

test.describe('Shopping cart and checkout', () => {
  test('21 - Verify header cart count after adding an item', async ({ page }) => {
    const cart = new CartPage(page);
    await addSimpleComputer(page);

    await expect(cart.getHeaderLink(/Shopping cart \(1\)/i)).toBeVisible();
    await cart.getHeaderLink(/Shopping cart \(1\)/i).click();
    await expect(cart.items()).toContainText('Simple Computer');
  });

  test('22 - Update a cart line quantity', async ({ page }) => {
    const cart = new CartPage(page);
    await addSimpleComputer(page);
    await cart.goto();

    await expect(cart.items()).toContainText('Simple Computer');
    await cart.quantityInputs().first().fill('2');
    await cart.updateCartButton().click();
    await expect(cart.quantityInputs().first()).toHaveValue('2');
    await expect(cart.subtotal()).toBeVisible();
  });

  test('23 - Remove an item from the cart', async ({ page }) => {
    const cart = new CartPage(page);
    await addSimpleComputer(page);
    await cart.goto();

    await cart.removeCheckboxes().first().check();
    await cart.updateCartButton().click();
    await expect(cart.emptyMessage()).toBeVisible();
    await expect(cart.items()).toHaveCount(0);
  });

  test('24 - Continue shopping from the cart', async ({ page }) => {
    const cart = new CartPage(page);
    await addSimpleComputer(page);
    await cart.goto();
    await cart.continueShoppingButton().click();

    await expect(page).not.toHaveURL(/\/cart/);
    await expect(cart.getHeaderLink(/Shopping cart \(1\)/i)).toBeVisible();
  });

  test('25 - View the empty shopping cart', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();

    await expect(cart.emptyMessage()).toBeVisible();
    await expect(cart.items()).toHaveCount(0);
    await expect(cart.checkoutButton()).toHaveCount(0);
  });

  test('26 - Reject an invalid discount code', async ({ page }) => {
    const cart = new CartPage(page);
    await addSimpleComputer(page);
    await cart.goto();
    const originalSubtotal = await cart.subtotal().innerText();

    await cart.couponCode().fill('INVALID-COUPON');
    await cart.applyCouponButton().click();
    await expect(cart.couponError()).toBeVisible();
    await expect(cart.subtotal()).toHaveText(originalSubtotal);
  });

  test('27 - Require acceptance of checkout terms', async ({ page }) => {
    const cart = new CartPage(page);
    await addSimpleComputer(page);
    await cart.goto();

    await expect(cart.termsCheckbox()).not.toBeChecked();
    page.once('dialog', async (dialog) => dialog.accept());
    await cart.checkoutButton().click();
    await expect(page).toHaveURL(/cart/);

    await cart.termsCheckbox().check();
    await cart.checkoutButton().click();
    await expect(page).toHaveURL(/checkout/);
  });

  test('28 - Enter billing details as a guest', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    const customer = newCustomer('guest-billing');
    await addSimpleComputer(page);
    await page.goto('/cart');
    const cart = new CartPage(page);
    await cart.termsCheckbox().check();
    await cart.checkoutButton().click();
    await checkout.continueGuestCheckout();
    await checkout.fillBillingAddress(checkoutAddress(customer));
    await checkout.continue();

    await expect(checkout.shippingAddressSelect()).toBeVisible();
  });

  test('29 - Select a shipping method', async ({ page }) => {
    const customer = newCustomer('guest-shipping');
    await addSimpleComputer(page);
    const cart = new CartPage(page);
    await cart.goto();
    await cart.termsCheckbox().check();
    await cart.checkoutButton().click();
    const checkout = new CheckoutPage(page);
    await checkout.continueGuestCheckout();
    await checkout.fillBillingAddress(checkoutAddress(customer));
    await checkout.continue();
    await checkout.shippingAddressSelect().waitFor({ state: 'visible' });
    await checkout.continue();
    await expect(checkout.shippingOptions().first()).toBeVisible();
    await checkout.selectFirstShippingOption();
    await checkout.continue();
    await expect(checkout.paymentOptions().first()).toBeVisible();
  });

  test('30 - Complete a guest order', async ({ page }) => {
    const customer = newCustomer('guest-order');
    await addSimpleComputer(page);
    const checkout = await beginGuestCheckout(page, checkoutAddress(customer));
    await proceedShippingAndPayment(checkout);
    await expect(checkout.confirmOrderButton()).toBeVisible();
    await checkout.confirmOrderButton().click();

    await expect(checkout.orderCompletedMessage()).toBeVisible();
    await expect(checkout.orderNumber()).toBeVisible();
  });
});
