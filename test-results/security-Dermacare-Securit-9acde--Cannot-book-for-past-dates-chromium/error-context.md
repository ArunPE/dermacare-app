# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> Dermacare Security & Edge Cases >> Form Validation: Cannot book for past dates
- Location: tests/security.spec.ts:25:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.getAttribute: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('appointment-date-input')

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
        - button "Sign In" [ref=e18]
  - main [ref=e19]:
    - generic [ref=e20]:
      - generic [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e23]:
            - generic [ref=e24]: Expert Dermatological Care
            - heading "Healthy Skin, Confident You." [level=1] [ref=e25]:
              - text: Healthy Skin,
              - text: Confident You.
            - paragraph [ref=e26]: Experience the next generation of skin care with our world-class specialists and advanced technology.
          - generic [ref=e27]:
            - link "Book Appointment" [ref=e28] [cursor=pointer]:
              - /url: /booking
              - generic [ref=e29]: Book Appointment
              - img [ref=e30]
            - link "Meet Our Doctors" [ref=e32] [cursor=pointer]:
              - /url: /doctors
        - img "Clinic" [ref=e34]
      - generic [ref=e36]:
        - generic [ref=e37]:
          - img [ref=e39]
          - generic [ref=e44]: 15k+
          - generic [ref=e45]: Happy Patients
        - generic [ref=e46]:
          - img [ref=e48]
          - generic [ref=e51]: 25+
          - generic [ref=e52]: Expert Doctors
        - generic [ref=e53]:
          - img [ref=e55]
          - generic [ref=e58]: 12+
          - generic [ref=e59]: Years Experience
        - generic [ref=e60]:
          - img [ref=e62]
          - generic [ref=e64]: 99%
          - generic [ref=e65]: Success Rate
      - generic [ref=e66]:
        - generic [ref=e67]:
          - heading "Our Specialized Services" [level=2] [ref=e68]
          - paragraph [ref=e69]: We offer a comprehensive range of dermatological treatments tailored to your unique skin needs.
        - generic [ref=e70]:
          - generic [ref=e71]:
            - img "General Dermatology" [ref=e73]
            - generic [ref=e74]:
              - heading "General Dermatology" [level=3] [ref=e75]
              - paragraph [ref=e76]: Treatment for common skin conditions like acne, eczema, and psoriasis.
              - link "Learn More" [ref=e77] [cursor=pointer]:
                - /url: /departments
                - text: Learn More
                - img [ref=e78]
          - generic [ref=e80]:
            - img "Cosmetic Procedures" [ref=e82]
            - generic [ref=e83]:
              - heading "Cosmetic Procedures" [level=3] [ref=e84]
              - paragraph [ref=e85]: Advanced aesthetic treatments including lasers, fillers, and rejuvenation.
              - link "Learn More" [ref=e86] [cursor=pointer]:
                - /url: /departments
                - text: Learn More
                - img [ref=e87]
          - generic [ref=e89]:
            - img "Skin Cancer Screening" [ref=e91]
            - generic [ref=e92]:
              - heading "Skin Cancer Screening" [level=3] [ref=e93]
              - paragraph [ref=e94]: Thorough examinations and early detection of skin malignancies.
              - link "Learn More" [ref=e95] [cursor=pointer]:
                - /url: /departments
                - text: Learn More
                - img [ref=e96]
      - generic [ref=e98]:
        - heading "Ready to transform your skin?" [level=2] [ref=e99]
        - paragraph [ref=e100]: Join thousands of satisfied patients and start your journey to healthier skin today.
        - link "Schedule a Consultation" [ref=e102] [cursor=pointer]:
          - /url: /booking
  - contentinfo [ref=e103]:
    - generic [ref=e104]:
      - generic [ref=e105]:
        - generic [ref=e106]:
          - generic [ref=e107]:
            - img [ref=e109]
            - generic [ref=e113]: Dermacare Clinic
          - paragraph [ref=e114]: Advanced dermatological care with a focus on skin health and aesthetic excellence. Our team of experts is dedicated to providing personalized treatments.
        - generic [ref=e115]:
          - heading "Quick Links" [level=4] [ref=e116]
          - list [ref=e117]:
            - listitem [ref=e118]:
              - link "Our Doctors" [ref=e119] [cursor=pointer]:
                - /url: /doctors
            - listitem [ref=e120]:
              - link "Specialties" [ref=e121] [cursor=pointer]:
                - /url: /departments
            - listitem [ref=e122]:
              - link "Book Appointment" [ref=e123] [cursor=pointer]:
                - /url: /booking
        - generic [ref=e124]:
          - heading "Contact" [level=4] [ref=e125]
          - list [ref=e126]:
            - listitem [ref=e127]: Plot No. 45, Banjara Hills, Road No. 12
            - listitem [ref=e128]: Hyderabad, Telangana 500034, India
            - listitem [ref=e129]: contact@dermacare.clinic
            - listitem [ref=e130]: +91 40 2345 6789
      - generic [ref=e131]: © 2026 Dermacare Clinic. All rights reserved.
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
> 33 |       const minDate = await dateInput.getAttribute('min');
     |                                       ^ Error: locator.getAttribute: Test timeout of 30000ms exceeded.
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
  56 |         expect([403, 404]).toContain(response.status());
  57 |       }
  58 |     });
  59 |   });
  60 | });
  61 | 
```