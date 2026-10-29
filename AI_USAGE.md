
# AI Usage Documentation

## 1. Purpose

AI tools were used as a supporting resource during the QA Automation assessment. They helped with test design, Playwright automation structure, code review, and preparation of written assessment responses. All suggestions were reviewed before being included in the project.

## 2. Areas Where AI Was Used

### A. Manual Test Case Design

**Request:** Help create a structured manual test suite for the SauceDemo application.

**AI assistance:**
- Organizing test scenarios into positive, negative, boundary, usability, accessibility, and security categories.
- Identifying missing test scenarios.
- Drafting product-owner questions and assumptions.
- Preparing an exploratory testing charter.
- Reviewing the test strategy.

**Verification:** The proposed test cases were reviewed against the assessment requirements. Application behavior should be confirmed through actual execution where applicable.

### B. Playwright Automation

**Request:** Help structure maintainable UI automation using Playwright and TypeScript.

**AI assistance:**
- Organizing tests and Page Object Model classes.
- Suggesting reusable locators and test methods.
- Supporting configuration through properties files.
- Improving assertions and test independence.
- Suggesting HTML and JUnit reporting.

**Verification:** Automation tests were executed where indicated by the actual test results. Tests that have not been executed are not considered verified. A passing test confirms only the behavior covered by that test in the tested environment.

### C. B1 — Review of the Flawed Test

**Request:** Identify weaknesses in the supplied cart-total test and propose a more reliable implementation.

**AI assistance:**
- Identifying hardcoded configuration and test data.
- Highlighting unreliable selectors and fixed waits.
- Recommending Page Object Model usage.
- Improving cart assertions and total calculations.
- Recommending configuration-based URLs and credentials.

**Verification:** The proposed changes must be validated by executing the rewritten test. The test's execution status should reflect the actual result.

### D. B2 — AI Test-Case Generation Evaluation

**Request:** Define a practical method for evaluating AI-generated test cases.

**AI assistance:**
- Selecting test-case generation as the AI use case.
- Defining checks for requirement coverage, unsupported assumptions, duplicate cases, and JSON schema validity.
- Suggesting measurable evaluation criteria.

**Verification:** These checks are proposed evaluation criteria. They should not be described as implemented or executed unless supported by actual results.

### E. B3 and B4 — Defect Reporting and Communication

**Request:** Prepare a defect report and a client-facing release recommendation based on the assessment scenarios.

**AI assistance:**
- Structuring the defect report.
- Explaining the impact of the price-sorting issue.
- Communicating intermittent checkout failures.
- Drafting a concise release recommendation.

**Verification:** The defect report and communication are based on the scenarios supplied in the assessment. Independent reproduction of the sorting defect is not claimed unless separately verified.

## 3. Human Review and Responsibility

AI-generated suggestions were treated as assistance rather than authoritative evidence. The final submission remains my responsibility. Test results, defect reproduction, and implementation status should be reported based on actual observations.

## 4. Limitations

AI-generated code and test cases can contain incorrect assumptions, unreliable locators, incomplete assertions, or unsupported behavior. Actual application execution is necessary to establish whether an automated test passes. A successful test run does not prove that all application behavior is correct.

## 5. Summary

AI supported test design, automation maintainability, code review, and assessment documentation. Verification status is reported separately from proposed changes, and conclusions about application defects are limited to the evidence available.
