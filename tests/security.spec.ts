import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';

test.describe('Dermacare Security & Edge Cases', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('RBAC Check: Patient cannot access admin route', async ({ page }) => {
    await test.step('1. Login as Patient', async () => {
      await loginPage.login();
    });

    await test.step('2. Attempt to access /admin', async () => {
      await page.goto('/admin');
      // Should be redirected to dashboard or home
      await expect(page).not.toHaveURL(/.*admin/);
      await expect(page).toHaveURL(/.*dashboard/);
    });
  });

  test('Form Validation: Cannot book for past dates', async ({ page }) => {
    await test.step('1. Navigate to Booking', async () => {
      await loginPage.login();
      await page.goto('/booking');
    });

    await test.step('2. Check date input min attribute', async () => {
      const dateInput = page.getByTestId('appointment-date-input');
      const minDate = await dateInput.getAttribute('min');
      const today = new Date().toISOString().split('T')[0];
      
      // Min date should be tomorrow or later
      expect(minDate).not.toBe(today);
      
      // Attempt to fill past date (should be blocked by browser validation or handled by app)
      await dateInput.fill('2020-01-01');
      await expect(page.getByTestId('confirm-booking-button')).toBeDisabled();
    });
  });

  test('Data Isolation: User A cannot see User B reports', async ({ page, context }) => {
    await test.step('1. Login as User A', async () => {
      await loginPage.login();
    });

    await test.step('2. Attempt to access User B report URL', async () => {
      const userBReportUrl = '/api/reports/user-b-private-id'; // Mocked ID
      const response = await page.goto(userBReportUrl);
      
      // Should return 403 or 404 due to Firestore rules
      if (response) {
        expect([403, 404]).toContain(response.status());
      }
    });
  });
});
