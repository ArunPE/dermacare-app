import { Page, Locator, test } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Captures detailed diagnostic info on failure.
   * This can be sent to a "Healer LLM" for self-healing.
   */
  async captureDiagnostics(error: Error) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `test-results/failure-${timestamp}.png`;
    const logsPath = `test-results/logs-${timestamp}.txt`;
    
    await test.step('Capture Diagnostics for AI Healer', async () => {
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      const pageSource = await this.page.content();
      const consoleLogs = await this.page.evaluate(() => {
        // This is a simplified example; in a real setup, you'd collect logs via page.on('console')
        return 'Console logs captured at runtime';
      });

      console.log('--- AI HEALER DIAGNOSTICS ---');
      console.log(`Error: ${error.message}`);
      console.log(`Screenshot: ${screenshotPath}`);
      console.log(`Page Source Length: ${pageSource.length}`);
      // In a real implementation, you would write pageSource to a file or send to an API
    });
  }

  /**
   * Smart Locator with fallback mechanism.
   * Attempts primary selector, falls back to secondary if primary fails.
   */
  async smartLocator(primary: string, fallback: string): Promise<Locator> {
    const primaryLocator = this.page.locator(primary);
    try {
      await primaryLocator.waitFor({ state: 'visible', timeout: 3000 });
      return primaryLocator;
    } catch (e) {
      console.warn(`Primary selector [${primary}] failed, attempting fallback [${fallback}]`);
      const fallbackLocator = this.page.locator(fallback);
      try {
        await fallbackLocator.waitFor({ state: 'visible', timeout: 3000 });
        return fallbackLocator;
      } catch (fe) {
        await this.captureDiagnostics(fe as Error);
        throw fe;
      }
    }
  }

  async navigate(path: string = '/') {
    await test.step(`Navigate to ${path}`, async () => {
      await this.page.goto(path);
    });
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
}
