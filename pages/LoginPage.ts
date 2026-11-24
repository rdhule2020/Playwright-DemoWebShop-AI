import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/login');
  }

  email() {
    return this.page.locator('#Email');
  }

  password() {
    return this.page.locator('#Password');
  }

  rememberMe() {
    return this.page.getByLabel('Remember me?');
  }

  submitButton() {
    return this.page.getByRole('button', { name: 'Log in', exact: true });
  }

  forgotPasswordLink() {
    return this.page.getByRole('link', { name: /Forgot password/i });
  }

  async logout(): Promise<void> {
    await this.getHeaderLink('Log out').click();
  }

  async openForgotPassword(): Promise<void> {
    await this.forgotPasswordLink().click();
  }

  async login(email: string, password: string, remember = false): Promise<void> {
    await this.email().fill(email);
    await this.password().fill(password);
    if (remember) {
      await this.rememberMe().check();
    }
    await this.submitButton().click();
  }
}
