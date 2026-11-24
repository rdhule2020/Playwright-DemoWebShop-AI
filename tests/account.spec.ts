import { expect, test } from '@playwright/test';
import { AddressesPage } from '../pages/AddressesPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CustomerInfoPage } from '../pages/CustomerInfoPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { OrdersPage } from '../pages/OrdersPage';
import { RegisterPage } from '../pages/RegisterPage';
import { checkoutAddress, newAddress, newCustomer, registerCustomer } from './support/testData';
import { addSimpleComputer, proceedShippingAndPayment } from './support/storeActions';

test.describe('Account and order management', () => {
  test('31 - Register a new customer account', async ({ page }) => {
    const customer = newCustomer('register');
    const register = new RegisterPage(page);
    await register.goto();
    await register.fill(customer);
    await register.submit();

    await expect(page.getByText(/Your registration completed/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
  });

  test('32 - Validate required registration fields', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();
    await register.submit();

    await expect(page.getByText(/First name is required/i)).toBeVisible();
    await expect(page.getByText(/Last name is required/i)).toBeVisible();
    await expect(page.getByText(/Email is required/i)).toBeVisible();
    await expect(page.getByText(/Password is required/i)).toHaveCount(2);
    await expect(page.getByText(/Password is required/i).first()).toBeVisible();
    await expect(page.getByText(/Password is required/i).last()).toBeVisible();
  });

  test('33 - Reject invalid registration email', async ({ page }) => {
    const register = new RegisterPage(page);
    const customer = newCustomer('invalid-email');
    await register.goto();
    await register.fill({ ...customer, email: 'not-an-email' });
    await register.submit();

    await expect(page.getByText(/Wrong email|valid email/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out' })).toHaveCount(0);
  });

  test('34 - Reject mismatched registration passwords', async ({ page }) => {
    const register = new RegisterPage(page);
    const customer = newCustomer('password-mismatch');
    await register.goto();
    await register.fill(customer, `${customer.password}different`);
    await register.submit();

    await expect(page.getByText(/The password and confirmation password do not match/i)).toBeVisible();
    await expect(register.password()).toBeVisible();
  });

  test('35 - Reject an already-registered email', async ({ page }) => {
    const register = new RegisterPage(page);
    const customer = newCustomer('duplicate');
    await register.goto();
    await register.fill(customer);
    await register.submit();
    await expect(page.getByText(/Your registration completed/i)).toBeVisible();

    await register.goto();
    await register.fill(customer);
    await register.submit();
    await expect(page.getByText(/already exists|already registered/i)).toBeVisible();
  });

  test('36 - Sign in with valid credentials', async ({ page }) => {
    const customer = newCustomer('valid-login');
    await registerCustomer(page, customer);
    const login = new LoginPage(page);
    await login.logout();
    await login.goto();
    await login.login(customer.email, customer.password);

    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My account' })).toBeVisible();
  });

  test('37 - Reject invalid login credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(`unknown-${Date.now()}@example.com`, 'WrongPass123!');

    await expect(page.getByText(/unsuccessful|incorrect|not registered/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  });

  test('38 - Retain login when Remember me is selected', async ({ page }) => {
    const customer = newCustomer('remember');
    await registerCustomer(page, customer);
    const login = new LoginPage(page);
    await login.logout();
    await login.goto();
    await login.login(customer.email, customer.password, true);
    await page.goto('/');
    await page.reload();

    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
  });

  test('39 - Request a password reset', async ({ page }) => {
    const customer = newCustomer('forgot-password');
    await registerCustomer(page, customer);
    const login = new LoginPage(page);
    await login.logout();
    await login.goto();
    await login.openForgotPassword();
    const recovery = new ForgotPasswordPage(page);
    await recovery.requestReset(customer.email);

    await expect(page.getByText(/email with instructions|email has been sent|If an account/i)).toBeVisible();
  });

  test('40 - Update customer profile details', async ({ page }) => {
    const customer = newCustomer('profile');
    await registerCustomer(page, customer);
    const profile = new CustomerInfoPage(page);
    await profile.goto();
    const updatedFirstName = 'Updated';
    const updatedLastName = `Shopper${Date.now()}`;
    await profile.updateName(updatedFirstName, updatedLastName);
    await page.reload();

    await expect(profile.firstName()).toHaveValue(updatedFirstName);
    await expect(profile.lastName()).toHaveValue(updatedLastName);
  });

  test('41 - Add an address to the account', async ({ page }) => {
    const customer = newCustomer('address-add');
    await registerCustomer(page, customer);
    const addresses = new AddressesPage(page);
    await addresses.goto();
    await addresses.addNewButton().click();
    const address = newAddress(customer);
    await addresses.fill(address);
    await addresses.saveButton().click();

    await expect(addresses.addressRows()).toContainText(address.address);
    await expect(addresses.addressRows()).toContainText(address.city);
  });

  test('42 - Edit a saved address', async ({ page }) => {
    const customer = newCustomer('address-edit');
    await registerCustomer(page, customer);
    const addresses = new AddressesPage(page);
    await addresses.goto();
    await addresses.addNewButton().click();
    await addresses.fill(newAddress(customer));
    await addresses.saveButton().click();
    await addresses.editButtons().first().click();
    const updatedCity = `City${Date.now()}`;
    await addresses.city().fill(updatedCity);
    await addresses.saveButton().click();

    await expect(addresses.addressRows()).toContainText(updatedCity);
  });

  test('43 - Delete a saved address', async ({ page }) => {
    const customer = newCustomer('address-delete');
    await registerCustomer(page, customer);
    const addresses = new AddressesPage(page);
    await addresses.goto();
    await addresses.addNewButton().click();
    await addresses.fill(newAddress(customer));
    await addresses.saveButton().click();
    await expect(addresses.addressRows()).toHaveCount(1);
    page.once('dialog', async (dialog) => dialog.accept());
    const deleteRequest = page.waitForRequest((request) => /\/customer\/addressdelete\//.test(request.url()));
    await addresses.deleteButtons().first().evaluate((button: HTMLInputElement) => button.click());
    await deleteRequest;
    const verificationPage = await page.context().newPage();
    const verificationAddresses = new AddressesPage(verificationPage);
    await verificationAddresses.goto();
    await expect(verificationAddresses.addressRows()).toHaveCount(0, { timeout: 15000 });
    await verificationPage.close();
  });

  test('44 - View order history and order details', async ({ page }) => {
    const customer = newCustomer('order-history');
    await registerCustomer(page, customer);
    await addSimpleComputer(page);
    const cart = new CartPage(page);
    await cart.goto();
    await cart.termsCheckbox().check();
    await cart.checkoutButton().click();

    const checkout = new CheckoutPage(page);
    await checkout.fillBillingAddress(checkoutAddress(customer));
    await checkout.continue();
    await proceedShippingAndPayment(checkout);
    await checkout.confirmOrderButton().click();
    await expect(checkout.orderCompletedMessage()).toBeVisible();

    const orders = new OrdersPage(page);
    await orders.goto();
    await expect(orders.orderRows()).toHaveCount(1);
    await orders.detailsButtons().first().click();
    await expect(page.getByText('Simple Computer')).toBeVisible();
    await expect(orders.orderTotal()).toBeVisible();
  });
});
