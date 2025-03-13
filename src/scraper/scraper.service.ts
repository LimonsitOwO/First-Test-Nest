import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScraperService {
  private browser: puppeteer.Browser;

  async launchBrowser() {
    this.browser = await puppeteer.launch({
      headless: false, // Cambia a true si no quieres ver la interfaz del navegador
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 50, // Simula acciones humanas
    });
  }

  async loginAndGetProfile(email: string, password: string): Promise<string> {
    if (!this.browser) {
      await this.launchBrowser();
    }

    const page = await this.browser.newPage();
    await page.goto('https://www.linkedin.com/uas/login', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Introducir usuario y contraseña
    await page.type('input[name="session_key"]', email, { delay: 100 });
    await page.type('input[name="session_password"]', password, { delay: 100 });

    // Click en iniciar sesión
    await page.click('button[data-litms-control-urn="login-submit"]');

    // Esperar que cargue el dashboard
    await page.waitForSelector('.global-nav__me', { timeout: 20000 });

    // Ir manualmente al perfil
    await page.evaluate(() => {
      window.location.href = 'https://co.linkedin.com/in/luis-carlos-ballen';
    });

    // Esperar explícitamente a que aparezca la información
    await page.waitForSelector('.text-body-medium.break-words', { timeout: 30000 });

    // Extraer datos del perfil
    const profileData = await page.evaluate(() => {
      const headline =
        document.querySelector('.text-body-medium.break-words')?.textContent?.trim() ||
        'No encontrado';

      return { headline };
    });

    await page.close();
    return `Headline: ${profileData.headline}`;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
