import { Page, expect, test } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminDashboardPage extends BasePage {
  readonly filterAll = this.page.getByTestId('filter-status-all');
  readonly filterPending = this.page.getByTestId('filter-status-pending');
  readonly filterConfirmed = this.page.getByTestId('filter-status-confirmed');

  async filterByStatus(status: 'all' | 'pending' | 'confirmed' | 'cancelled') {
    await test.step(`Filter appointments by ${status}`, async () => {
      await this.page.getByTestId(`filter-status-${status}`).click();
    });
  }

  async confirmAppointment(appointmentId: string) {
    await test.step(`Confirm appointment ${appointmentId}`, async () => {
      await this.page.getByTestId(`admin-confirm-btn-${appointmentId}`).click();
    });
  }

  async assertStatus(appointmentId: string, expectedStatus: string) {
    await test.step(`Verify appointment ${appointmentId} has status ${expectedStatus}`, async () => {
      await expect(this.page.getByTestId(`admin-appointment-status-${appointmentId}`)).toHaveText(expectedStatus);
    });
  }
}
