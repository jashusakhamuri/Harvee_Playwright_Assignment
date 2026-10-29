# Harvee Technologies — QA Automation Assessment

## A1. Manual Test Suite

### 1. Test Cases

> **Test environment:** Chrome, Sauce Demo application  
> **Priority:** P1 = Critical/High, P2 = Medium  
> **Automation status:** `Yes` means suitable for automation; `Partial` means automation should be supplemented by manual review.

| ID | Type | Test case | Preconditions | Steps | Test data | Expected result | Priority | Automate? |
|---|---|---|---|---|---|---|---|---|
| TC01 | Positive | Login with a standard user | Login page is open | Enter credentials and click **Login**. | `standard_user` / `secret_sauce` | Login succeeds and the Products page appears. | P1 | Yes — critical smoke test |
| TC02 | Negative | Login with an incorrect password | Login page is open | Enter a valid username and incorrect password; click **Login**. | `standard_user` / `wrong_password` | Login is rejected and a meaningful error is displayed. | P1 | Yes — authentication regression |
| TC03 | Negative | Login with a locked-out user | Login page is open | Enter the locked-out user's credentials and click **Login**. | `locked_out_user` / `secret_sauce` | Login is rejected with the expected locked-out error; the Products page is not accessible. | P1 | Yes — mandatory scenario |
| TC04 | Boundary | Submit login with empty credentials | Login page is open | Leave both fields empty and click **Login**. | Username: empty; password: empty | Login is rejected and a required-field error is displayed. | P2 | Yes — validation regression |
| TC05 | Negative | Submit login with a missing password | Login page is open | Enter a valid username, leave the password empty, and click **Login**. | `standard_user` / empty password | Login is rejected and an appropriate validation error is displayed. | P2 | Yes — validation regression |
| TC06 | Positive | Verify product listing | Logged in as a standard user | Open Products and inspect the product list. | Standard product catalogue | Products display their names, prices, images, and available actions. | P1 | Yes — core functionality |
| TC07 | Functional | Sort products by name A–Z | Products page is open | Select **Name (A to Z)** and collect every displayed product name. | All displayed product names | Names appear in ascending alphabetical order. | P1 | Yes — deterministic regression |
| TC08 | Functional | Sort products by price low to high | Products page is open | Select **Price (low to high)**; collect every displayed price and compare adjacent values. | All displayed product prices | Every price is less than or equal to the next price; the complete list is sorted. | P1 | Yes — mandatory; validates the full list |
| TC09 | Functional | Sort products by price high to low | Products page is open | Select **Price (high to low)**; collect every displayed price and compare adjacent values. | All displayed product prices | Every price is greater than or equal to the next price. | P1 | Yes — sorting regression |
| TC10 | Functional | Sort products by name Z–A | Products page is open | Select **Name (Z to A)** and collect every displayed product name. | All displayed product names | Names appear in descending alphabetical order. | P2 | Yes — covers the fourth sort option |
| TC11 | Positive | Add two products and remove one | Logged in; cart initially empty | Add two distinct products; verify the cart badge; remove one; open the cart. | Sauce Labs Backpack and Sauce Labs Bike Light | Badge changes from 2 to 1; only the remaining product appears in the cart. | P1 | Yes — mandatory scenario |
| TC12 | Functional | Remove a product from the cart page | One product is in the cart | Open the cart and click **Remove** for that product. | Sauce Labs Backpack | Product disappears and the badge updates to match the remaining cart contents. | P1 | Yes — cart regression |
| TC13 | Boundary | Open an empty cart | Logged in; no products added | Open the cart page. | Empty cart | Cart displays no products and no stale item count. | P2 | Yes — boundary-state regression |
| TC14 | Functional | Verify cart state while navigating | One product has been added | Open the cart, return to Products, and reopen the cart. | Sauce Labs Backpack | Product, badge, and cart contents remain consistent. | P2 | Yes — state consistency |
| TC15 | Functional | Verify product price in the cart | Products page is open | Record a product's displayed price, add it, and open the cart. | Sauce Labs Backpack | The cart shows the same product and corresponding price. | P1 | Yes — pricing consistency |
| TC16 | Positive | Complete checkout with valid customer details | Logged in; at least one product in cart | Open cart, click **Checkout**, enter all required details, and click **Continue**. | First name: Test; last name: User; postal code: 522001 | Checkout overview appears and displays the selected product. | P1 | Yes — checkout smoke test |
| TC17 | Functional | Verify checkout subtotal, tax, and total | Product added; valid checkout details entered | Proceed to overview; read subtotal, tax, and total; calculate the expected total. | Displayed monetary values | Total equals subtotal plus tax, rounded to two decimal places. | P1 | Yes — mandatory checkout-total verification |
| TC18 | Negative / Boundary | Validate each missing checkout field | Logged in; product added; checkout information page open | Run three parameterized iterations: omit first name, omit last name, and omit postal code. Click **Continue** in each iteration. | Iterations: missing first name; missing last name; missing postal code | Each iteration is blocked with the appropriate field-specific validation error. | P1 | Yes — mandatory parameterized test |
| TC19 | Positive | Finish the order and verify confirmation | Checkout overview is displayed | Click **Finish** and inspect the confirmation page. | Valid checkout | Order confirmation and the order-completion message are displayed. | P1 | Yes — critical business workflow |
| TC20 | Negative / Navigation | Cancel checkout without placing an order | Product is in the cart and checkout has started | Navigate to the checkout overview and click **Cancel**. | One selected product | User returns to the appropriate page without completing the order; no order confirmation appears. | P1 | Yes — cancellation flow |
| TC21 | Functional | Verify cart state after order completion | Valid checkout has reached the overview | Click **Finish**, open the cart, and inspect its contents. | One selected product | Cart contains no products and the badge is absent or reflects the application's documented empty-cart behaviour. | P1 | Yes — mandatory business-rule verification |
| TC22 | Security | Open Products URL after logging out | User is logged in | Log out, then navigate directly to `/inventory.html`. | Logged-out session | Products are not accessible; user is redirected to login or access is denied. | P1 | Yes — mandatory security scenario |
| TC23 | Exploratory | Investigate `problem_user` — 15-minute charter | Login page is open | **For 15 minutes:** log in as `problem_user`; inspect product images, sorting, add/remove actions, cart badge/content, and checkout. Record steps and evidence for each anomaly. | `problem_user` / `secret_sauce` | Findings include reproducible steps and evidence; known issues are distinguished from newly introduced defects. | P2 | Partial — exploratory investigation is manual; confirmed regressions can be automated |
| TC24 | Accessibility | Navigate login and checkout using only a keyboard | Login page is open; valid user available | Use Tab, Shift+Tab, Enter, and Space to navigate and complete the workflow. | Standard user and valid checkout data | Interactive controls are keyboard-accessible, focus is visible, and navigation order is logical. | P1 | Partial — automate selected assertions and supplement with manual review |
| TC25 | Responsive UI | Verify shopping flow at a small viewport | Logged in as a standard user | Set viewport to 375 × 667; inspect Products and Cart; attempt to navigate through checkout. | 375 × 667 viewport | Key controls and information remain usable; no critical content is inaccessible due to clipping or overlap. | P2 | Partial — automate viewport checks and supplement with visual review |

