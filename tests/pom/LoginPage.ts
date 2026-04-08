import { Page, expect, test } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly loginButton = this.page.getByTestId('login-button');
  readonly userMenu = this.page.getByTestId('user-menu');
  readonly logoutButton = this.page.getByTestId('logout-button');

  async login() {
    await test.step('Perform Mock Patient Login', async () => {
      await this.page.evaluate(() => {
        localStorage.setItem('playwright-test-mode', 'true');
      });
      await this.page.reload();
      await expect(this.userMenu).toBeVisible();
    });
  }

  async loginAsAdmin() {
    await test.step('Perform Mock Admin Login', async () => {
      await this.page.evaluate(() => {
        localStorage.setItem('playwright-admin-mode', 'true');
      });
      await this.page.reload();
      await expect(this.userMenu).toBeVisible();
    });
  }

  async logout() {
    await test.step('Perform Logout', async () => {
      await this.logoutButton.click();
    });
  }

  async assertLoggedIn() {
    await expect(this.userMenu).toBeVisible();
  }

  async assertLoggedOut() {
    await expect(this.loginButton).toBeVisible();
  }
}
