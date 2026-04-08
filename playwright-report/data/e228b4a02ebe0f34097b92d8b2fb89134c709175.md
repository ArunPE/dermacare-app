# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> Dermacare Security & Edge Cases >> Data Isolation: User A cannot see User B reports
- Location: tests/security.spec.ts:45:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 200
Received array: [403, 404]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e6]:
      - link "Dermacare" [ref=e7] [cursor=pointer]:
        - /url: /
        - img [ref=e9]
        - generic [ref=e13]: Dermacare
      - generic [ref=e14]:
        - link "Home" [ref=e15] [cursor=pointer]:
          - /url: /
        - link "Departments" [ref=e16] [cursor=pointer]:
          - /url: /departments
        - link "Doctors" [ref=e17] [cursor=pointer]:
          - /url: /doctors
        - generic [ref=e18]:
          - link "Dashboard" [ref=e19] [cursor=pointer]:
            - /url: /dashboard
            - img [ref=e20]
            - generic [ref=e25]: Dashboard
          - generic [ref=e26]:
            - img "Profile"
          - button [ref=e27]:
            - img [ref=e28]
  - main [ref=e31]
  - contentinfo [ref=e32]:
    - generic [ref=e33]:
      - generic [ref=e34]:
        - generic [ref=e35]:
          - generic [ref=e36]:
            - img [ref=e38]
            - generic [ref=e42]: Dermacare Clinic
          - paragraph [ref=e43]: Advanced dermatological care with a focus on skin health and aesthetic excellence. Our team of experts is dedicated to providing personalized treatments.
        - generic [ref=e44]:
          - heading "Quick Links" [level=4] [ref=e45]
          - list [ref=e46]:
            - listitem [ref=e47]:
              - link "Our Doctors" [ref=e48] [cursor=pointer]:
                - /url: /doctors
            - listitem [ref=e49]:
              - link "Specialties" [ref=e50] [cursor=pointer]:
                - /url: /departments
            - listitem [ref=e51]:
              - link "Book Appointment" [ref=e52] [cursor=pointer]:
                - /url: /booking
        - generic [ref=e53]:
          - heading "Contact" [level=4] [ref=e54]
          - list [ref=e55]:
            - listitem [ref=e56]: Plot No. 45, Banjara Hills, Road No. 12
            - listitem [ref=e57]: Hyderabad, Telangana 500034, India
            - listitem [ref=e58]: contact@dermacare.clinic
            - listitem [ref=e59]: +91 40 2345 6789
      - generic [ref=e60]: © 2026 Dermacare Clinic. All rights reserved.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { LoginPage } from './pom/LoginPage';
  3  | 
  4  | test.describe('Dermacare Security & Edge Cases', () => {
  5  |   let loginPage: LoginPage;
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     loginPage = new LoginPage(page);
  9  |     await loginPage.navigate();
  10 |   });
  11 | 
  12 |   test('RBAC Check: Patient cannot access admin route', async ({ page }) => {
  13 |     await test.step('1. Login as Patient', async () => {
  14 |       await loginPage.login();
  15 |     });
  16 | 
  17 |     await test.step('2. Attempt to access /admin', async () => {
  18 |       await page.goto('/admin');
  19 |       // Should be redirected to dashboard or home
  20 |       await expect(page).not.toHaveURL(/.*admin/);
  21 |       await expect(page).toHaveURL(/.*dashboard/);
  22 |     });
  23 |   });
  24 | 
  25 |   test('Form Validation: Cannot book for past dates', async ({ page }) => {
  26 |     await test.step('1. Navigate to Booking', async () => {
  27 |       await loginPage.login();
  28 |       await page.goto('/booking');
  29 |     });
  30 | 
  31 |     await test.step('2. Check date input min attribute', async () => {
  32 |       const dateInput = page.getByTestId('appointment-date-input');
  33 |       const minDate = await dateInput.getAttribute('min');
  34 |       const today = new Date().toISOString().split('T')[0];
  35 |       
  36 |       // Min date should be tomorrow or later
  37 |       expect(minDate).not.toBe(today);
  38 |       
  39 |       // Attempt to fill past date (should be blocked by browser validation or handled by app)
  40 |       await dateInput.fill('2020-01-01');
  41 |       await expect(page.getByTestId('confirm-booking-button')).toBeDisabled();
  42 |     });
  43 |   });
  44 | 
  45 |   test('Data Isolation: User A cannot see User B reports', async ({ page, context }) => {
  46 |     await test.step('1. Login as User A', async () => {
  47 |       await loginPage.login();
  48 |     });
  49 | 
  50 |     await test.step('2. Attempt to access User B report URL', async () => {
  51 |       const userBReportUrl = '/api/reports/user-b-private-id'; // Mocked ID
  52 |       const response = await page.goto(userBReportUrl);
  53 |       
  54 |       // Should return 403 or 404 due to Firestore rules
  55 |       if (response) {
> 56 |         expect([403, 404]).toContain(response.status());
     |                            ^ Error: expect(received).toContain(expected) // indexOf
  57 |       }
  58 |     });
  59 |   });
  60 | });
  61 | 
```