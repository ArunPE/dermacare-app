import { Page, expect, test } from '@playwright/test';
import { BasePage } from './BasePage';

export class AppointmentBookingPage extends BasePage {
  readonly doctorSearchInput = this.page.getByTestId('doctor-search-input');
  readonly dateInput = this.page.getByTestId('appointment-date-input');
  readonly phoneInput = this.page.getByTestId('appointment-phone-input');
  readonly confirmButton = this.page.getByTestId('confirm-booking-button');

  async searchDoctor(name: string) {
    await test.step(`Search for doctor: ${name}`, async () => {
      await this.doctorSearchInput.fill(name);
    });
  }

  async selectDoctor(doctorId: string) {
    await test.step(`Select doctor with ID: ${doctorId}`, async () => {
      await this.page.getByTestId(`book-doctor-${doctorId}`).click();
    });
  }

  async bookSlot(date: string, time: string, phone: string = '9876543210') {
    await test.step(`Book slot on ${date} at ${time} with phone ${phone}`, async () => {
      await this.dateInput.fill(date);
      const timeButton = this.page.getByTestId(`select-time-${time.replace(/[: ]/g, '-')}`);
      await timeButton.click();
      await this.phoneInput.fill(phone);
      await this.confirmButton.click();
    });
  }

  async assertBookingSuccess() {
    await expect(this.page.getByText('Appointment Requested!')).toBeVisible();
  }
}
