import { expect, test } from '@playwright/test';
import { ComparePage } from '../pages/ComparePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductEmailPage } from '../pages/ProductEmailPage';
import { ProductPage } from '../pages/ProductPage';
import { ProductTagPage } from '../pages/ProductTagPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ReviewPage } from '../pages/ReviewPage';
import { WishlistPage } from '../pages/WishlistPage';
import { newCustomer, registerCustomer } from './support/testData';

test.describe('Product details and product lists', () => {
  test('11 - Inspect product details and availability', async ({ page }) => {
    const product = new ProductPage(page);
    await product.goto('simple-computer');

    await expect(product.heading('Simple Computer')).toBeVisible();
    await expect(product.price()).toBeVisible();
    await expect(page.getByText(/Availability:/)).toBeVisible();
    await expect(page.getByText(/Free shipping/i)).toBeVisible();
    await expect(page.getByText(/Simple/).first()).toBeVisible();
    await expect(product.reviewLink()).toBeVisible();
    await expect(product.quantity()).toHaveValue('1');
    await expect(product.addToCartButton()).toBeVisible();
  });

  test('12 - Configure a computer and verify its price', async ({ page }) => {
    const product = new ProductPage(page);
    await product.goto('build-your-own-computer');

    await product.selectComputerConfiguration();
    await expect(product.optionSelects().nth(0)).toHaveValue(/./);
    await expect(product.optionSelects().nth(1)).toHaveValue(/./);
    await expect(product.optionRadio('19')).toBeChecked();
    await expect(product.optionRadio('21')).toBeChecked();
    await product.addToCart();
    await page.goto('/cart');
    const configuredComputer = page.locator('.cart-item-row').filter({ hasText: 'Build your own computer' });
    await expect(configuredComputer).toContainText('1435.00');
  });

  test('13 - Set product quantity before adding', async ({ page }) => {
    const product = new ProductPage(page);
    await product.goto('simple-computer');
    await product.selectDefaultRadioOptions();
    await product.setQuantity(2);
    await product.addToCart();

    await expect(page.getByRole('link', { name: /Shopping cart \(2\)/i })).toBeVisible();
  });

  test('14 - Add a product to the cart from its detail page', async ({ page }) => {
    const product = new ProductPage(page);
    await product.goto('simple-computer');
    await product.selectDefaultRadioOptions();
    await product.addToCart();

    await expect(page.getByRole('link', { name: /Shopping cart \(1\)/i })).toBeVisible();
    await page.goto('/cart');
    await expect(page.locator('.cart-item-row')).toContainText('Simple Computer');
  });

  test('15 - Add a product to the wishlist', async ({ page }) => {
    const product = new ProductPage(page);
    const wishlist = new WishlistPage(page);
    await product.goto('25-virtual-gift-card');
    await product.giftCardRecipientName().fill('Wishlist Recipient');
    await product.giftCardRecipientEmail().fill('recipient@example.com');
    await product.giftCardSenderName().fill('Test Shopper');
    await product.giftCardSenderEmail().fill('shopper@example.com');
    await product.addToWishlist();
    await wishlist.goto();

    await expect(wishlist.productRows()).toContainText('$25 Virtual Gift Card');
  });

  test('16 - Compare two products', async ({ page }) => {
    const product = new ProductPage(page);
    const compare = new ComparePage(page);
    await product.goto('simple-computer');
    await product.addToCompare();
    await product.goto('build-your-own-computer');
    await product.addToCompare();
    await compare.goto();

    await expect(compare.comparisonTable()).toContainText('Simple Computer');
    await expect(compare.comparisonTable()).toContainText('Build your own computer');
  });

  test('17 - Use Email a friend on a product', async ({ page }) => {
    const product = new ProductPage(page);
    const emailPage = new ProductEmailPage(page);
    await product.goto('simple-computer');
    await product.openEmailFriend();

    await expect(page.getByRole('heading', { name: /Email a friend/i })).toBeVisible();
    await expect(emailPage.friendEmail()).toBeVisible();
    await expect(emailPage.personalMessage()).toBeVisible();
    await emailPage.friendEmail().fill('friend@example.com');
    await emailPage.senderEmail().fill('shopper@example.com');
    await emailPage.personalMessage().fill('Thought you might like this product.');
    await emailPage.sendButton().click();
    await expect(page.getByText(/Only registered customers can use email a friend feature/i)).toBeVisible();

    const customer = newCustomer('email-friend');
    await registerCustomer(page, customer);
    await product.goto('simple-computer');
    await product.openEmailFriend();
    await emailPage.friendEmail().fill('friend@example.com');
    await emailPage.senderEmail().fill(customer.email);
    await emailPage.personalMessage().fill('Thought you might like this product.');
    await emailPage.sendButton().click();
    await expect(page.getByText(/Your message has been sent\./i)).toBeVisible();
  });

  test('18 - Open the product review form', async ({ page }) => {
    const product = new ProductPage(page);
    const review = new ReviewPage(page);
    await product.goto('simple-computer');
    await product.reviewLink().click();

    await expect(page.getByRole('heading', { name: /Product reviews for Simple Computer/i })).toBeVisible();
    await expect(page.getByText(/Only registered users can write reviews/i)).toBeVisible();

    const customer = newCustomer('review');
    await registerCustomer(page, customer);
    await review.goto(75);
    await expect(review.reviewTitle()).toBeVisible();
    await expect(review.reviewText()).toBeVisible();
    await expect(review.rating(5)).toBeVisible();
  });

  test('19 - Browse products through a product tag', async ({ page }) => {
    const product = new ProductPage(page);
    const tagPage = new ProductTagPage(page);
    await product.goto('simple-computer');
    await product.productTag('computer').click();

    await expect(tagPage.heading('computer')).toBeVisible();
    await expect(tagPage.products().first()).toBeVisible();
  });

  test('20 - Inspect a virtual gift card product', async ({ page }) => {
    const product = new ProductPage(page);
    await product.goto('25-virtual-gift-card');

    await expect(product.heading('$25 Virtual Gift Card')).toBeVisible();
    await expect(product.price()).toContainText('25');
    await expect(product.giftCardRecipientName()).toBeVisible();
    await expect(product.giftCardRecipientEmail()).toBeVisible();
    await product.giftCardRecipientName().fill('Gift Recipient');
    await product.giftCardRecipientEmail().fill('recipient@example.com');
    await product.giftCardSenderName().fill('Test Shopper');
    await product.giftCardSenderEmail().fill('shopper@example.com');
    await product.addToCart();
    await expect(page.getByRole('link', { name: /Shopping cart \(1\)/i })).toBeVisible();
  });
});
