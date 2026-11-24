# Demo Web Shop — 50 Core User Operations

## Application Overview

A user-interface test plan for https://demowebshop.tricentis.com/, based on exploration of the live storefront. The site exposes top-level product categories (Books, Computers, Electronics, Apparel & Shoes, Digital downloads, Jewelry, Gift Cards), global and advanced search, product pages with options and product actions, cart and wishlist, account registration/login, checkout, reviews, and customer-support features. Run each scenario independently in a fresh browser state unless stated otherwise. Use unique synthetic email addresses for registration, contact, and guest checkout; do not rely on email delivery. For authenticated scenarios, create and sign in to a fresh test account as part of setup. The live review UI states that only registered users can write reviews.

## Test Scenarios

### 1. Storefront navigation and search

**Seed:** `tests/seed.spec.ts`

#### 1.1. 01 - Load the homepage and inspect storefront entry points

**File:** `tests/storefront/01-homepage.spec.ts`

**Steps:**
  1. Open https://demowebshop.tricentis.com/ in a fresh session.
    - expect: The Demo Web Shop homepage loads without an error page.
    - expect: The header shows Register, Log in, Shopping cart (0), Wishlist (0), and the store search box.
    - expect: The primary product-category navigation and featured-products section are visible.
  2. Inspect the footer links and homepage customer widgets.
    - expect: Information and Customer service links are available.
    - expect: Newsletter sign-up and the community poll are visible on the homepage.

#### 1.2. 02 - Browse the Books category

**File:** `tests/storefront/02-browse-books.spec.ts`

**Steps:**
  1. From the homepage, open Books in the primary navigation.
    - expect: The Books category page opens with a Books heading and a Home breadcrumb.
    - expect: Book-category products or the category's empty-state content is rendered.
  2. Open a book item from the category if products are listed.
    - expect: The selected product detail page opens and identifies the chosen product.

#### 1.3. 03 - Navigate from Computers to Desktops

**File:** `tests/storefront/03-browse-computer-subcategory.spec.ts`

**Steps:**
  1. Open Computers from the primary navigation, then choose Desktops.
    - expect: The desktop category page opens with the expected breadcrumb hierarchy.
    - expect: Desktop products are displayed with product names and prices.
  2. Open Build your own computer from the desktop products.
    - expect: The product detail page identifies Build your own computer.

#### 1.4. 04 - Sort products in a category

**File:** `tests/storefront/04-sort-category.spec.ts`

**Steps:**
  1. Open a populated product category and select a different available value in the Sort by control.
    - expect: The category refreshes or reorders its products according to the selected sort option.
    - expect: The chosen sort option remains selected after results update.

#### 1.5. 05 - Change category page size and navigate result pages

**File:** `tests/storefront/05-category-page-size-and-pagination.spec.ts`

**Steps:**
  1. Open a category with enough products and change the Number of items per page control.
    - expect: The listing updates to the selected page size where supported.
    - expect: Page navigation controls remain usable when the result set spans multiple pages.
  2. Open the next result page and return to the previous page.
    - expect: The selected page's products are shown and navigation returns to the preceding result page.

#### 1.6. 06 - Search for matching products

**File:** `tests/storefront/06-search-matching-products.spec.ts`

**Steps:**
  1. Enter a known term such as computer in the header Search store field and submit the search.
    - expect: Search results include matching products such as computer products.
    - expect: Each result exposes a product link and price.

#### 1.7. 07 - Show a no-results search state

**File:** `tests/storefront/07-search-no-matches.spec.ts`

**Steps:**
  1. Search for a distinctive term that does not match any catalog item.
    - expect: The search results page reports that no products were found.
    - expect: No unrelated product is presented as a matching result.

#### 1.8. 08 - Limit advanced search to a category

**File:** `tests/storefront/08-advanced-search-category.spec.ts`

**Steps:**
  1. Open Search from Customer service, enter a known product keyword, enable Advanced search, and choose a relevant category.
    - expect: The advanced search controls expose category selection.
    - expect: Submitted results are limited to products matching the keyword and selected category.

#### 1.9. 09 - Filter advanced search by price range

**File:** `tests/storefront/09-advanced-search-price-range.spec.ts`

**Steps:**
  1. On the Search page, enable Advanced search, enter a product keyword, and set a valid minimum and maximum price.
    - expect: Results meet the requested keyword and price bounds.
    - expect: The search page shows a clear no-results state if the range has no matching product.

#### 1.10. 10 - Review recently viewed products

**File:** `tests/storefront/10-recently-viewed-products.spec.ts`

**Steps:**
  1. Open two different product detail pages in the same fresh session.
    - expect: Each product detail page opens successfully.
  2. Open Recently viewed products from Customer service.
    - expect: The recently viewed products page lists the products visited in the session.
    - expect: Each listed product links to its detail page.

