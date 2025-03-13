import { Injectable } from '@nestjs/common';
import { chromium, Browser } from 'playwright';

@Injectable()
export class ScraperService {
  private browser: Browser;

  async launchBrowser() {
    this.browser = await chromium.launch({
      headless: false, // Cambia a true si no quieres ver la interfaz
    });
  }

  async loginAndGetProfile(email: string, password: string): Promise<string> {
    if (!this.browser) {
      await this.launchBrowser();
    }

    const context = await this.browser.newContext();
    const page = await context.newPage();

    // Ir a la página de login de LinkedIn
    await page.goto('https://www.linkedin.com/uas/login', {
      waitUntil: 'domcontentloaded',
    });

    // Introducir email y password
    await page.fill('input[name="session_key"]', email);
    await page.fill('input[name="session_password"]', password);

    // Hacer clic en el botón de login
    await page.click('button[data-litms-control-urn="login-submit"]');

    // Esperar que la navegación finalice
    await page.waitForLoadState('networkidle');

    // Ir al perfil de LinkedIn
    const profileURL = 'https://co.linkedin.com/in/luis-carlos-ballen';
    await page.goto(profileURL, { waitUntil: 'networkidle' });

    // Esperar a que aparezca la información
    await page.waitForSelector('.text-body-medium.break-words', { timeout: 30000 });

    // Extraer datos del perfil
    const profileData = await page.evaluate(() => {
      return document.querySelector('.text-body-medium.break-words')?.textContent?.trim() || 'No encontrado';
    });

    console.log(`Headline: ${profileData}`); // ✅ Verifica la extracción en la terminal

    await page.close();
    return `Headline: ${profileData}`;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
