import { elementClient, pom } from '@tailor-cms/cek-e2e';
import { expect, test } from '@playwright/test';

import { Display } from '../pom';

const ELEMENT_ID = 'test-multiple-choice-display';

const SEED = {
  isGradable: true,
  answers: ['A', 'B', 'C', 'D'],
  correct: [0, 2],
  embeds: {
    prompt: {
      id: 'prompt',
      type: 'TIPTAP_HTML',
      position: 1,
      embedded: true,
      data: { content: 'Select all vowels.' },
    },
  },
  question: ['prompt'],
  hint: '',
  feedback: {},
};

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.resetState(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Empty state', () => {
  test('Renders placeholder when no answers are set', async ({ page }) => {
    const display = new Display(page);
    await expect(display.placeholder).toBeVisible();
  });
});

test.describe('With answers set', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, SEED);
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Renders all answer cards', async ({ page }) => {
    const display = new Display(page);
    await expect(display.cards).toHaveCount(4);
  });

  test('Supports selecting multiple answers and submitting', async ({
    page,
  }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(0).click();
    await display.cardAt(2).click();
    await expect(display.cardAt(0)).toHaveClass(/selected/);
    await expect(display.cardAt(2)).toHaveClass(/selected/);
    await form.submit();
    await expect(display.cardAt(0)).toHaveClass(/readonly/);
  });

  test('Submitting all correct answers shows success icons', async ({
    page,
  }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(0).click();
    await display.cardAt(2).click();
    await form.submit();
    await expect(display.cardAt(0).locator('.mdi-check-circle')).toBeVisible();
    await expect(display.cardAt(2).locator('.mdi-check-circle')).toBeVisible();
  });

  test('Submitting a wrong answer shows an error icon', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(1).click();
    await form.submit();
    await expect(display.cardAt(1).locator('.mdi-close-circle')).toBeVisible();
  });

  test('Submitting correct answers marks feedback as success', async ({
    page,
  }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(0).click();
    await display.cardAt(2).click();
    await form.submit();
    await expect(form.feedback).toHaveClass(/success/);
  });

  test('Submitting wrong answers marks feedback as error', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(1).click();
    await form.submit();
    await expect(form.feedback).toHaveClass(/error/);
  });
});

test.describe('Non-gradable mode', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      ...SEED,
      isGradable: false,
      correct: undefined,
    });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Feedback is not flagged as success or error', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(0).click();
    await form.submit();
    await expect(form.feedback).not.toHaveClass(/success/);
    await expect(form.feedback).not.toHaveClass(/error/);
  });
});