### 2. Product details and product lists

**Seed:** `tests/seed.spec.ts`

#### 2.1. 11 - Inspect product details and availability

**File:** `tests/products/11-product-details.spec.ts`

**Steps:**
  1. Open the Simple Computer product detail page.
    - expect: The page shows the product name, price, availability, shipping information, description, and review link.
    - expect: The quantity and Add to cart controls are present.

#### 2.2. 12 - Configure a computer and verify its price

**File:** `tests/products/12-configure-product-options.spec.ts`

**Steps:**
  1. Open Build your own computer and select non-default processor, RAM, hard-drive, operating-system, and optional software values.
    - expect: The selected options are visibly retained.
    - expect: The displayed total price updates to reflect the selected paid options.
  2. Change one selected option back to its default.
    - expect: The price is recalculated and the option selection reflects the change.

#### 2.3. 13 - Set product quantity before adding

**File:** `tests/products/13-product-quantity.spec.ts`

**Steps:**
  1. Open a product page, enter a quantity greater than one, and add the product to the cart.
    - expect: The product is added with the requested quantity.
    - expect: The cart quantity or cart line item reflects the requested amount.

#### 2.4. 14 - Add a product to the cart from its detail page

**File:** `tests/products/14-add-product-to-cart.spec.ts`

**Steps:**
  1. Open a purchasable product, complete any required product selections, and select Add to cart.
    - expect: A success notification is shown or the cart count updates.
    - expect: The cart contains the selected product with its chosen options and quantity.

#### 2.5. 15 - Add a product to the wishlist

**File:** `tests/products/15-add-product-to-wishlist.spec.ts`

**Steps:**
  1. Open a product detail page and select Add to wishlist.
    - expect: A success notification is shown or the wishlist count updates.
    - expect: The product appears on the wishlist page.

#### 2.6. 16 - Compare two products

**File:** `tests/products/16-compare-products.spec.ts`

**Steps:**
  1. Add two different products to the compare list using their product actions.
    - expect: Each action reports success or otherwise confirms the item was added.
  2. Open Compare products list.
    - expect: The comparison table contains both selected products and their product attributes.
    - expect: The list can be cleared or the products can be removed.

#### 2.7. 17 - Use Email a friend on a product

**File:** `tests/products/17-email-product-to-friend.spec.ts`

**Steps:**
  1. Open a product and select Email a friend.
    - expect: The friend-email form or sign-in requirement is displayed.
  2. Where the form is available, submit valid synthetic recipient and sender details with a brief message.
    - expect: A success confirmation is displayed, or the site clearly reports that sign-in is required.
    - expect: No message is reported as sent when required fields are missing or invalid.

#### 2.8. 18 - Open the product review form

**File:** `tests/products/18-product-review-access.spec.ts`

**Steps:**
  1. From a product page, open Add your review while signed out.
    - expect: The review page identifies the product and shows its review fields or registration/sign-in gate.
    - expect: The site communicates that only registered users can write reviews.
  2. Sign in with a fresh test account and revisit the review form.
    - expect: The review title, review text, and rating controls are available to the authenticated user.

#### 2.9. 19 - Browse products through a product tag

**File:** `tests/products/19-product-tag-navigation.spec.ts`

**Steps:**
  1. Open a product with tags and select a tag such as computer.
    - expect: The tag page opens and identifies the selected tag.
    - expect: Products associated with that tag are listed.

#### 2.10. 20 - Inspect a virtual gift card product

**File:** `tests/products/20-virtual-gift-card-details.spec.ts`

**Steps:**
  1. Open the featured $25 Virtual Gift Card product.
    - expect: The product detail page shows its denomination and price.
    - expect: Recipient name and recipient email fields are available for the virtual gift card.
  2. Enter valid synthetic recipient details and add the gift card to the cart.
    - expect: The configured gift card is added to the cart with the recipient details retained.

### 3. Shopping cart and checkout

**Seed:** `tests/seed.spec.ts`

#### 3.1. 21 - Verify header cart count after adding an item

**File:** `tests/checkout/21-cart-count-after-add.spec.ts`

**Steps:**
  1. Add one product to the cart from its product page.
    - expect: The header cart count changes from zero and reflects the added item.
  2. Open Shopping cart from the header.
    - expect: The cart contains the newly added product and its quantity.

#### 3.2. 22 - Update a cart line quantity

**File:** `tests/checkout/22-update-cart-quantity.spec.ts`

**Steps:**
  1. Add a product to the cart and open the cart page.
    - expect: The cart displays the product, unit price, quantity, and line total.
  2. Change the quantity and select Update shopping cart.
    - expect: The updated quantity is retained.
    - expect: The line total and cart subtotal are recalculated.

#### 3.3. 23 - Remove an item from the cart

**File:** `tests/checkout/23-remove-cart-item.spec.ts`

