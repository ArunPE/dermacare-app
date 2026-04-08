# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional.spec.ts >> Dermacare Functional Workflows >> Admin can manage appointments
- Location: tests/functional.spec.ts:59:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByTestId('admin-appointment-status-mock-app-1')
Expected: "confirmed"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for getByTestId('admin-appointment-status-mock-app-1')

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
          - link "Admin" [ref=e26] [cursor=pointer]:
            - /url: /admin
            - img [ref=e27]
            - generic [ref=e30]: Admin
          - img "Profile" [ref=e32]
          - button [ref=e33]:
            - img [ref=e34]
  - main [ref=e37]:
    - generic [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Admin Control Panel" [level=1] [ref=e41]
          - paragraph [ref=e42]: Manage clinic operations and patient care.
        - generic [ref=e43]:
          - generic [ref=e44]:
            - img [ref=e45]
            - generic [ref=e50]:
              - paragraph [ref=e51]: Total Doctors
              - paragraph [ref=e52]: "1"
          - generic [ref=e53]:
            - img [ref=e54]
            - generic [ref=e56]:
              - paragraph [ref=e57]: Appointments
              - paragraph [ref=e58]: "1"
      - generic [ref=e59]:
        - generic [ref=e61]:
          - generic [ref=e62]:
            - img [ref=e63]
            - textbox "Search patient or doctor..." [ref=e66]
          - generic [ref=e67]:
            - button "all" [ref=e68]
            - button "pending" [ref=e69]
            - button "confirmed" [ref=e70]
            - button "cancelled" [ref=e71]
        - generic [ref=e72]:
          - table [ref=e73]:
            - rowgroup [ref=e74]:
              - row "Patient Doctor Schedule Status Actions" [ref=e75]:
                - columnheader "Patient" [ref=e76]
                - columnheader "Doctor" [ref=e77]
                - columnheader "Schedule" [ref=e78]
                - columnheader "Status" [ref=e79]
                - columnheader "Actions" [ref=e80]
            - rowgroup
          - generic [ref=e81]: No appointments found.
  - contentinfo [ref=e82]:
    - generic [ref=e83]:
      - generic [ref=e84]:
        - generic [ref=e85]:
          - generic [ref=e86]:
            - img [ref=e88]
            - generic [ref=e92]: Dermacare Clinic
          - paragraph [ref=e93]: Advanced dermatological care with a focus on skin health and aesthetic excellence. Our team of experts is dedicated to providing personalized treatments.
        - generic [ref=e94]:
          - heading "Quick Links" [level=4] [ref=e95]
          - list [ref=e96]:
            - listitem [ref=e97]:
              - link "Our Doctors" [ref=e98] [cursor=pointer]:
                - /url: /doctors
            - listitem [ref=e99]:
              - link "Specialties" [ref=e100] [cursor=pointer]:
                - /url: /departments
            - listitem [ref=e101]:
              - link "Book Appointment" [ref=e102] [cursor=pointer]:
                - /url: /booking
        - generic [ref=e103]:
          - heading "Contact" [level=4] [ref=e104]
          - list [ref=e105]:
            - listitem [ref=e106]: Plot No. 45, Banjara Hills, Road No. 12
            - listitem [ref=e107]: Hyderabad, Telangana 500034, India
            - listitem [ref=e108]: contact@dermacare.clinic
            - listitem [ref=e109]: +91 40 2345 6789
      - generic [ref=e110]: © 2026 Dermacare Clinic. All rights reserved.
```

# Test source

```ts
  1  | import { Page, expect, test } from '@playwright/test';
  2  | import { BasePage } from './BasePage';
  3  | 
  4  | export class AdminDashboardPage extends BasePage {
  5  |   readonly filterAll = this.page.getByTestId('filter-status-all');
  6  |   readonly filterPending = this.page.getByTestId('filter-status-pending');
  7  |   readonly filterConfirmed = this.page.getByTestId('filter-status-confirmed');
  8  | 
  9  |   async filterByStatus(status: 'all' | 'pending' | 'confirmed' | 'cancelled') {
  10 |     await test.step(`Filter appointments by ${status}`, async () => {
  11 |       await this.page.getByTestId(`filter-status-${status}`).click();
  12 |     });
  13 |   }
  14 | 
  15 |   async confirmAppointment(appointmentId: string) {
  16 |     await test.step(`Confirm appointment ${appointmentId}`, async () => {
  17 |       await this.page.getByTestId(`admin-confirm-btn-${appointmentId}`).click();
  18 |     });
  19 |   }
  20 | 
  21 |   async assertStatus(appointmentId: string, expectedStatus: string) {
  22 |     await test.step(`Verify appointment ${appointmentId} has status ${expectedStatus}`, async () => {
> 23 |       await expect(this.page.getByTestId(`admin-appointment-status-${appointmentId}`)).toHaveText(expectedStatus);
     |                                                                                        ^ Error: expect(locator).toHaveText(expected) failed
  24 |     });
  25 |   }
  26 | }
  27 | 
```