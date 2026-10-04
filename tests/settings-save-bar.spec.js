import { test, expect } from '@playwright/test';
import process from 'process';

// Runs against a real account. Use a THROWAWAY test account: the save test
// edits the bio (and restores it afterwards).
const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

const saveBar = (page) => page.getByRole('region', { name: 'Save changes' });
const bioInput = (page) => page.getByPlaceholder(/tell others a bit about yourself/i);

test.describe('Settings — sticky save bar', () => {
  test.skip(!EMAIL || !PASSWORD, 'Set TEST_EMAIL and TEST_PASSWORD (a throwaway account) to run');

  test.beforeEach(async ({ page }) => {
    await page.goto('/get-started');
    // Toggle from "Create account" to the sign-in form, then submit it.
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await page.getByPlaceholder('johndoe@example.com').fill(EMAIL);
    await page.getByPlaceholder('••••••••').first().fill(PASSWORD);
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await page.waitForURL((url) => !url.pathname.startsWith('/get-started'));

    await page.goto('/my-profile/settings');
    await expect(bioInput(page)).toBeVisible();
  });

  test('appears only after an edit, and Discard restores the saved value', async ({ page }) => {
    await expect(saveBar(page)).toHaveCount(0);

    const original = await bioInput(page).inputValue();
    await bioInput(page).fill(`${original} (edited)`);
    await expect(saveBar(page)).toContainText('You have unsaved changes');

    await saveBar(page).getByRole('button', { name: 'Discard' }).click();
    await expect(bioInput(page)).toHaveValue(original);
    await expect(saveBar(page)).toBeHidden();
  });

  test('saves with progress feedback, confirms, and the change survives a reload', async ({ page }) => {
    const original = await bioInput(page).inputValue();
    const edited = `${original} (e2e ${Date.now()})`.trim();

    await bioInput(page).fill(edited);
    await saveBar(page).getByRole('button', { name: 'Save changes' }).click();
    await expect(saveBar(page)).toContainText('Changes saved');

    await page.reload();
    await expect(bioInput(page)).toHaveValue(edited);

    // Clean up: put the original bio back, this time with Ctrl/Cmd+S.
    await bioInput(page).fill(original);
    await page.keyboard.press('ControlOrMeta+s');
    await expect(saveBar(page)).toContainText('Changes saved');
  });

  test('asks before leaving with unsaved changes', async ({ page }) => {
    const original = await bioInput(page).inputValue();
    await bioInput(page).fill(`${original} (unsaved)`);

    let message = '';
    page.once('dialog', async (dialog) => {
      message = dialog.message();
      await dialog.dismiss(); // "Stay"
    });
    await page.getByRole('link', { name: /^followers$/i }).first().click();

    await expect.poll(() => message).toMatch(/unsaved changes/i);
    await expect(page).toHaveURL(/\/my-profile\/settings$/);
    await expect(bioInput(page)).toHaveValue(`${original} (unsaved)`);
  });
});
