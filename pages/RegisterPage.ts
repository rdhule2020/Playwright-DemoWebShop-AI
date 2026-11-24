import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/register');
  }

  gender(name: 'Male' | 'Female') {
    return this.page.getByLabel(name);
  }

  firstName() {
    return this.page.locator('#FirstName');
  }

  lastName() {
    return this.page.locator('#LastName');
  }

  email() {
    return this.page.locator('#Email');
  }

  password() {
    return this.page.locator('#Password');
  }

  confirmPassword() {
    return this.page.locator('#ConfirmPassword');
  }

  submitButton() {
    return this.page.getByRole('button', { name: 'Register', exact: true });
  }

  async fill(details: CustomerDetails, confirmation = details.password): Promise<void> {
    await this.gender('Female').check();
    await this.firstName().fill(details.firstName);
    await this.lastName().fill(details.lastName);
    await this.email().fill(details.email);
    await this.password().fill(details.password);
    await this.confirmPassword().fill(confirmation);
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }
}
