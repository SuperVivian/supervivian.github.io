import { test, expect } from '@playwright/test';

test.describe('樱花街道页面性能', () => {
  test('页面首次加载应在 3 秒内完成（移动端模拟）', async ({ page }) => {
    await page.goto('/works/sakura-street/', { waitUntil: 'load' });

    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadEventEnd: nav.loadEventEnd,
        domContentLoadedEventEnd: nav.domContentLoadedEventEnd,
      };
    });

    expect(
      timing.loadEventEnd,
      `页面 load 时间为 ${timing.loadEventEnd}ms，超过 3000ms`
    ).toBeLessThan(3000);
  });

  test('Three.js 等关键资源应能被正常请求', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });

    await page.goto('/works/sakura-street/', { waitUntil: 'networkidle' });

    expect(
      failedRequests,
      `以下资源加载失败：${failedRequests.join(', ')}`
    ).toHaveLength(0);
  });

  test('canvas 应该在合理时间内渲染', async ({ page }) => {
    await page.goto('/works/sakura-street/');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 5000 });
  });
});
