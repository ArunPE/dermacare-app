import { Page, expect, test } from '@playwright/test';
import { BasePage } from './BasePage';

export class PatientDashboardPage extends BasePage {
  readonly appointmentsList = this.page.locator('[data-testid^="appointment-card-"]');
  readonly reportsList = this.page.locator('[data-testid^="report-card-"]');

  async assertAppointmentExists(doctorName: string) {
    await test.step(`Verify appointment with ${doctorName} exists`, async () => {
      await expect(this.page.getByText(doctorName)).toBeVisible();
    });
  }

  async assertReportExists(reportTitle: string) {
    await test.step(`Verify report "${reportTitle}" exists`, async () => {
      await expect(this.page.getByTestId(/^report-title-/).filter({ hasText: reportTitle })).toBeVisible();
    });
  }

  async cancelAppointment(appointmentId: string) {
    await test.step(`Cancel appointment ${appointmentId}`, async () => {
      await this.page.getByTestId(`cancel-appointment-${appointmentId}`).click();
    });
  }
}
