import { test, expect } from '@playwright/test';

test.describe('首页 App 交互', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('每个作品 App 点击后应跳转或打开外部链接，不弹出二级弹窗', async ({ page, context }) => {
    const apps = await page.locator('.app-item:not([data-empty="true"])').all();
    expect(apps.length).toBeGreaterThan(0);

    for (const app of apps) {
      const href = await app.getAttribute('href');
      const target = await app.getAttribute('target');
      if (!href) continue;

      if (target === '_blank') {
        // 外部链接：验证会打开新标签页
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          app.click(),
        ]);
        await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await newPage.close();
      } else {
        await app.click();
        await page.waitForURL(href, { timeout: 5000 });
        await expect(page).toHaveURL(href);
        await page.goto('/');
      }

      await expect(page.locator('.app-modal')).not.toHaveClass(/is-open/);
    }
  });

  test('Dock 非弹窗项点击后应跳转或打开外部链接，不弹出二级弹窗', async ({ page, context }) => {
    const dockItems = await page.locator('.dock-item:not(.dock-item--modal)').all();
    expect(dockItems.length).toBeGreaterThan(0);

    for (const item of dockItems) {
      const href = await item.getAttribute('href');
      const target = await item.getAttribute('target');
      if (!href) continue;

      if (target === '_blank') {
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          item.click(),
        ]);
        await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await newPage.close();
      } else {
        await item.click();
        await page.waitForURL(href, { timeout: 5000 });
        await expect(page).toHaveURL(href);
        await page.goto('/');
      }

      await expect(page.locator('.app-modal')).not.toHaveClass(/is-open/);
    }
  });

  test('点击 empty App 应该弹出二级弹窗而不是跳转', async ({ page }) => {
    const emptyApps = await page.locator('[data-empty="true"]').all();
    if (emptyApps.length === 0) {
      test.skip('没有 empty App，跳过此测试');
      return;
    }

    const app = emptyApps[0];
    await app.click();

    await expect(page).toHaveURL('/');
    await expect(page.locator('.app-modal')).toHaveClass(/is-open/);
  });
});
