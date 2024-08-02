import { Injectable, Logger } from '@nestjs/common';
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

@Injectable()
export class LinkedinService {
  private driver: WebDriver;
  private readonly logger = new Logger(LinkedinService.name);

  constructor() {
    const options = new chrome.Options();
    //options.addArguments('--headless');
    this.driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }

  async signInAndScrapeProfile(email: string, password: string): Promise<any> {
    try {
      await this.driver.get('https://www.linkedin.com/login');

      await this.driver.findElement(By.id('username')).sendKeys(email);
      await this.driver.findElement(By.id('password')).sendKeys(password);
      await this.driver.findElement(By.css('button[type="submit"]')).click();

      await this.driver.wait(until.urlContains('https://www.linkedin.com/feed'), 20000);
      
      // Scrape profile data
      await this.driver.get('https://www.linkedin.com/in/me');
      await this.driver.wait(until.elementLocated(By.css('h1')), 20000);

      const name = await this.getTextSafely('.text-heading-xlarge');
      const profileUrl = await this.driver.getCurrentUrl();
      const photoUrl = await this.getAttributeSafely('.pv-top-card__photo-wrapper img', 'src');
      
      return { name, profileUrl, photoUrl, email };
      
    } catch (error) {
      this.logger.error(`Failed to scrape LinkedIn profile: ${error.message}`);
      throw new Error(`Failed to scrape LinkedIn profile: ${error.message}`);
    } finally {
      await this.driver.quit();
    }
  }

  private async getTextSafely(selector: string): Promise<string> {
    try {
      const element = await this.driver.wait(until.elementLocated(By.css(selector)), 5000);
      return await element.getText();
    } catch (error) {
      this.logger.warn(`Failed to get text for selector "${selector}": ${error.message}`);
      return 'Not found';
    }
  }

  private async getAttributeSafely(selector: string, attribute: string): Promise<string> {
    try {
      const element = await this.driver.wait(until.elementLocated(By.css(selector)), 5000);
      return await element.getAttribute(attribute);
    } catch (error) {
      this.logger.warn(`Failed to get attribute "${attribute}" for selector "${selector}": ${error.message}`);
      return 'Not found';
    }
  }
}
