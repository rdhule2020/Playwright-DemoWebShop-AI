import { Page } from '@playwright/test';
import { AddressDetails } from '../../pages/AddressesPage';
import { CheckoutAddress } from '../../pages/CheckoutPage';
import { CustomerDetails, RegisterPage } from '../../pages/RegisterPage';

const password = 'DemoPass123!';

export function newCustomer(prefix = 'shopper'): CustomerDetails {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    firstName: 'Test',
    lastName: 'Shopper',
    email: `${prefix}-${suffix}@example.com`,
    password,
  };
}

export function newAddress(customer: CustomerDetails): AddressDetails {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    country: 'United States',
    city: 'New York',
    address: '123 Test Street',
    postalCode: '10001',
    phone: '2125550100',
  };
}

export function checkoutAddress(customer: CustomerDetails): CheckoutAddress {
  return newAddress(customer);
}

export async function registerCustomer(page: Page, customer: CustomerDetails): Promise<void> {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  await registerPage.fill(customer);
  await registerPage.submit();
}
