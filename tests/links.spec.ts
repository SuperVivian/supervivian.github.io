import { test, expect } from '@playwright/test';

async function collectLinks(page, baseUrl: string): Promise<string[]> {
  return await page.evaluate((base) => {
    const links = Array.from(document.querySelectorAll('a[href]'));
    return links
      .map((a) => (a as HTMLAnchorElement).href)
      .filter((href) => href.startsWith(base) || href.startsWith('/'));
  }, baseUrl);
}

test.describe('全站链接有效性', () => {
  test('首页所有内部链接都能访问', async ({ page }) => {
    await page.goto('/');

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]'))
        .map((a) => (a as HTMLAnchorElement).getAttribute('href'))
        .filter((href): href is string => !!href)
        .filter((href) => !href.startsWith('http') && !href.startsWith('#'));
    });

    const uniqueLinks = [...new Set(links)];
    expect(uniqueLinks.length).toBeGreaterThan(0);

    for (const href of uniqueLinks) {
      const response = await page.request.get(href);
      expect(
        response.ok(),
        `链接 ${href} 返回 ${response.status()}`
      ).toBeTruthy();
    }
  });
});
