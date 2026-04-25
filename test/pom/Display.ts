import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly root: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.tce-multiple-choice');
    this.cards = this.root.locator('.v-card');
  }

  cardAt(index: number): Locator {
    return this.cards.nth(index);
  }
}
