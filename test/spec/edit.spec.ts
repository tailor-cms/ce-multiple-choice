import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-multiple-choice-edit';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID, { isGradable: true });
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Initial render', () => {
  test('Renders 4 answer inputs and 4 checkboxes', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.answerInputs).toHaveCount(4);
    await expect(edit.checkboxes).toHaveCount(4);
    await expect(edit.addAnswerBtn).toBeVisible();
  });
});

test.describe('Answer management', () => {
  test('Persists multiple correct answers', async ({ page }) => {
    const edit = new Edit(page);
    await edit.answerInputs.nth(0).fill('A');
    await edit.answerInputs.nth(1).fill('B');
    await edit.answerInputs.nth(2).fill('C');
    await edit.answerInputs.nth(3).fill('D');
    await edit.checkboxes.nth(0).click();
    await edit.checkboxes.nth(2).click();
    await edit.form.saveBtn.click();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(edit.checkboxes.nth(0)).toBeChecked();
    await expect(edit.checkboxes.nth(2)).toBeChecked();
    await expect(edit.checkboxes.nth(1)).not.toBeChecked();
    await expect(edit.checkboxes.nth(3)).not.toBeChecked();
  });

  test('Adds a new answer', async ({ page }) => {
    const edit = new Edit(page);
    await edit.addAnswerBtn.click();
    await expect(edit.answerInputs).toHaveCount(5);
  });
});

test.describe('Non-gradable mode', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      isGradable: false,
      answers: ['', '', '', ''],
      embeds: {},
      question: [],
      hint: '',
      feedback: {},
    });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Shows "Options" label and hides checkboxes', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.root.getByText('Options')).toBeVisible();
    await expect(edit.checkboxes).toHaveCount(0);
  });
});
