import { test, expect } from '@playwright/test';
import process from 'process';

test.describe('User Profile Page', () => {
  test('shows "User not found" for a non-existent username', async ({ page }) => {
    await page.goto('/users/thisuserdoesnotexist99999');
    await expect(page.getByText(/user not found/i)).toBeVisible();
  });

  test('profile page renders without crashing for unknown user', async ({ page }) => {
    await page.goto('/users/somerandomunknownuser');
    await expect(page.locator('body')).toBeVisible();
    // Should not show a JS error page or blank screen
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('profile URL structure is correct', async ({ page }) => {
    await page.goto('/users/testuser');
    await expect(page).toHaveURL('/users/testuser');
  });

  test('shows loading state briefly then resolves', async ({ page }) => {
    await page.goto('/users/anyuser');
    // After loading resolves, either profile or "not found" is shown
    await expect(page.locator('body')).not.toContainText('Loading...');
  });

  test('navbar is present on profile page', async ({ page }) => {
    await page.goto('/users/anyuser');
    await expect(page.getByRole('link', { name: /devswebs/i })).toBeVisible();
  });

  test('footer is present on profile page', async ({ page }) => {
    await page.goto('/users/anyuser');
    await expect(page.locator('footer')).toBeVisible();
  });
});

// These tests require a real username in your DB — update TEST_USERNAME to a real one
const TEST_USERNAME = process.env.TEST_USERNAME || null;

test.describe('User Profile - With Real User', () => {
  test.skip(!TEST_USERNAME, 'Set TEST_USERNAME env var to run these tests');

  test('shows user full name', async ({ page }) => {
    await page.goto(`/users/${TEST_USERNAME}`);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('shows followers, following and posts stats', async ({ page }) => {
    await page.goto(`/users/${TEST_USERNAME}`);
    await expect(page.getByText('Followers')).toBeVisible();
    await expect(page.getByText('Following')).toBeVisible();
    await expect(page.getByText('Posts')).toBeVisible();
  });

  test('shows follow button when not logged in', async ({ page }) => {
    await page.goto(`/users/${TEST_USERNAME}`);
    await expect(page.getByRole('button', { name: /follow/i })).toBeVisible();
  });

  test('shows message button', async ({ page }) => {
    await page.goto(`/users/${TEST_USERNAME}`);
    await expect(page.getByRole('link', { name: /message/i })).toBeVisible();
  });
});
