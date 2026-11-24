import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
}

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  guestCheckoutButton() {
    return this.page.getByRole('button', { name: /Checkout as Guest/i });
  }

  async fillBillingAddress(details: CheckoutAddress): Promise<void> {
    await this.page.locator('#BillingNewAddress_FirstName').fill(details.firstName);
    await this.page.locator('#BillingNewAddress_LastName').fill(details.lastName);
    await this.page.locator('#BillingNewAddress_Email').fill(details.email);
    await this.page.locator('#BillingNewAddress_CountryId').selectOption({ label: details.country });
    await this.selectStateProvince('#BillingNewAddress_StateProvinceId');
    await this.page.locator('#BillingNewAddress_City').fill(details.city);
    await this.page.locator('#BillingNewAddress_Address1').fill(details.address);
    await this.page.locator('#BillingNewAddress_ZipPostalCode').fill(details.postalCode);
    await this.page.locator('#BillingNewAddress_PhoneNumber').fill(details.phone);
  }

  async fillShippingAddress(details: CheckoutAddress): Promise<void> {
    await this.page.locator('#ShippingNewAddress_FirstName').fill(details.firstName);
    await this.page.locator('#ShippingNewAddress_LastName').fill(details.lastName);
    await this.page.locator('#ShippingNewAddress_Email').fill(details.email);
    await this.page.locator('#ShippingNewAddress_CountryId').selectOption({ label: details.country });
    await this.selectStateProvince('#ShippingNewAddress_StateProvinceId');
    await this.page.locator('#ShippingNewAddress_City').fill(details.city);
    await this.page.locator('#ShippingNewAddress_Address1').fill(details.address);
    await this.page.locator('#ShippingNewAddress_ZipPostalCode').fill(details.postalCode);
    await this.page.locator('#ShippingNewAddress_PhoneNumber').fill(details.phone);
  }

  continueButton() {
    return this.page
      .locator('button:visible:has-text("Continue"), input[type="button"][value="Continue"]:visible:enabled')
      .last();
  }

  shippingAddressFirstName() {
    return this.page.locator('#ShippingNewAddress_FirstName');
  }

  shippingAddressSelect() {
    return this.page.getByRole('combobox', {
      name: /Select a shipping address from your address book or enter a new address/i,
    });
  }

  shippingOptions() {
    return this.page.locator('input[name="shippingoption"]');
  }

  paymentOptions() {
    return this.page.locator('input[name="paymentmethod"]');
  }

  confirmOrderButton() {
    return this.page.getByRole('button', { name: /Confirm/i });
  }

  orderCompletedMessage() {
    return this.page.getByText(/Your order has been successfully processed/i);
  }

  orderNumber() {
    return this.page.getByText(/Order number:\s*\d+/i);
  }

  stageHeading(name: string) {
    return this.page.getByRole('heading', { name: new RegExp(name, 'i') });
  }

  async continue(): Promise<void> {
    await this.continueButton().click();
  }

  async selectFirstShippingOption(): Promise<void> {
    await this.shippingOptions().first().check();
  }

  async selectFirstPaymentOption(): Promise<void> {
    await this.paymentOptions().first().check();
  }

  async continueGuestCheckout(): Promise<void> {
    if (await this.guestCheckoutButton().isVisible().catch(() => false)) {
      await this.guestCheckoutButton().click();
    }
  }

  private async selectStateProvince(selector: string): Promise<void> {
    const state = this.page.locator(selector);
    if (await state.isVisible()) {
      await state.getByRole('option', { name: 'New York', exact: true }).waitFor({ state: 'attached' });
      await state.selectOption({ label: 'New York' });
    }
  }
}
