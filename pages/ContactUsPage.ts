import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactUsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/contactus');
  }

  name() {
    return this.page.locator('#FullName');
  }

  email() {
    return this.page.locator('#Email');
  }

  enquiry() {
    return this.page.locator('#Enquiry');
  }

  submitButton() {
    return this.page.getByRole('button', { name: 'Submit', exact: true });
  }

  async submit(name: string, email: string, enquiry: string): Promise<void> {
    await this.name().fill(name);
    await this.email().fill(email);
    await this.enquiry().fill(enquiry);
    await this.submitButton().click();
  }
}
