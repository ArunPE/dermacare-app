# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional.spec.ts >> Dermacare Functional Workflows >> Patient can search and book an appointment
- Location: tests/functional.spec.ts:21:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Dr. Sarah Mitchell')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Dr. Sarah Mitchell')

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
          - img "Profile" [ref=e27]
          - button [ref=e28]:
            - img [ref=e29]
  - main [ref=e32]:
    - generic [ref=e33]:
      - generic [ref=e35]:
        - img "Profile" [ref=e37]
        - generic [ref=e38]:
          - heading "Welcome, Test Patient" [level=1] [ref=e39]
          - paragraph [ref=e40]: Manage your skin health and appointments.
      - generic [ref=e41]:
        - generic [ref=e43]:
          - heading "Your Appointments" [level=2] [ref=e44]
          - generic [ref=e45]: 0 Total
        - generic [ref=e48]:
          - generic [ref=e49]:
            - heading "Medical Reports" [level=2] [ref=e50]
            - img [ref=e51]
          - generic [ref=e54]:
            - generic [ref=e55]:
              - paragraph [ref=e56]: No reports available yet.
              - paragraph [ref=e57]: Secure Storage
            - paragraph [ref=e59]: Your medical records are encrypted and only accessible by you and your attending physician.
  - contentinfo [ref=e60]:
    - generic [ref=e61]:
      - generic [ref=e62]:
        - generic [ref=e63]:
          - generic [ref=e64]:
            - img [ref=e66]
            - generic [ref=e70]: Dermacare Clinic
          - paragraph [ref=e71]: Advanced dermatological care with a focus on skin health and aesthetic excellence. Our team of experts is dedicated to providing personalized treatments.
        - generic [ref=e72]:
          - heading "Quick Links" [level=4] [ref=e73]
          - list [ref=e74]:
            - listitem [ref=e75]:
              - link "Our Doctors" [ref=e76] [cursor=pointer]:
                - /url: /doctors
            - listitem [ref=e77]:
              - link "Specialties" [ref=e78] [cursor=pointer]:
                - /url: /departments
            - listitem [ref=e79]:
              - link "Book Appointment" [ref=e80] [cursor=pointer]:
                - /url: /booking
        - generic [ref=e81]:
          - heading "Contact" [level=4] [ref=e82]
          - list [ref=e83]:
            - listitem [ref=e84]: Plot No. 45, Banjara Hills, Road No. 12
            - listitem [ref=e85]: Hyderabad, Telangana 500034, India
            - listitem [ref=e86]: contact@dermacare.clinic
            - listitem [ref=e87]: +91 40 2345 6789
      - generic [ref=e88]: © 2026 Dermacare Clinic. All rights reserved.
```

# Test source

```ts
  1  | import { Page, expect, test } from '@playwright/test';
  2  | import { BasePage } from './BasePage';
  3  | 
  4  | export class PatientDashboardPage extends BasePage {
  5  |   readonly appointmentsList = this.page.locator('[data-testid^="appointment-card-"]');
  6  |   readonly reportsList = this.page.locator('[data-testid^="report-card-"]');
  7  | 
  8  |   async assertAppointmentExists(doctorName: string) {
  9  |     await test.step(`Verify appointment with ${doctorName} exists`, async () => {
> 10 |       await expect(this.page.getByText(doctorName)).toBeVisible();
     |                                                     ^ Error: expect(locator).toBeVisible() failed
  11 |     });
  12 |   }
  13 | 
  14 |   async assertReportExists(reportTitle: string) {
  15 |     await test.step(`Verify report "${reportTitle}" exists`, async () => {
  16 |       await expect(this.page.getByTestId(/^report-title-/).filter({ hasText: reportTitle })).toBeVisible();
  17 |     });
  18 |   }
  19 | 
  20 |   async cancelAppointment(appointmentId: string) {
  21 |     await test.step(`Cancel appointment ${appointmentId}`, async () => {
  22 |       await this.page.getByTestId(`cancel-appointment-${appointmentId}`).click();
  23 |     });
  24 |   }
  25 | }
  26 | 
```