**Steps:**
  1. Add one product and open the cart.
    - expect: The cart contains the selected product.
  2. Select the product's remove control and update the cart if prompted.
    - expect: The product is removed and the cart count updates.
    - expect: An empty-cart message is shown when no items remain.

#### 3.4. 24 - Continue shopping from the cart

**File:** `tests/checkout/24-continue-shopping.spec.ts`

**Steps:**
  1. Add a product, open the cart, and select Continue shopping.
    - expect: The storefront or prior product-browsing context opens.
    - expect: The existing cart item remains in the cart.

#### 3.5. 25 - View the empty shopping cart

**File:** `tests/checkout/25-empty-cart-state.spec.ts`

**Steps:**
  1. Open Shopping cart with no products in a fresh session.
    - expect: The page shows Your Shopping Cart is empty!
    - expect: No item rows or checkout action are offered for an empty cart.

#### 3.6. 26 - Reject an invalid discount code

**File:** `tests/checkout/26-invalid-discount-code.spec.ts`

**Steps:**
  1. Add a product, open the cart, and enter a deliberately invalid discount coupon code.
    - expect: The site displays a clear invalid-code message.
    - expect: The cart total is not reduced by the invalid code.

#### 3.7. 27 - Require acceptance of checkout terms

**File:** `tests/checkout/27-require-terms-acceptance.spec.ts`

**Steps:**
  1. Add a product, open the cart, and attempt checkout without accepting the terms of service.
    - expect: Checkout is blocked and the user is prompted to accept the terms.
  2. Accept the terms and select Checkout.
    - expect: The checkout flow proceeds to the next required step.

#### 3.8. 28 - Enter billing details as a guest

**File:** `tests/checkout/28-guest-checkout-billing.spec.ts`

**Steps:**
  1. Add a shippable item, accept terms, select Checkout, and choose guest checkout when offered.
    - expect: The billing address form is displayed for the guest.
  2. Enter valid synthetic name, email, street, city, postal code, country, and phone details and continue.
    - expect: The billing address is accepted and checkout advances to shipping selection.

#### 3.9. 29 - Select a shipping method

**File:** `tests/checkout/29-select-shipping-method.spec.ts`

**Steps:**
  1. Begin guest checkout with a shippable cart item and complete valid billing and shipping addresses.
    - expect: Available shipping methods and their costs are displayed.
  2. Select a shipping method and continue.
    - expect: The selected shipping method is retained and checkout advances to payment selection.

#### 3.10. 30 - Complete a guest order

**File:** `tests/checkout/30-complete-guest-order.spec.ts`

**Steps:**
  1. Using a fresh cart and unique synthetic guest details, proceed through billing and shipping, then select an available payment method.
    - expect: The payment method is retained and checkout advances to order review or confirmation.
  2. Review the order and confirm it.
    - expect: An order completion confirmation and order number are displayed.
    - expect: The confirmation reflects the purchased item and final total.

### 4. Account and order management

**Seed:** `tests/seed.spec.ts`

#### 4.1. 31 - Register a new customer account

**File:** `tests/account/31-register-account.spec.ts`

**Steps:**
  1. Open Register, choose a gender, enter valid first and last names, a unique email address, and matching acceptable passwords, then submit.
    - expect: Registration succeeds with an account-created confirmation.
    - expect: The newly registered account is signed in or the site provides a clear next step.

#### 4.2. 32 - Validate required registration fields

**File:** `tests/account/32-registration-required-fields.spec.ts`

**Steps:**
  1. Open Register and submit the form with all required fields blank.
    - expect: The form does not create an account.
    - expect: Validation messages identify the required first name, last name, email, password, and confirmation fields.

#### 4.3. 33 - Reject invalid registration email

**File:** `tests/account/33-registration-invalid-email.spec.ts`

**Steps:**
  1. Complete the required registration fields but enter an invalid email address and submit.
    - expect: Registration is rejected with an email-format validation message.
    - expect: No account is created.

#### 4.4. 34 - Reject mismatched registration passwords

**File:** `tests/account/34-registration-password-mismatch.spec.ts`

**Steps:**
  1. Complete registration details with different Password and Confirm password values and submit.
    - expect: Registration is rejected with a password-mismatch message.
    - expect: The registration form remains available for correction.

#### 4.5. 35 - Reject an already-registered email

**File:** `tests/account/35-registration-duplicate-email.spec.ts`

**Steps:**
  1. Register a fresh test account, then submit another registration using the same email address.
    - expect: The duplicate registration is rejected with a clear email-already-used message.
    - expect: The existing account remains usable.

#### 4.6. 36 - Sign in with valid credentials

**File:** `tests/account/36-login-valid-credentials.spec.ts`

**Steps:**
  1. Create a fresh account, sign out, then open Log in and enter that account's valid email and password.
    - expect: Login succeeds and the account email or My account link is shown in the header.
    - expect: Authenticated account pages are accessible.

