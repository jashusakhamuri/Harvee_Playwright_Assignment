# Section B — AI Output and Client Communication

## B1. Review AI-Generated Code

### Problems Identified

After reviewing the supplied Playwright test, I identified the following issues that could reduce its reliability, accuracy, and maintainability.

1. **Hardcoded application URL:** The URL is embedded directly in the test, making environment changes harder to manage.
2. **Hardcoded credentials:** Credentials should be loaded from the existing configuration rather than written into test code.
3. **Ambiguous product selector:** A generic `text=Add to cart` selector may match multiple buttons, making it unclear which product will be added.
4. **Missing login verification:** The test proceeds without confirming that authentication succeeded.
5. **Fixed timeout:** `waitForTimeout(3000)` introduces unnecessary delays and does not guarantee that the application is ready.
6. **Missing product verification:** The test does not verify which product was selected or added.
7. **Missing cart assertions:** It does not verify the cart badge or confirm the cart's contents.
8. **Missing checkout-stage verification:** The test does not confirm that the expected checkout pages are displayed.
9. **Unstructured test data:** Checkout values are embedded in the test instead of being managed through reusable test data.
10. **Missing subtotal validation:** The test does not retrieve or validate the displayed subtotal.
11. **Missing tax validation:** The test does not retrieve or validate the displayed tax.
12. **Weak total assertion:** `expect(total).toBeTruthy()` only checks whether the value is truthy. It does not verify the correctness of the calculation.
13. **Missing order completion:** The test does not finish the order or verify the confirmation message.
14. **Missing post-checkout validation:** It does not verify that the cart is empty after the order is completed.
15. **Poor maintainability:** UI interactions are written directly in the test rather than being organized into reusable Page Object Model methods.
16. **Limited failure diagnosis:** The test does not provide meaningful validation details to help identify calculation failures.
17. **Unclear test setup:** Configuration and the expected starting state are not managed explicitly, reducing portability and making the test harder to maintain.

### Proposed Improvements

I would improve the test by:

- Loading the application URL and user credentials through the existing configuration fixture.
- Reusing the existing `LoginPage`, `ProductsPage`, and `CartPage` classes.
- Using `checkoutData.json` for product and customer information.
- Replacing fixed waits with Playwright's locator actions and automatic waiting.
- Verifying login, product selection, cart contents, checkout progression, and order confirmation.
- Validating the actual relationship between subtotal, tax, and total.
- Checking that the cart is empty after completing the order.
- Keeping each test independent and providing useful logging and failure evidence.

The monetary calculation can be verified using integer cents:

```typescript
const expectedTotalCents =
  Math.round(subtotal * 100) + Math.round(tax * 100);

const actualTotalCents = Math.round(total * 100);

expect(actualTotalCents).toBe(expectedTotalCents);
```

This approach verifies the actual calculation rather than merely checking that a total exists.

### Implementation and Verification

I implemented the checkout-total verification using the existing Playwright framework, Page Object Model classes, custom configuration fixture, and checkout test data.

The test completed successfully against the SauceDemo application.

**Execution result: 1 passed (6.1 seconds).**

The test verified the following:

| Validation | Actual result |
|---|---|
| Product selected | Sauce Labs Backpack |
| Subtotal | $29.99 |
| Tax | $2.40 |
| Total | $32.39 |
| Total calculation | $29.99 + $2.40 = $32.39 |
| Order completion | Confirmation message displayed |
| Cart after completion | Empty cart badge |

The test therefore confirmed the expected calculation and completed the checkout flow successfully in that execution. This result demonstrates that the implemented assertions work for the tested scenario; it does not, by itself, establish that every possible checkout scenario is defect-free.

---

## B2. Evaluate an AI Feature — Test Case Generator

### Selected AI Feature

I selected an AI-powered test case generator because it directly relates to my QA automation experience.

The proposed tool accepts a user story and its acceptance criteria, generates test cases in JSON format, and prepares them for import into a test management system.

The main risk is that the AI could generate incomplete, inaccurate, duplicated, or incorrectly formatted test cases. I would evaluate the tool using four checks.

### 1. Requirement Coverage

**Objective:** Determine whether the generated test cases cover the important scenarios defined in the user story and acceptance criteria.

For a checkout feature, expected coverage might include successful checkout, missing required fields, and total calculation when those behaviours are specified by the requirements.

**Evaluation method:** Compare the generated test cases against a manually prepared reference list of required scenarios. Use automated matching to identify possible coverage gaps, followed by human review to confirm that each scenario tests the intended behaviour.

**Metric:**

Coverage percentage = (Required scenarios covered / Total required scenarios) × 100.

**Failure condition:** One or more important required scenarios are missing or are incorrectly represented as covered.

### 2. Incorrect or Invented Requirements

**Objective:** Identify test cases that introduce business rules not supported by the supplied requirements.

For example, if the requirements state only that a postal code is mandatory, the AI should not invent a specific postal-code format and present it as a confirmed requirement.

