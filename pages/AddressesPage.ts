import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface AddressDetails {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
}

export class AddressesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/customer/addresses');
  }

  addNewButton() {
    return this.page.getByRole('button', { name: /Add new/i });
  }

  addressRows() {
    return this.page.locator('.address-item');
  }

  firstName() {
    return this.page.locator('#Address_FirstName');
  }

  lastName() {
    return this.page.locator('#Address_LastName');
  }

  email() {
    return this.page.locator('#Address_Email');
  }

  country() {
    return this.page.locator('#Address_CountryId');
  }

  city() {
    return this.page.locator('#Address_City');
  }

  address() {
    return this.page.locator('#Address_Address1');
  }

  postalCode() {
    return this.page.locator('#Address_ZipPostalCode');
  }

  phone() {
    return this.page.locator('#Address_PhoneNumber');
  }

  saveButton() {
    return this.page.getByRole('button', { name: /Save/i });
  }

  editButtons() {
    return this.page.getByRole('button', { name: /Edit/i });
  }

  deleteButtons() {
    return this.page.getByRole('button', { name: /Delete/i });
  }

  async fill(details: AddressDetails): Promise<void> {
    await this.firstName().fill(details.firstName);
    await this.lastName().fill(details.lastName);
    await this.email().fill(details.email);
    await this.country().selectOption({ label: details.country });
    await this.city().fill(details.city);
    await this.address().fill(details.address);
    await this.postalCode().fill(details.postalCode);
    await this.phone().fill(details.phone);
  }
}
