import { expect, test } from '@playwright/test';
import { ContactUsPage } from '../pages/ContactUsPage';
import { HomePage } from '../pages/HomePage';
import { InformationPage } from '../pages/InformationPage';

test.describe('Customer services and saved account data', () => {
  test('45 - Subscribe to the newsletter', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.newsletterEmail().fill(`newsletter-${Date.now()}@example.com`);
    await home.subscribeButton().click();

    await expect(home.newsletterResult()).toContainText(/Thank you|successfully/i);
  });

  test('46 - Validate newsletter email', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.newsletterEmail().fill('invalid-email');
    await home.subscribeButton().click();

    await expect(home.newsletterResult()).toContainText(/valid email|wrong email|invalid/i);
  });

  test('47 - Vote in the community poll', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.selectFirstPollOption();
    await expect(home.pollOptions().first()).toBeChecked();
    await home.vote();

    await expect(home.poll()).toBeVisible();
  });

  test('48 - Submit a customer contact enquiry', async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await contact.submit(
      'Demo Web Shop Test',
      `contact-${Date.now()}@example.com`,
      'Please share more information about the demo store.',
    );

    await expect(page.getByText(/Your enquiry has been successfully sent/i)).toBeVisible();
  });

  test('49 - Validate the contact enquiry form', async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await contact.submit('', 'not-an-email', '');

    await expect(page.getByText(/Enter your name/i)).toBeVisible();
    await expect(page.getByText(/Wrong email/i)).toBeVisible();
    await expect(page.getByText(/Enter enquiry/i)).toBeVisible();
  });

  test('50 - Read shipping and privacy information', async ({ page }) => {
    const information = new InformationPage(page);
    await information.goto('/shipping-returns');
    await expect(information.heading('Shipping & Returns')).toBeVisible();
    await expect(page.locator('.page-body')).not.toBeEmpty();

    await information.goto('/privacy-policy');
    await expect(information.heading('Privacy policy')).toBeVisible();
    await expect(page.locator('.page-body')).not.toBeEmpty();
    await information.getHeaderLink('Tricentis Demo Web Shop').click();
    await expect(page).toHaveURL('/');
  });
});