### 2. Questions for the Product Owner and Assumptions

| No. | Question for the product owner | Assumption if no answer is available |
|---|---|---|
| 1 | Should the cart retain its contents when the user logs out and logs back in? | Verify documented behaviour; do not assume persistence across sessions. |
| 2 | What should happen if a user attempts to access checkout without adding products? | The user must not be able to place an order without products. |
| 3 | Are postal codes validated against a specific format or geographic region? | Test required-field validation only; do not invent format restrictions. |
| 4 | How should tax be calculated, and how should monetary rounding be handled? | The displayed total should equal displayed subtotal plus displayed tax, rounded to two decimal places. |
| 5 | Should the cart badge disappear or display zero when the cart is empty? | Verify that the badge and cart contents match the application's intended behaviour. |
| 6 | Should users be redirected to login when accessing protected pages after logout? | Unauthenticated users must not access protected content. |
| 7 | Which browsers and minimum screen sizes are officially supported? | Test in the specified Chrome environment and use 375 × 667 as an additional responsive check, not as an assumed official minimum. |

### 3. Test Strategy (under 150 words)

Testing will prioritize critical customer journeys and high-risk business rules: authentication, complete-list product sorting, cart updates, checkout validation, order completion, total calculation, and access to protected pages after logout. Positive, negative, boundary, usability, accessibility, and responsive scenarios are included. Critical repeatable checks will be automated with Playwright and TypeScript using the Page Object Model, environment-based configuration, independent tests, and assertions against observable outcomes. The price-sorting test will compare every adjacent price, rather than checking only the first item. Checkout total verification will compare the displayed total with subtotal plus tax using two-decimal precision. Missing checkout fields will be covered with a parameterized test. Keyboard accessibility and visual responsiveness will include manual review in addition to automation. Exploratory testing will spend 15 minutes investigating `problem_user`, documenting reproducible steps and evidence. Failures will be reported with screenshots and test results.