#### 4.7. 37 - Reject invalid login credentials

**File:** `tests/account/37-login-invalid-credentials.spec.ts`

**Steps:**
  1. Open Log in and submit an unknown email or incorrect password.
    - expect: Login is rejected with a clear error message.
    - expect: The user remains signed out and the login form stays available.

#### 4.8. 38 - Retain login when Remember me is selected

**File:** `tests/account/38-remember-me.spec.ts`

**Steps:**
  1. Sign in to a fresh test account with Remember me selected.
    - expect: Login succeeds.
  2. Navigate to another storefront page and reload the page.
    - expect: The session remains authenticated after navigation and reload.

#### 4.9. 39 - Request a password reset

**File:** `tests/account/39-forgot-password.spec.ts`

**Steps:**
  1. From Log in, open Forgot password, enter a registered test email, and submit.
    - expect: The site displays a password-reset request confirmation without exposing account credentials.
    - expect: The form validates malformed email addresses.

#### 4.10. 40 - Update customer profile details

**File:** `tests/account/40-edit-customer-profile.spec.ts`

**Steps:**
  1. Sign in to a fresh test account and open My account.
    - expect: The customer information page displays the account's profile fields.
  2. Change the first name, last name, or gender and save.
    - expect: A save confirmation is shown and the updated profile values persist after reload.

### 5. Customer services and saved account data

**Seed:** `tests/seed.spec.ts`

#### 5.1. 41 - Add an address to the account

**File:** `tests/account/41-add-address.spec.ts`

**Steps:**
  1. Sign in to a fresh test account, open Addresses, and choose Add new.
    - expect: An address form with name, address, country, postal code, and phone fields is displayed.
  2. Enter valid synthetic address details and save.
    - expect: The address appears in the account's saved address list.

#### 5.2. 42 - Edit a saved address

**File:** `tests/account/42-edit-address.spec.ts`

**Steps:**
  1. Create or select a saved address and choose Edit.
    - expect: The edit form is pre-populated with the saved address values.
  2. Change the city or postal code and save.
    - expect: The address list shows the updated value.

#### 5.3. 43 - Delete a saved address

**File:** `tests/account/43-delete-address.spec.ts`

**Steps:**
  1. Sign in and open Addresses with at least one saved test address.
    - expect: The saved address and its delete action are visible.
  2. Delete the test address and confirm if a confirmation is requested.
    - expect: The address is removed from the saved list.
    - observed: The demo site's delete route may redirect to a generic error page after removing the address; verify persistence by reopening Addresses.

#### 5.4. 44 - View order history and order details

**File:** `tests/account/44-view-order-history.spec.ts`

**Steps:**
  1. Sign in to a fresh test account, place an order, and open Orders from My account.
    - expect: The order history lists the newly placed order and its date, number, and status.
  2. Open the order details.
    - expect: The order detail page shows purchased items, billing/shipping information, and totals.

#### 5.5. 45 - Subscribe to the newsletter

**File:** `tests/services/45-newsletter-subscribe.spec.ts`

**Steps:**
  1. Enter a valid synthetic email in the Newsletter field and select Subscribe.
    - expect: A subscription confirmation is displayed.
    - expect: The email is accepted without leaving the current page.

#### 5.6. 46 - Validate newsletter email

**File:** `tests/services/46-newsletter-invalid-email.spec.ts`

**Steps:**
  1. Submit the newsletter form with an invalid email address.
    - expect: The site displays an invalid-email message and does not report successful subscription.

#### 5.7. 47 - Vote in the community poll

**File:** `tests/services/47-community-poll.spec.ts`

**Steps:**
  1. On the homepage, select one answer for Do you like nopCommerce? and choose Vote.
    - expect: A vote result or confirmation is displayed.
    - expect: The submitted option is reflected in the result where results are shown.

#### 5.8. 48 - Submit a customer contact enquiry

**File:** `tests/services/48-contact-us-submit.spec.ts`

**Steps:**
  1. Open Contact us, enter a synthetic name, valid email, and enquiry, then submit.
    - expect: The enquiry is accepted and a confirmation is displayed.

#### 5.9. 49 - Validate the contact enquiry form

**File:** `tests/services/49-contact-us-required-fields.spec.ts`

**Steps:**
  1. Open Contact us and submit with required fields blank or an invalid email.
    - expect: The form is not submitted successfully.
    - expect: Validation messages identify missing or invalid contact details.

#### 5.10. 50 - Read shipping and privacy information

**File:** `tests/services/50-shipping-and-privacy-information.spec.ts`

**Steps:**
  1. Open Shipping & Returns from the Information footer, then open Privacy Notice.
    - expect: Each information page loads with its expected page heading and readable policy content.
    - expect: The user can return to the storefront through the site navigation.
