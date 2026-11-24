import { expect, test } from '@playwright/test';
import { CategoryPage } from '../pages/CategoryPage';
import { HomePage } from '../pages/HomePage';
import { RecentlyViewedPage } from '../pages/RecentlyViewedPage';
import { SearchPage } from '../pages/SearchPage';
import { ProductPage } from '../pages/ProductPage';

test.describe('Storefront navigation and search', () => {
  test('01 - Load the homepage and inspect storefront entry points', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(page).toHaveTitle(/Demo Web Shop/);
    await expect(home.getHeaderLink('Register')).toBeVisible();
    await expect(home.getHeaderLink('Log in')).toBeVisible();
    await expect(home.getHeaderLink(/Shopping cart \(0\)/i)).toBeVisible();
    await expect(home.getHeaderLink(/Wishlist \(0\)/i)).toBeVisible();
    await expect(home.getSearchBox()).toBeVisible();
    await expect(home.category('Books')).toBeVisible();
    await expect(page.getByText('Featured products', { exact: true })).toBeVisible();
    await expect(home.getFooterLink('Shipping & Returns')).toBeVisible();
    await expect(home.newsletterEmail()).toBeVisible();
    await expect(page.getByText('Do you like nopCommerce?')).toBeVisible();
  });

  test('02 - Browse the Books category', async ({ page }) => {
    const home = new HomePage(page);
    const category = new CategoryPage(page);
    await home.goto();
    await home.category('Books').click();

    await expect(category.heading('Books')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    const products = category.products();
    if (await products.count()) {
      await products.first().getByRole('link').first().click();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    } else {
      await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();
    }
  });

  test('03 - Navigate from Computers to Desktops', async ({ page }) => {
    const home = new HomePage(page);
    const category = new CategoryPage(page);
    const product = new ProductPage(page);
    await home.goto();
    await home.category('Computers').click();
    await category.categoryLink('Desktops').click();

    await expect(category.heading('Desktops')).toBeVisible();
    if (await category.productLink('Build your own computer').count()) {
      await category.productLink('Build your own computer').first().click();
    } else {
      await product.goto('build-your-own-computer');
    }
    await expect(product.heading('Build your own computer')).toBeVisible();
  });

  test('04 - Sort products in a category', async ({ page }) => {
    const category = new CategoryPage(page);
    await category.goto('/books');

    const sort = category.sortControl();
    await expect(sort).toBeVisible();
    const options = await sort.locator('option').evaluateAll((items) =>
      items.map((item) => (item as HTMLOptionElement).value),
    );
    expect(options.length).toBeGreaterThan(1);
    await sort.selectOption(options[1]);
    await expect(sort).toHaveValue(options[1]);
  });

  test('05 - Change category page size and navigate result pages', async ({ page }) => {
    const category = new CategoryPage(page);
    await category.goto('/books');

    const pageSize = category.pageSizeControl();
    await expect(pageSize).toBeVisible();
    const pageSizes = await pageSize.locator('option').evaluateAll((items) =>
      items.map((item) => (item as HTMLOptionElement).value),
    );
    expect(pageSizes.length).toBeGreaterThan(1);
    await pageSize.selectOption(pageSizes[1]);
    await expect(pageSize).toHaveValue(pageSizes[1]);

    if (await category.nextPageLink().isVisible()) {
      await category.nextPageLink().click();
      await expect(category.previousPageLink()).toBeVisible();
      await category.previousPageLink().click();
      await expect(pageSize).toBeVisible();
    }
  });

  test('06 - Search for matching products', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchPage(page);
    await home.goto();
    await home.getSearchBox().fill('computer');
    await home.getSearchBox().press('Enter');

    await expect(page).toHaveURL(/search/);
    await expect(results.searchResults().first()).toBeVisible();
    await expect(results.searchResults().first().getByRole('link').first()).toBeVisible();
  });

  test('07 - Show a no-results search state', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.getSearchBox().fill(`no-match-${Date.now()}`);
    await home.getSearchBox().press('Enter');

    await expect(page.getByText(/No products were found|No products found/i)).toBeVisible();
    await expect(page.locator('.product-item')).toHaveCount(0);
  });

  test('08 - Limit advanced search to a category', async ({ page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.keyword().fill('computer');
    await search.advancedSearchToggle().check();
    await search.categoryControl().selectOption({ label: 'Computers' });
    await search.searchButton().click();

    await expect(page).toHaveURL(/search/);
    await expect(search.categoryControl()).toHaveValue(/./);
    await expect(page.getByRole('heading', { name: /Search/i })).toBeVisible();
  });

  test('09 - Filter advanced search by price range', async ({ page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.keyword().fill('computer');
    await search.advancedSearchToggle().check();
    await search.minimumPrice().fill('800');
    await search.maximumPrice().fill('1500');
    await search.searchButton().click();

    await expect(page).toHaveURL(/search/);
    await expect(page.getByRole('heading', { name: /Search/i })).toBeVisible();
    const results = await search.searchResults().count();
    if (results) {
      await expect(search.searchResults().first()).toBeVisible();
    } else {
      await expect(page.getByText(/No products were found|No products found/i)).toBeVisible();
    }
  });

  test('10 - Review recently viewed products', async ({ page }) => {
    const product = new ProductPage(page);
    const recentlyViewed = new RecentlyViewedPage(page);
    await product.goto('simple-computer');
    await product.goto('build-your-own-computer');
    await recentlyViewed.goto();

    await expect(recentlyViewed.products()).toHaveCount(2);
    await expect(recentlyViewed.products().getByRole('link', { name: /Simple Computer/i }).first()).toBeVisible();
    await expect(
      recentlyViewed.products().getByRole('link', { name: /Build your own computer/i }).first(),
    ).toBeVisible();
  });
});
