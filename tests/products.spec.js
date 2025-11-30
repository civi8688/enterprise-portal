const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    // Load the local file. 
    // In a real server environment, this would be http://localhost:3000/products.html
    const fileUrl = 'file://' + path.resolve(__dirname, '../products.html');
    await page.goto(fileUrl);
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle('产品中心 - EnterprisePro');
  });

  test('should display all 6 product cards', async ({ page }) => {
    const cards = page.locator('.product-card');
    await expect(cards).toHaveCount(6);
  });

  test('should display AI Architecture Map content', async ({ page }) => {
    const card = page.locator('.product-card').filter({ hasText: 'AI 技术架构地图' });
    await expect(card).toBeVisible();
    await expect(card.locator('.card-text')).toContainText('全景式 AI 技术落地路径');
  });

  test('should display AI Service content', async ({ page }) => {
    const card = page.locator('.product-card').filter({ hasText: 'AI 智能服务' });
    await expect(card).toBeVisible();
    await expect(card.locator('.card-text')).toContainText('基于大语言模型与深度学习技术');
  });

  test('should toggle product details on click', async ({ page }) => {
    const card = page.locator('.product-card').first();
    const toggleBtn = card.locator('.toggle-details-btn');
    const detailsWrapper = card.locator('.product-details-wrapper');
    const details = card.locator('.product-details');

    // Initial state: wrapper height is 0
    // With min-height: 0 on the child and grid-template-rows: 0fr, the element should have 0 height.
    // Playwright's toBeVisible checks if bounding box > 0.
    await expect(detailsWrapper).not.toBeVisible();
    await expect(toggleBtn).toHaveText('查看详情');

    // Click to expand
    await toggleBtn.click();
    await expect(card).toHaveClass(/expanded/);
    // Wait for animation or check class state
    await expect(detailsWrapper).toBeVisible();
    await expect(toggleBtn).toHaveText('收起详情');

    // Click to collapse
    await toggleBtn.click();
    await expect(card).not.toHaveClass(/expanded/);
    await expect(detailsWrapper).not.toBeVisible();
    await expect(toggleBtn).toHaveText('查看详情');
  });

  test('should have accessibility attributes', async ({ page }) => {
    const card = page.locator('.product-card').first();
    const btn = card.locator('.toggle-details-btn');
    const details = card.locator('.product-details');

    // Check initial state
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    const detailsId = await details.getAttribute('id');
    expect(detailsId).toMatch(/product-details-\d+/);
    await expect(btn).toHaveAttribute('aria-controls', detailsId);

    // Check toggled state
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  test('should be responsive', async ({ page }) => {
    // Check mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const card = page.locator('.product-card').first();
    await expect(card).toBeVisible();
    // In mobile, columns stack, so width should be roughly viewport width minus padding
    const box = await card.boundingBox();
    expect(box.width).toBeLessThan(375);
    expect(box.width).toBeGreaterThan(300); // Reasonable assumption for mobile layout
  });
});