**Evaluation method:** Compare each generated assertion and expected result against the original user story and acceptance criteria. Record unsupported assumptions separately from confirmed requirements.

**Metrics:**
- Number of unsupported requirements.
- Percentage of generated test cases containing unsupported expected behaviour.

**Failure condition:** The generated output presents an invented business rule as an established requirement without identifying the uncertainty.

### 3. Duplicate Test Cases

**Objective:** Identify test cases that cover the same behaviour without adding meaningful coverage.

For example, two cases might both verify successful checkout and differ only in their descriptions.

**Evaluation method:** Use automated text-similarity checks to flag possible duplicates, then manually review the results. Similar wording alone should not be sufficient to classify two cases as duplicates because legitimate boundary cases may share similar descriptions.

**Metric:**

Duplicate rate = (Confirmed redundant test cases / Total generated test cases) × 100.

**Failure condition:** The output contains redundant test cases that inflate the apparent coverage without testing distinct behaviour.

### 4. JSON Format and Schema Validation

**Objective:** Verify that generated test cases can be processed by the intended test management integration.

**Evaluation method:** Validate the output using a JSON parser and a predefined JSON Schema.

The schema should check:
- Required fields are present.
- Field names match the agreed structure.
- Values use the expected data types.
- Mandatory fields are not empty.
- The output contains valid JSON without unexpected surrounding text.

**Metric:**

Schema pass rate = (Responses passing JSON Schema validation / Total generated responses) × 100.

**Failure condition:** A response contains invalid JSON or fails a mandatory schema requirement.

### Overall Evaluation Approach

I would evaluate the tool against a fixed collection of representative user stories, including simple requirements, complex workflows, negative scenarios, boundary conditions, and ambiguous requirements.

I would record the results for all four checks, investigate failures, and repeat the evaluation whenever the model, prompt, or output schema changes.

I would consider the tool suitable for practical use only after reviewing the results against predefined acceptance thresholds. Generated test cases would still require appropriate review before being imported into the test management system.

---

## B3. Jira Defect Report — Incorrect Price Sorting

### Title

**[Release 4.2.0] Products are not sorted correctly by price (low to high)**

### Environment

| Field | Details |
|---|---|
| Application | SauceDemo |
| Release | 4.2.0 |
| Browser | Google Chrome |
| Page | Products |
| Sorting option | Price (low to high) |
| Frequency | Reported on every run since release 4.2.0, according to the assessment scenario |

### Preconditions

- The application is running release 4.2.0.
- A valid, unlocked user account is available.
- The Products page is accessible.

### Steps to Reproduce

1. Open the SauceDemo application.
2. Log in using valid credentials for an unlocked user.
3. Navigate to the Products page.
4. Select **Price (low to high)** from the sorting dropdown.
5. Record all displayed product prices in their current order.
6. Compare the displayed sequence with the expected ascending order.

### Expected Result

All products should be displayed in ascending price order, from the lowest price to the highest price.

For example, a product priced at $15.99 must appear before a product priced at $29.99.

### Actual Result

A product priced at $29.99 appears before a product priced at $15.99, violating the expected ascending order.

The assessment scenario states that this behaviour occurs on every run since release 4.2.0.

### Severity and Priority

**Proposed severity: Major**

The defect consistently breaks a core product-browsing function and may prevent customers from reliably finding lower-priced products.

The available information does not establish that checkout or payment processing is affected.

**Proposed priority: High — pending product-owner confirmation.**

The release impact and business priority should be confirmed with the product owner or release team.

### Evidence to Attach

- Screenshot showing the selected sorting option.
- Screenshot showing the incorrect product-price order.
- Playwright test report or trace, if the defect has been reproduced through automation.
- Application release and browser version.
- Execution timestamp and the complete list of displayed prices.

### Recommended Fix Verification

After the fix is deployed, I would:

1. Run the low-to-high sorting test and verify the entire price list.
2. Compare adjacent prices to confirm that the sequence is ascending.
3. Test high-to-low sorting to confirm descending order.
4. Recheck both alphabetical sorting options.
5. Run the relevant product-listing regression tests.

The defect should be considered resolved only after the expected behaviour has been verified against the affected release.

---

## B4. Message to the Client

Hi Team,

During regression testing, we identified two issues ahead of Friday's planned release. Price sorting consistently places a $29.99 product before a $15.99 product. Checkout automation also fails in approximately 1 out of 10 runs, although it passes on rerun.

I recommend holding the release decision until we investigate the intermittent checkout failures and verify the sorting fix. A successful rerun alone does not establish that the checkout issue is resolved.

Meanwhile, we can investigate the checkout failures in parallel with the sorting fix and run targeted regression tests. If the release cannot be delayed, I recommend that the product and release owners review the outstanding risks and explicitly approve the release decision based on the available evidence.

I will share the investigation findings and regression results before the final decision.

